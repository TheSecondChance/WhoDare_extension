# whoDare Usage Guide

This guide will walk you through setting up and using the whoDare system.

## Part 1: VS Code Extension Setup

### Installation

1. **Open the Extension in VS Code**
   ```bash
   # From the project root
   code .
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Compile the Extension**
   ```bash
   npm run compile
   ```

4. **Run the Extension**
   - Press `F5` to start debugging
   - A new VS Code window will open with the extension activated

### Using the Extension

1. **Open a Workspace**
   - Open any folder/workspace in the extension development host window
   - The extension will activate automatically

2. **View Real-time Stats**
   - Look at the status bar (bottom left): `whoDare: Human X% | AI Y%`
   - Click it to see detailed statistics

3. **Configure Encryption (Optional)**
   - Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
   - Search for "whoDare"
   - Set `howDare.encryptionKey` to your custom key
   - Leave empty to use auto-generated key (recommended)

4. **View Statistics**
   - Click the status bar item, OR
   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Run: `whoDare: Show Code Statistics`

### Understanding the Data

The extension tracks:
- **Human-written code**: Small, incremental changes typed by you
- **AI-generated code**: 
  - Inline completions from Copilot/similar tools
  - Large paste operations
  - Multi-line insertions
  - Code blocks

### Data Storage

Statistics are stored in `.howdare/stats.json`:
- **Encrypted** using AES-256-GCM
- **Persistent** across sessions
- **Shareable** on GitHub

## Part 2: Sharing Your Statistics

### Option 1: Commit to Repository (Recommended)

```bash
# Add the stats file to git
git add .howdare/stats.json

# Commit
git commit -m "Add whoDare statistics"

# Push to GitHub
git push origin main
```

### Option 2: Keep Private

Add to `.gitignore`:
```
.howdare/
```

## Part 3: Web Viewer Setup

### Installation

```bash
# Navigate to web-viewer directory
cd web-viewer

# Install dependencies (already done if you followed the setup)
npm install
```

### Development Mode

```bash
# Start development server
npm run dev

# Open in browser (usually http://localhost:5173)
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Production

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Option 3: GitHub Pages
```bash
# Build
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## Part 4: Using the Web Viewer

### Basic Usage

1. **Open the Web Viewer** (deployed URL or local dev server)

2. **Enter GitHub Repository URL**
   ```
   https://github.com/username/repository
   ```

3. **Optional: Enter Encryption Key**
   - Leave empty if using default key
   - Enter custom key if you configured one

4. **Click "Fetch Statistics"**
   - The viewer will fetch and decrypt your stats
   - View beautiful visualizations!

### Features

- **Summary Cards**: Quick overview of your coding stats
- **Pie Chart**: Visual distribution of human vs AI code
- **Timeline Chart**: Activity over time
- **File Breakdown**: Detailed per-file statistics
- **Dark/Light Mode**: Toggle theme with the button in the header

### Sharing

Share your repository URL with others:
```
https://your-viewer-url.vercel.app/?repo=github.com/username/repo
```

## Part 5: Advanced Configuration

### Custom Encryption Key

**In VS Code:**
```json
{
  "howDare.encryptionKey": "my-super-secret-key"
}
```

**In Web Viewer:**
- Enter the same key in the "Encryption Key" field

### Automation

**Auto-commit stats** (add to `.github/workflows/codetracker.yml`):
```yaml
name: Update whoDare Stats
on:
  push:
    paths:
      - '.howdare/stats.json'
jobs:
  commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Commit stats
        run: |
          git config user.name "whoDare Bot"
          git config user.email "bot@codetracker.dev"
          git add .howdare/stats.json
          git commit -m "Update whoDare statistics" || exit 0
          git push
```

## Part 6: Troubleshooting

### Extension Not Working

1. Check the Output panel: `View > Output > whoDare`
2. Ensure workspace is open (not just a single file)
3. Try reloading VS Code: `Developer: Reload Window`

### Stats Not Updating

1. Check if file is being saved
2. Look for errors in Debug Console (`F12`)
3. Verify `.howdare` directory has write permissions

### Web Viewer Decryption Fails

1. Ensure the stats file exists in the repository
2. Check if you're using a custom encryption key
3. Verify the repository URL is correct
4. Try using the default key (leave field empty)

### Build Errors

**Extension:**
```bash
# Clean and rebuild
rm -rf out node_modules
npm install
npm run compile
```

**Web Viewer:**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Part 7: Tips & Best Practices

### For Accurate Tracking

1. **Let AI completions finish** before accepting
2. **Use the extension consistently** in all projects
3. **Commit stats regularly** to track progress over time
4. **Review stats periodically** to understand your workflow

### For Privacy

1. **Use custom encryption keys** for sensitive projects
2. **Don't commit stats** if working on proprietary code
3. **Review data** before making repository public

### For Teams

1. **Standardize encryption key** across team
2. **Include stats in code reviews** to discuss AI usage
3. **Track team trends** over time
4. **Set guidelines** for AI assistance

## Part 8: Example Workflows

### Solo Developer

1. Work on project with extension enabled
2. Commit stats weekly
3. Review trends monthly
4. Share stats on portfolio

### Team Project

1. Configure shared encryption key
2. Each developer uses extension
3. Aggregate stats in central repo
4. Discuss AI usage in retrospectives

### Open Source

1. Use default encryption
2. Commit stats to main branch
3. Add web viewer link to README
4. Encourage contributors to use extension

## Support & Resources

- **Documentation**: See README.md
- **Issues**: Open on GitHub
- **Updates**: Check for new releases

## Quick Reference

### Extension Commands
- Show Stats: `Ctrl+Shift+P` → `whoDare: Show Code Statistics`

### Useful Paths
- Stats File: `.howdare/stats.json`
- Extension Source: `src/extension.ts`
- Web Viewer: `web-viewer/`

### Default Ports
- Web Viewer Dev: `http://localhost:5173`

---

Happy tracking! 🎉

