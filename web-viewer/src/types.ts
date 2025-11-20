export interface FileStats {
  humanLines: number;
  aiLines: number;
  humanChars: number;
  aiChars: number;
  hash: string;
  history: HistoryEvent[];
}

export interface HistoryEvent {
  timestamp: number;
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

export interface SessionStats {
  totalHumanLines: number;
  totalAiLines: number;
  totalHumanChars: number;
  totalAiChars: number;
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
  data: string;
  workspaceId?: string;
}

