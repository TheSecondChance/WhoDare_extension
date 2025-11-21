# Data Structure Update - Daily Statistics

## Overview

The whoDare extension has been updated to track **daily usage statistics** instead of content hashing. This provides more meaningful insights into your coding patterns over time.

## What Changed

### 1. Removed Features
- ❌ **Content Hashing**: Removed `hashContent()` function and `hash` field from file statistics
- ❌ **Hash-based Change Detection**: No longer tracking file content hashes

### 2. Added Features
- ✅ **Daily Statistics Tracking**: New `dailyStats` array tracks usage per day
- ✅ **Daily Breakdown View**: Web viewer now shows a table of daily activity
- ✅ **Enhanced Timeline Chart**: Shows last 30 days of coding activity
- ✅ **Event Counting**: Tracks number of coding events per day

## New Data Structure

### DailyStats Interface
```typescript
interface DailyStats {
  date: string;           // YYYY-MM-DD format
  humanLines: number;     // Human-written lines for the day
  aiLines: number;        // AI-generated lines for the day
  humanChars: number;     // Human-written characters
  aiChars: number;        // AI-generated characters
  events: number;         // Number of coding events
}
```

### Updated TrackerData
```typescript
interface TrackerData {
  version: string;
  workspaceId: string;
  files: FileTracking;
  globalHistory: HistoryEvent[];
  sessionStats: SessionStats;
  dailyStats: DailyStats[];    // NEW: Daily usage breakdown
  lastUpdated: number;
}
```

### Updated FileStats (Removed Hash)
```typescript
interface FileStats {
  humanLines: number;
  aiLines: number;
  humanChars: number;
  aiChars: number;
  // hash: string;  // REMOVED
  history: HistoryEvent[];
}
```

## Backward Compatibility

The extension automatically migrates old data:
- ✅ Initializes empty `dailyStats` array for existing data
- ✅ Removes `hash` field from file statistics
- ✅ Preserves all historical events and session stats
- ✅ No data loss during migration

## Benefits

### More Useful Data
- 📊 **Daily Trends**: See which days you code the most
- 📈 **Activity Patterns**: Identify productive periods
- 🎯 **Goal Tracking**: Monitor daily coding goals
- 📅 **Historical View**: Review up to 30 days of activity

### Smaller File Size
- Removed SHA-256 hashes (64 characters per file)
- More efficient storage without redundant hash data
- Faster load times for statistics

### Better Visualizations
- **Daily Breakdown Table**: Shows comprehensive daily statistics
- **Timeline Chart**: Displays 30-day activity chart with bars
- **Event Tracking**: See how many edits you made each day
- **Percentage Tracking**: Daily human vs AI percentages

## Web Viewer Updates

### New Components
1. **DailyBreakdown**: Table showing last 30 days of activity
2. **Updated TimelineChart**: Bar chart with daily statistics
3. **Enhanced Metadata**: Shows "Days Tracked" count

### Chart Improvements
- Timeline now shows actual dates (e.g., "Jan 15", "Jan 16")
- Tooltip shows full date, lines, and event count
- Last 30 days visible at a glance
- Color-coded human/AI contributions

## Files Modified

### Extension (src/)
- `types.ts` - Added `DailyStats`, removed hash field
- `crypto.ts` - Removed `hashContent()` function
- `storage.ts` - Added migration logic, updated creation
- `extension.ts` - Removed hash tracking, added daily stats updates

### Web Viewer (web-viewer/src/)
- `types.ts` - Added `DailyStats`, removed hash field
- `components/TimelineChart.tsx` - Completely rewritten for daily stats
- `components/DailyBreakdown.tsx` - NEW: Daily table component
- `components/StatsChart.tsx` - Fixed TypeScript warning
- `utils/crypto.ts` - Fixed TypeScript type issue
- `App.tsx` - Added DailyBreakdown component and updated metadata

## Usage

### Extension
The extension automatically tracks daily statistics:
1. Each coding event updates today's stats
2. Stats are saved to `.whodare/stats.json`
3. Data persists across sessions
4. New day = new entry in dailyStats array

### Web Viewer
View your daily statistics:
1. Enter GitHub repository URL
2. Fetch statistics (auto-decrypts)
3. See "Daily Usage Breakdown" table
4. View "Daily Activity (Last 30 Days)" chart
5. Check metadata for total days tracked

## Migration Process

When you load existing data:
1. Extension detects missing `dailyStats` field
2. Initializes empty array: `dailyStats: []`
3. Removes old `hash` fields from file stats
4. Logs: "[whoDare] Migrated old data format"
5. Continues normal operation

**Note**: Historical data before this update won't have daily breakdowns, but all future coding will be tracked daily.

## What You Get Now

### In stats.json
```json
{
  "version": "1.0",
  "workspaceId": "...",
  "files": { ... },
  "sessionStats": { ... },
  "dailyStats": [
    {
      "date": "2025-01-15",
      "humanLines": 145,
      "aiLines": 67,
      "humanChars": 3421,
      "aiChars": 1523,
      "events": 42
    },
    {
      "date": "2025-01-16",
      "humanLines": 203,
      "aiLines": 89,
      "humanChars": 4782,
      "aiChars": 2104,
      "events": 56
    }
  ],
  "globalHistory": [ ... ],
  "lastUpdated": 1705401234567
}
```

### In Web Viewer
- **Summary Cards**: Total lines, human/AI breakdown, characters
- **Pie Chart**: Overall distribution
- **Daily Timeline**: 30-day bar chart
- **Daily Table**: Detailed daily breakdown with events
- **File Breakdown**: Per-file statistics
- **Metadata**: Version, workspace ID, days tracked, total events

## Performance

- ✅ No hash calculation overhead (removed)
- ✅ Faster file save operations
- ✅ Smaller JSON file size
- ✅ Efficient daily stats updates
- ✅ Optimized history (keeps last 100 events)

## Testing

To test the new features:
1. Compile extension: `npm run compile`
2. Press F5 to launch extension
3. Code in a new workspace
4. Check `.whodare/stats.json` for dailyStats array
5. Build web viewer: `cd web-viewer && npm run build`
6. Run web viewer: `npm run dev`
7. Load your stats and see daily breakdown

## Upgrading

1. Pull latest changes
2. Run `npm install` in root and web-viewer directories
3. Compile extension: `npm run compile`
4. Build web viewer: `cd web-viewer && npm run build`
5. Restart VS Code
6. Your existing data will auto-migrate!

---

**Version**: 1.1
**Date**: November 20, 2025
**Status**: ✅ Complete - Ready for use

