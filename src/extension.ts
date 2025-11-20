import * as vscode from "vscode";
import {
  TrackerData,
  FileStats,
  HistoryEvent,
  InlineCompletionContext,
} from "./types";
import {
  loadTrackerData,
  saveTrackerData,
  debouncedSave,
  createEmptyTrackerData,
} from "./storage";
import { hashContent } from "./crypto";

let trackerData: TrackerData | null = null;
let workspaceFolder: vscode.WorkspaceFolder | null = null;
let inlineCompletionTracker = new Map<string, InlineCompletionContext>();

export function activate(context: vscode.ExtensionContext) {
  console.log("whoDare extension is now active!");

  // Get workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage(
      "whoDare: No workspace folder found. Extension requires a workspace."
    );
    return;
  }

  workspaceFolder = workspaceFolders[0];

  // Load existing data or create new
  loadTrackerData(workspaceFolder).then((loadedData) => {
    if (loadedData) {
      trackerData = loadedData;
      console.log("[whoDare] Loaded existing data");
    } else {
      trackerData = createEmptyTrackerData(workspaceFolder!.uri.fsPath);
      console.log("[whoDare] Created new tracker data");
    }
    updateStatusBar();
  });

  // Create status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = "howDare.showStats";
  statusBarItem.show();

  // Helper function to update status bar
  function updateStatusBar() {
    if (!trackerData) {
      statusBarItem.text = "whoDare: Loading...";
      return;
    }

    const totalLines =
      trackerData.sessionStats.totalHumanLines +
      trackerData.sessionStats.totalAiLines;
    if (totalLines === 0) {
      statusBarItem.text = "whoDare: No activity";
      return;
    }

    const humanPercentage = Math.round(
      (trackerData.sessionStats.totalHumanLines / totalLines) * 100
    );
    const aiPercentage = 100 - humanPercentage;
    statusBarItem.text = `whoDare: Human ${humanPercentage}% | AI ${aiPercentage}%`;
  }

  // Track inline completions (AI assists like Copilot)
  const inlineCompletionDisposable =
    vscode.window.onDidChangeTextEditorSelection((event) => {
      const editor = event.textEditor;
      const document = editor.document;

      if (document.uri.scheme !== "file") {
        return;
      }

      // Check if there's a suggestion visible (this is a heuristic)
      // When user accepts an inline completion, we track it
      const selections = event.selections;
      if (selections.length > 0) {
        const selection = selections[0];
        if (!selection.isEmpty) {
          // Track this as potential AI completion
          const key = `${document.uri.toString()}-${Date.now()}`;
          inlineCompletionTracker.set(key, {
            isAiGenerated: true,
            timestamp: Date.now(),
            text: document.getText(selection),
          });

          // Clean up old entries (older than 5 seconds)
          const now = Date.now();
          for (const [k, v] of inlineCompletionTracker.entries()) {
            if (now - v.timestamp > 5000) {
              inlineCompletionTracker.delete(k);
            }
          }
        }
      }
    });

  // Helper function to classify edit as human or AI
  function classifyEdit(
    change: vscode.TextDocumentContentChangeEvent,
    document: vscode.TextDocument
  ): "human" | "ai" {
    const text = change.text;
    const rangeLength = change.rangeLength;

    // Check if this was tracked as an inline completion
    const now = Date.now();
    for (const [key, context] of inlineCompletionTracker.entries()) {
      if (
        context.isAiGenerated &&
        now - context.timestamp < 1000 &&
        text.includes(context.text.substring(0, Math.min(20, context.text.length)))
      ) {
        inlineCompletionTracker.delete(key);
        return "ai";
      }
    }

    // If it's a deletion (rangeLength > 0 but text is empty or small)
    if (rangeLength > 0 && text.length === 0) {
      return "human"; // Deletions are typically human
    }

    // If it's a replacement or insertion
    if (text.length > 0) {
      const hasNewlines = text.includes("\n");
      const isLargeInsertion = text.length > 50;
      const hasMultipleLines = (text.match(/\n/g) || []).length > 2;

      // AI-generated: Large insertions or significant multi-line content
      if (isLargeInsertion || hasMultipleLines) {
        return "ai";
      }

      // Check for paste operations (large single-line or formatted code)
      if (text.length > 30 && (hasNewlines || /^[\s\t]+/.test(text))) {
        return "ai";
      }

      // Human-written: Small, incremental changes
      return "human";
    }

    return "human"; // Default to human for edge cases
  }

  // Helper function to count lines in text
  function countLines(text: string): number {
    if (text.length === 0) return 0;
    const lines = text.split("\n").length;
    return Math.max(1, lines);
  }

  // Helper function to get or create file stats
  function getFileStats(filePath: string, document: vscode.TextDocument): FileStats {
    if (!trackerData) {
      throw new Error("Tracker data not initialized");
    }

    if (!trackerData.files[filePath]) {
      const content = document.getText();
      trackerData.files[filePath] = {
        humanLines: 0,
        aiLines: 0,
        humanChars: 0,
        aiChars: 0,
        hash: hashContent(content),
        history: [],
      };
    }

    return trackerData.files[filePath];
  }

  // Helper function to add history event
  function addHistoryEvent(event: HistoryEvent) {
    if (!trackerData) return;

    // Add to file-specific history
    const fileStats = trackerData.files[event.fileName];
    if (fileStats) {
      fileStats.history.push(event);

      // Keep last 30 events per file (enough for detail view)
      if (fileStats.history.length > 30) {
        fileStats.history = fileStats.history.slice(-30);
      }
    }

    // Add to global history
    trackerData.globalHistory.push(event);

    // Keep last 100 events globally (enough for timeline charts)
    if (trackerData.globalHistory.length > 100) {
      trackerData.globalHistory = trackerData.globalHistory.slice(-100);
    }
  }

  // Text document change listener
  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    if (!trackerData || !workspaceFolder) return;

    const document = event.document;

    // Skip if not a file we want to track
    if (document.uri.scheme !== "file") {
      return;
    }

    const fileUri = document.uri.toString();
    const relativePath = vscode.workspace.asRelativePath(document.uri);
    const stats = getFileStats(relativePath, document);

    // Process each change
    for (const change of event.contentChanges) {
      // Skip empty changes
      if (change.rangeLength === 0 && change.text.length === 0) {
        continue;
      }

      const editType = classifyEdit(change, document);
      const addedLines = change.text.length > 0 ? countLines(change.text) : 0;
      const addedChars = change.text.length;
      const deletedLines =
        change.rangeLength > 0
          ? Math.max(1, change.range.end.line - change.range.start.line + 1)
          : 0;
      const deletedChars = change.rangeLength;

      // Create history event
      const historyEvent: HistoryEvent = {
        timestamp: Date.now(),
        fileName: relativePath,
        type: editType,
        linesAdded: addedLines,
        charsAdded: addedChars,
        linesDeleted: deletedLines,
        charsDeleted: deletedChars,
        operation:
          change.rangeLength > 0 && change.text.length > 0
            ? "modify"
            : change.rangeLength > 0
            ? "delete"
            : "add",
      };

      addHistoryEvent(historyEvent);

      // Update file stats
      if (editType === "human") {
        stats.humanLines += addedLines;
        stats.humanChars += addedChars;
        trackerData.sessionStats.totalHumanLines += addedLines;
        trackerData.sessionStats.totalHumanChars += addedChars;
      } else {
        stats.aiLines += addedLines;
        stats.aiChars += addedChars;
        trackerData.sessionStats.totalAiLines += addedLines;
        trackerData.sessionStats.totalAiChars += addedChars;
      }

      // Handle deletions
      if (change.rangeLength > 0) {
        // Subtract from appropriate category (prefer human for deletions)
        if (stats.humanLines >= deletedLines) {
          stats.humanLines -= deletedLines;
          trackerData.sessionStats.totalHumanLines -= deletedLines;
        } else if (stats.aiLines >= deletedLines) {
          stats.aiLines -= deletedLines;
          trackerData.sessionStats.totalAiLines -= deletedLines;
        }

        if (stats.humanChars >= deletedChars) {
          stats.humanChars -= deletedChars;
          trackerData.sessionStats.totalHumanChars -= deletedChars;
        } else if (stats.aiChars >= deletedChars) {
          stats.aiChars -= deletedChars;
          trackerData.sessionStats.totalAiChars -= deletedChars;
        }
      }
    }

    // Update file hash
    stats.hash = hashContent(document.getText());
    trackerData.lastUpdated = Date.now();

    updateStatusBar();

    // Debounced save to disk
    debouncedSave(workspaceFolder!, trackerData);
  });

  // Show stats command
  const showStatsCommand = vscode.commands.registerCommand(
    "howDare.showStats",
    () => {
      if (!trackerData) {
        vscode.window.showWarningMessage("whoDare: Data not loaded yet");
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        "howDareStats",
        "whoDare Statistics",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      const totalLines =
        trackerData.sessionStats.totalHumanLines +
        trackerData.sessionStats.totalAiLines;
      const humanPercentage =
        totalLines > 0
          ? (trackerData.sessionStats.totalHumanLines / totalLines) * 100
          : 0;
      const aiPercentage =
        totalLines > 0
          ? (trackerData.sessionStats.totalAiLines / totalLines) * 100
          : 0;

      // Generate file-by-file breakdown
      let fileBreakdown = "";
      for (const [filePath, stats] of Object.entries(trackerData.files)) {
        const fileTotal = stats.humanLines + stats.aiLines;
        if (fileTotal > 0) {
          const fileHumanPercent = Math.round(
            (stats.humanLines / fileTotal) * 100
          );
          const fileAiPercent = 100 - fileHumanPercent;
          fileBreakdown += `
                    <tr>
                        <td>${filePath}</td>
                        <td>${stats.humanLines}</td>
                        <td>${stats.aiLines}</td>
                        <td>${fileHumanPercent}%</td>
                        <td>${fileAiPercent}%</td>
                        <td>${stats.history.length} events</td>
                    </tr>
                `;
        }
      }

      panel.webview.html = getWebviewContent(
        trackerData.sessionStats.totalHumanLines,
        trackerData.sessionStats.totalAiLines,
        humanPercentage,
        aiPercentage,
        fileBreakdown,
        trackerData.globalHistory.length
      );
    }
  );

  // Save on deactivation
  context.subscriptions.push({
    dispose: () => {
      if (trackerData && workspaceFolder) {
        saveTrackerData(workspaceFolder, trackerData).catch(console.error);
      }
    },
  });

  // Register disposables
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(changeListener);
  context.subscriptions.push(showStatsCommand);
  context.subscriptions.push(inlineCompletionDisposable);
}

function getWebviewContent(
  humanLines: number,
  aiLines: number,
  humanPercentage: number,
  aiPercentage: number,
  fileBreakdown: string,
  totalEvents: number
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>whoDare Statistics</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .chart-container {
            width: 400px;
            height: 400px;
            margin: 20px auto;
        }
        .stats-summary {
            text-align: center;
            margin: 20px 0;
        }
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .stats-table th,
        .stats-table td {
            border: 1px solid var(--vscode-panel-border);
            padding: 8px;
            text-align: left;
        }
        .stats-table th {
            background-color: var(--vscode-panel-background);
        }
        h1, h2 {
            color: var(--vscode-foreground);
        }
        .no-data {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            margin: 40px 0;
        }
        .info-box {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 12px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>whoDare Statistics</h1>
        
        <div class="info-box">
            <strong>📊 Total Historical Events:</strong> ${totalEvents}
            <br>
            <strong>💾 Data Status:</strong> Encrypted and saved to <code>.howdare/stats.json</code>
            <br>
            <strong>🌐 Shareable:</strong> Push this file to GitHub to share your coding statistics!
        </div>

        ${
          humanLines + aiLines === 0
            ? `
            <div class="no-data">
                <h2>No code activity detected yet</h2>
                <p>Start editing files to see your human vs AI code contribution statistics!</p>
            </div>
        `
            : `
            <div class="stats-summary">
                <h2>Session Overview</h2>
                <p><strong>Total Lines:</strong> ${humanLines + aiLines}</p>
                <p><strong>Human Lines:</strong> ${humanLines} (${humanPercentage.toFixed(
                1
              )}%)</p>
                <p><strong>AI Lines:</strong> ${aiLines} (${aiPercentage.toFixed(
                1
              )}%)</p>
            </div>

            <div class="chart-container">
                <canvas id="pieChart"></canvas>
            </div>

            ${
              fileBreakdown
                ? `
                <h2>File Breakdown</h2>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Human Lines</th>
                            <th>AI Lines</th>
                            <th>Human %</th>
                            <th>AI %</th>
                            <th>History</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fileBreakdown}
                    </tbody>
                </table>
            `
                : ""
            }
        `
        }
    </div>

    <script>
        ${
          humanLines + aiLines > 0
            ? `
            const ctx = document.getElementById('pieChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Human-written', 'AI-generated'],
                    datasets: [{
                        data: [${humanPercentage}, ${aiPercentage}],
                        backgroundColor: [
                            '#4CAF50',
                            '#FF9800'
                        ],
                        borderColor: [
                            '#45a049',
                            '#e68900'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Human vs AI Code Contributions',
                            color: getComputedStyle(document.body).getPropertyValue('--vscode-foreground')
                        },
                        legend: {
                            labels: {
                                color: getComputedStyle(document.body).getPropertyValue('--vscode-foreground')
                            }
                        }
                    }
                }
            });
        `
            : ""
        }
    </script>
</body>
</html>`;
}

export function deactivate() {
  console.log("whoDare extension is now deactivated");
}
