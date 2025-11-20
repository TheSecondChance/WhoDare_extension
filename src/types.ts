export interface FileStats {
  humanLines: number;
  aiLines: number;
  humanChars: number;
  aiChars: number;
  hash: string; // Content hash for tracking changes
  history: HistoryEvent[];
}

export interface SessionStats {
  totalHumanLines: number;
  totalAiLines: number;
  totalHumanChars: number;
  totalAiChars: number;
}

export interface HistoryEvent {
  timestamp: number; // Unix timestamp in milliseconds
  fileName: string;
  type: "human" | "ai";
  linesAdded: number;
  charsAdded: number;
  linesDeleted: number;
  charsDeleted: number;
  operation: "add" | "delete" | "modify";
}

export interface FileTracking {
  [filePath: string]: FileStats;
}

export interface TrackerData {
  version: string;
  workspaceId: string;
  files: FileTracking;
  globalHistory: HistoryEvent[];
  sessionStats: SessionStats;
  lastUpdated: number;
}

export interface EncryptedData {
  version: string;
  encrypted: boolean;
  data: string; // Base64 encoded encrypted payload
  workspaceId?: string; // Optional identifier
}

export interface InlineCompletionContext {
  isAiGenerated: boolean;
  timestamp: number;
  text: string;
}

