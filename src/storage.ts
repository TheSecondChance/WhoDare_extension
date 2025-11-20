import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { TrackerData } from "./types";

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
 * Saves tracker data to plain JSON file (formatted for readability)
 */
export async function saveTrackerData(
  workspaceFolder: vscode.WorkspaceFolder,
  data: TrackerData
): Promise<void> {
  try {
    ensureStorageDirectory(workspaceFolder);

    const filePath = getStatsFilePath(workspaceFolder);
    // Save formatted JSON (2 space indentation) for readability
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    console.log(`[whoDare] Data saved to ${filePath}`);
  } catch (error) {
    console.error("[whoDare] Failed to save data:", error);
    throw error;
  }
}

/**
 * Loads tracker data from plain JSON file
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
    const parsedData = JSON.parse(fileContent);

    // Check if this is old encrypted format
    if (parsedData.encrypted === true && parsedData.data) {
      console.error("[whoDare] Old encrypted format detected. Cannot load encrypted data.");
      console.error("[whoDare] Please delete .howdare/stats.json to start fresh with plain JSON.");
      return null;
    }

    const data: TrackerData = parsedData as TrackerData;

    // Backward compatibility: ensure dailyStats exists
    if (!data.dailyStats) {
      data.dailyStats = [];
      console.log("[whoDare] Migrated old data format to include dailyStats");
    }

    // Remove hash field from files if it exists (migration from old format)
    for (const filePath in data.files) {
      const fileStats = data.files[filePath] as any;
      if (fileStats.hash !== undefined) {
        delete fileStats.hash;
      }
    }

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
    dailyStats: [],
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

