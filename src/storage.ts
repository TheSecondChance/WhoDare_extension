import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { TrackerData, EncryptedData } from "./types";
import { encrypt, decrypt, generateDefaultKey } from "./crypto";

const STORAGE_DIR = ".howdare";
const STORAGE_FILE = "stats.json";

/**
 * Gets the storage directory path for the workspace
 */
export function getStoragePath(workspaceFolder: vscode.WorkspaceFolder): string {
  return path.join(workspaceFolder.uri.fsPath, STORAGE_DIR);
}

/**
 * Gets the full path to the stats file
 */
export function getStatsFilePath(
  workspaceFolder: vscode.WorkspaceFolder
): string {
  return path.join(getStoragePath(workspaceFolder), STORAGE_FILE);
}

/**
 * Ensures the storage directory exists
 */
export function ensureStorageDirectory(
  workspaceFolder: vscode.WorkspaceFolder
): void {
  const storagePath = getStoragePath(workspaceFolder);
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }
}

/**
 * Gets the encryption key for the workspace
 * Can be configured by user or uses default
 */
export function getEncryptionKey(
  workspaceFolder: vscode.WorkspaceFolder
): string {
  const config = vscode.workspace.getConfiguration("howDare");
  const userKey = config.get<string>("encryptionKey");

  if (userKey && userKey.trim().length > 0) {
    return userKey;
  }

  // Generate default key based on workspace path
  const workspaceId = workspaceFolder.uri.fsPath;
  return generateDefaultKey(workspaceId);
}

/**
 * Optimizes tracker data by limiting history size
 */
function optimizeTrackerData(data: TrackerData): TrackerData {
  const optimized = { ...data };
  
  // Keep last 100 global history events for timeline charts
  if (optimized.globalHistory.length > 100) {
    optimized.globalHistory = optimized.globalHistory.slice(-100);
  }
  
  // Keep last 30 events per file
  for (const filePath in optimized.files) {
    const fileStats = optimized.files[filePath];
    if (fileStats.history.length > 30) {
      fileStats.history = fileStats.history.slice(-30);
    }
  }
  
  return optimized;
}

/**
 * Saves tracker data to encrypted file (minified JSON, no compression)
 */
export async function saveTrackerData(
  workspaceFolder: vscode.WorkspaceFolder,
  data: TrackerData
): Promise<void> {
  try {
    ensureStorageDirectory(workspaceFolder);

    // Optimize data (reduce history)
    const optimizedData = optimizeTrackerData(data);

    const encryptionKey = getEncryptionKey(workspaceFolder);
    
    // Minified JSON (no whitespace) then encrypt
    const jsonData = JSON.stringify(optimizedData);
    const encryptedPayload = encrypt(jsonData, encryptionKey);

    const encryptedData: EncryptedData = {
      version: "1.0",
      encrypted: true,
      data: encryptedPayload,
      workspaceId: optimizedData.workspaceId,
    };

    const filePath = getStatsFilePath(workspaceFolder);
    // Save minified (no whitespace)
    fs.writeFileSync(filePath, JSON.stringify(encryptedData), "utf8");

    console.log(`[whoDare] Data saved to ${filePath}`);
  } catch (error) {
    console.error("[whoDare] Failed to save data:", error);
    throw error;
  }
}

/**
 * Loads tracker data from encrypted file
 */
export async function loadTrackerData(
  workspaceFolder: vscode.WorkspaceFolder
): Promise<TrackerData | null> {
  try {
    const filePath = getStatsFilePath(workspaceFolder);

    if (!fs.existsSync(filePath)) {
      console.log("[whoDare] No existing data file found");
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const encryptedData: EncryptedData = JSON.parse(fileContent);

    if (!encryptedData.encrypted) {
      console.warn("[whoDare] Data is not encrypted");
      return null;
    }

    const encryptionKey = getEncryptionKey(workspaceFolder);
    const decryptedJson = decrypt(encryptedData.data, encryptionKey);
    const data: TrackerData = JSON.parse(decryptedJson);

    console.log(`[whoDare] Data loaded from ${filePath}`);
    return data;
  } catch (error) {
    console.error("[whoDare] Failed to load data:", error);
    return null;
  }
}

/**
 * Creates a new empty tracker data structure
 */
export function createEmptyTrackerData(workspaceId: string): TrackerData {
  return {
    version: "1.0",
    workspaceId,
    files: {},
    globalHistory: [],
    sessionStats: {
      totalHumanLines: 0,
      totalAiLines: 0,
      totalHumanChars: 0,
      totalAiChars: 0,
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Debounced save function to avoid excessive writes
 */
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DEBOUNCE_MS = 2000; // 2 seconds

export function debouncedSave(
  workspaceFolder: vscode.WorkspaceFolder,
  data: TrackerData
): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    saveTrackerData(workspaceFolder, data).catch((error) => {
      console.error("[whoDare] Debounced save failed:", error);
    });
  }, SAVE_DEBOUNCE_MS);
}

