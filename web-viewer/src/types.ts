export interface FileStats {
  humanLines: number;
  aiLines: number;
  humanChars: number;
  aiChars: number;
  history: HistoryEvent[];
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  humanLines: number;
  aiLines: number;
  humanChars: number;
  aiChars: number;
  events: number; // Number of coding events that day
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
  dailyStats: DailyStats[]; // Daily usage breakdown
  lastUpdated: number;
}

