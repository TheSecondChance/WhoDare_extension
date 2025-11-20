# whoDare - Quick Start Guide

Get up and running with whoDare in 5 minutes!

## 🚀 Part 1: Test the VS Code Extension (2 minutes)

### Step 1: Start the Extension

```bash
# Make sure you're in the project root
npm run compile
```

Press `F5` in VS Code to launch the extension in debug mode.

### Step 2: Test Tracking

1. In the new VS Code window that opens, open any folder
2. Create a new file or edit an existing one
3. Type some code (this is tracked as "human")
4. Look at the bottom-left status bar: `whoDare: Human X% | AI Y%`
5. Click the status bar to see detailed statistics!

### Step 3: View Your Data

The statistics are automatically saved to `.howdare/stats.json` in your workspace.

---

## 🌐 Part 2: Run the Web Viewer (3 minutes)

### Step 1: Start the Development Server

```bash
cd web-viewer
npm run dev
```

The viewer will open at `http://localhost:5173`

### Step 2: Test with Sample Data

Since you just started using the extension, you can:

**Option A: Use your own data**
1. Push your `.howdare/stats.json` to a GitHub repo
2. Enter the repo URL in the web viewer
3. Click "Fetch Statistics" (auto-decrypts!)

**Option B: Create more test data**
1. Go back to the extension and write more code
2. The stats file will update automatically
3. View the stats in the VS Code extension first

---

## 📊 What You Get

### In VS Code:
- ✅ Real-time tracking in status bar
- ✅ Beautiful statistics dashboard
- ✅ Per-file breakdown
- ✅ Historical event tracking
- ✅ Automatic encrypted backups

### On the Web:
- ✅ GitHub repository integration
- ✅ Plain JSON data viewer
- ✅ Rich visualizations (charts, tables, daily breakdowns)
- ✅ Dark/light mode
- ✅ Shareable statistics

---

## 🎯 Next Steps

1. **Read the full documentation**: See `README.md`
2. **Learn advanced usage**: See `USAGE.md`
3. **Deploy the web viewer**: Use Vercel, Netlify, or GitHub Pages
4. **Share your stats**: Commit `.howdare/stats.json` to your repo
5. **Review daily stats**: Check the daily breakdown to track your progress

---

## 💡 Pro Tips

- **Inline completions are tracked as AI**: Use Copilot and watch the stats change!
- **Large pastes are marked as AI**: Copy/paste large blocks to see the detection
- **Stats persist across sessions**: Your data is saved and accumulates over time
- **All history is preserved**: No limits on daily stats, events, or history
- **Plain JSON format**: Easy to inspect and read your stats file

---

## 🆘 Need Help?

- **Extension not working?** Check the Output panel: `View > Output > whoDare`
- **Web viewer errors?** Check browser console (`F12`)
- **More questions?** See `USAGE.md` for detailed troubleshooting

---

## 🎉 You're Ready!

Start coding and watch whoDare automatically track your human vs AI contributions!

**Test Command for Quick Demo:**
```typescript
// Type this slowly (human):
function hello() {
  return "world";
}

// Then paste this large block (will be detected as AI):
function complexFunction() {
  const data = [1, 2, 3, 4, 5];
  const result = data
    .map(x => x * 2)
    .filter(x => x > 5)
    .reduce((a, b) => a + b, 0);
  return result;
}
```

Watch the status bar update! 📈

