# whoDare - AI vs Human Code Contribution Tracker

A comprehensive VS Code extension and web viewer for tracking and visualizing AI-generated vs human-written code contributions.

## 🚀 Features

### VS Code Extension

- **Real-time Tracking**: Monitors text changes across all open files
- **AI Detection**: Automatically identifies AI-generated code using inline completion API and heuristics
- **Plain JSON Storage**: Stores statistics in readable `.whodare/stats.json`
- **Per-file Breakdown**: Track contributions on a file-by-file basis
- **Historical Tracking**: Complete history of every code change event
- **Daily Statistics**: Track your coding activity day by day
- **Visual Stats**: Beautiful in-editor statistics dashboard

### Web Viewer

- **GitHub Integration**: Fetch and display stats from any GitHub repository
- **Plain JSON Format**: Directly loads readable statistics files
- **Rich Visualizations**: Pie charts, timelines, daily breakdowns, and detailed tables
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with React, TypeScript, and shadcn/ui

## 📦 Installation

### VS Code Extension

1. Clone this repository
2. Open in VS Code
3. Run `npm install`
4. Press F5 to start debugging
5. The extension will activate in a new VS Code window

### Web Viewer

```bash
cd web-viewer
npm install
npm run dev
```

## 🎯 Usage

### Extension Setup

1. Open any workspace in VS Code
2. The extension activates automatically
3. Start coding - changes are tracked automatically
4. Click the status bar item to view statistics
5. Stats are saved to `.whodare/stats.json` (plain JSON format)

### Viewing Statistics

#### In VS Code

- Click the whoDare status bar item
- Or run command: `whoDare: Show Code Statistics`

#### On the Web

1. Build and run the web viewer
2. Enter your GitHub repository URL
3. Data is automatically loaded
4. View beautiful visualizations!

## 📊 Data Format

The extension stores data in plain JSON format in `.whodare/stats.json`:

```json
{
  "version": "1.0",
  "workspaceId": "workspace-path",
  "files": {
    "src/example.ts": {
      "humanLines": 145,
      "aiLines": 67,
      "humanChars": 3421,
      "aiChars": 1523,
      "history": [...]
    }
  },
  "globalHistory": [...],
  "sessionStats": {
    "totalHumanLines": 145,
    "totalAiLines": 67,
    "totalHumanChars": 3421,
    "totalAiChars": 1523
  },
  "dailyStats": [
    {
      "date": "2025-01-15",
      "humanLines": 145,
      "aiLines": 67,
      "humanChars": 3421,
      "aiChars": 1523,
      "events": 42
    }
  ],
  "lastUpdated": 1705401234567
}
```

The data contains:

- Per-file statistics (lines, characters)
- Historical events (timestamps, operations)
- Session statistics (totals)
- Daily statistics (day-by-day breakdown)

## 🛠 Development

### Extension Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch
```

### Web Viewer Development

```bash
cd web-viewer
npm install
npm run dev
```

## 📁 Project Structure

```
.
├── src/
│   ├── extension.ts      # Main extension logic
│   ├── crypto.ts         # Encryption/decryption utilities
│   ├── storage.ts        # File persistence operations
│   └── types.ts          # TypeScript interfaces
├── web-viewer/
│   ├── src/
│   │   ├── App.tsx       # Main React component
│   │   ├── components/   # UI components
│   │   ├── utils/        # Utilities (crypto, GitHub)
│   │   └── types.ts      # TypeScript interfaces
│   └── ...config files
├── package.json
└── README.md
```

## 🎨 Technology Stack

### Extension

- TypeScript
- VS Code Extension API
- Node.js crypto module

### Web Viewer

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- crypto-js

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🌟 Features in Detail

### AI Detection Methods

1. **Inline Completion API**: Tracks VS Code inline completions (Copilot, etc.)
2. **Heuristic Analysis**: Large insertions, multi-line changes
3. **Pattern Recognition**: Formatted code blocks, paste operations
4. **Fallback**: Manual classification for edge cases

### Statistics Tracked

- Lines of code (human vs AI)
- Character count
- File-by-file breakdown
- Historical timeline
- Operation types (add/delete/modify)
- Timestamps for all events

### Web Viewer Features

- Real-time GitHub fetching
- Automatic data loading
- Multiple chart types
- Daily breakdown table
- Shareable URLs
- Mobile-friendly interface

## 🚦 Getting Started

1. **Install Extension**: Load the extension in VS Code
2. **Start Coding**: Write code normally
3. **View Stats**: Click status bar or run command
4. **Push to GitHub**: Commit `.whodare/stats.json`
5. **Share**: Use web viewer to visualize publicly

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🎉 Acknowledgments

Built with ❤️ using modern web technologies and best practices.
