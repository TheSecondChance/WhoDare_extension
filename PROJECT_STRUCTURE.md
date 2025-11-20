# whoDare - Project Structure

## 📁 Complete File Tree

```
vs_code_extension/
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Extension dependencies & config
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 README.md                     # Main documentation
├── 📄 QUICKSTART.md                 # 5-minute quick start guide
├── 📄 USAGE.md                      # Comprehensive usage guide
├── 📄 IMPLEMENTATION_SUMMARY.md     # What was built
├── 📄 PROJECT_STRUCTURE.md          # This file
│
├── 📁 src/                          # Extension source code
│   ├── 📄 extension.ts              # Main extension logic
│   ├── 📄 crypto.ts                 # Encryption utilities
│   ├── 📄 storage.ts                # File persistence
│   └── 📄 types.ts                  # TypeScript interfaces
│
├── 📁 out/                          # Compiled JavaScript (generated)
│   ├── extension.js
│   ├── crypto.js
│   ├── storage.js
│   └── types.js
│
├── 📁 .howdare/                 # Stats storage directory
│   ├── 📄 .gitkeep                  # Directory placeholder
│   └── 📄 stats.json                # Encrypted statistics (generated)
│
└── 📁 web-viewer/                   # Web application
    │
    ├── 📄 package.json              # Web viewer dependencies
    ├── 📄 vite.config.ts            # Vite build configuration
    ├── 📄 tsconfig.json             # TypeScript config
    ├── 📄 tailwind.config.js        # Tailwind CSS config
    ├── 📄 postcss.config.js         # PostCSS config
    ├── 📄 .eslintrc.cjs             # ESLint config
    ├── 📄 .gitignore                # Git ignore rules
    ├── 📄 index.html                # Entry HTML file
    ├── 📄 README.md                 # Web viewer docs
    │
    └── 📁 src/
        │
        ├── 📄 main.tsx              # React entry point
        ├── 📄 App.tsx               # Main application component
        ├── 📄 index.css             # Global styles (Tailwind)
        ├── 📄 types.ts              # TypeScript interfaces
        │
        ├── 📁 components/           # React components
        │   │
        │   ├── 📄 StatsChart.tsx           # Pie chart component
        │   ├── 📄 TimelineChart.tsx        # Timeline bar chart
        │   ├── 📄 FileBreakdown.tsx        # File table component
        │   ├── 📄 StatsSummary.tsx         # Summary cards
        │   │
        │   └── 📁 ui/                      # shadcn/ui components
        │       ├── 📄 button.tsx
        │       ├── 📄 card.tsx
        │       ├── 📄 input.tsx
        │       └── 📄 table.tsx
        │
        ├── 📁 lib/                  # Utilities
        │   └── 📄 utils.ts                 # Helper functions
        │
        └── 📁 utils/                # Core utilities
            ├── 📄 crypto.ts                # Client-side decryption
            └── 📄 github.ts                # GitHub API integration
```

---

## 📦 Key Files Explained

### Extension Core

| File | Purpose | Lines |
|------|---------|-------|
| `src/extension.ts` | Main extension logic, tracking, UI | ~400 |
| `src/crypto.ts` | AES-256-GCM encryption/decryption | ~100 |
| `src/storage.ts` | File I/O, persistence layer | ~150 |
| `src/types.ts` | TypeScript type definitions | ~50 |

### Web Viewer Core

| File | Purpose | Lines |
|------|---------|-------|
| `src/App.tsx` | Main app, routing, state management | ~200 |
| `src/components/StatsChart.tsx` | Pie chart visualization | ~60 |
| `src/components/TimelineChart.tsx` | Timeline bar chart | ~70 |
| `src/components/FileBreakdown.tsx` | File statistics table | ~80 |
| `src/components/StatsSummary.tsx` | Summary cards grid | ~100 |
| `src/utils/crypto.ts` | Client-side decryption | ~80 |
| `src/utils/github.ts` | GitHub API integration | ~100 |

### UI Components (shadcn/ui)

| File | Purpose |
|------|---------|
| `button.tsx` | Button component with variants |
| `card.tsx` | Card container components |
| `input.tsx` | Text input component |
| `table.tsx` | Table components |

---

## 🔧 Configuration Files

### Extension
- `package.json` - Dependencies, scripts, VS Code config
- `tsconfig.json` - TypeScript compiler options

### Web Viewer
- `package.json` - Dependencies, build scripts
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind CSS theme
- `postcss.config.js` - PostCSS plugins
- `.eslintrc.cjs` - ESLint rules

---

## 📊 Generated Files

### During Development
- `out/` - Compiled TypeScript (extension)
- `node_modules/` - Dependencies (both projects)
- `*.js.map` - Source maps for debugging

### During Use
- `.howdare/stats.json` - Encrypted statistics
- `web-viewer/dist/` - Production build

---

## 🚀 Build Outputs

### Extension
```
out/
├── extension.js       # Main extension
├── crypto.js          # Crypto utilities
├── storage.js         # Storage layer
└── types.js           # Type definitions
```

### Web Viewer (Production)
```
web-viewer/dist/
├── index.html         # Entry point
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   └── index-[hash].css   # Bundled CSS
└── vite.svg           # Assets
```

---

## 📝 Documentation Files

| File | Purpose | Target Audience |
|------|---------|-----------------|
| `README.md` | Project overview, features | Everyone |
| `QUICKSTART.md` | 5-minute setup guide | New users |
| `USAGE.md` | Comprehensive guide | All users |
| `IMPLEMENTATION_SUMMARY.md` | Technical details | Developers |
| `PROJECT_STRUCTURE.md` | File organization | Developers |

---

## 🔒 Important Files

### Must Commit
- All source files (`src/`)
- Configuration files
- Documentation
- `package.json` files

### Optional Commit
- `.howdare/stats.json` (encrypted stats)

### Never Commit
- `node_modules/`
- `out/`
- `dist/`
- `*.log`

---

## 📦 Package Dependencies

### Extension
```json
{
  "dependencies": {
    "chart.js": "^4.4.0"
  },
  "devDependencies": {
    "@types/vscode": "^1.75.0",
    "@types/node": "16.x",
    "typescript": "^4.9.4"
  }
}
```

### Web Viewer
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.3",
    "crypto-js": "^4.2.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.2.2"
  }
}
```

---

## 🎯 Entry Points

### Development
- **Extension**: Press F5 in VS Code
- **Web Viewer**: `npm run dev` in `web-viewer/`

### Production
- **Extension**: `out/extension.js` (loaded by VS Code)
- **Web Viewer**: `dist/index.html` (static files)

---

## 📏 Code Statistics

### Total Lines of Code

| Category | Files | Lines |
|----------|-------|-------|
| Extension TypeScript | 4 | ~700 |
| Web Viewer TypeScript | 13 | ~1,400 |
| Configuration | 10 | ~300 |
| Documentation | 5 | ~1,500 |
| **Total** | **32** | **~3,900** |

### File Count by Type

- TypeScript/TSX: 17 files
- JavaScript Config: 5 files
- JSON: 4 files
- Markdown: 6 files
- HTML: 1 file
- CSS: 1 file

---

## 🔍 Quick Navigation

**Want to modify tracking logic?**
→ `src/extension.ts`

**Want to change encryption?**
→ `src/crypto.ts` and `web-viewer/src/utils/crypto.ts`

**Want to customize UI?**
→ `web-viewer/src/components/`

**Want to add features?**
→ `src/extension.ts` for extension
→ `web-viewer/src/App.tsx` for web viewer

**Want to deploy?**
→ See `USAGE.md` deployment section

---

## ✅ Verification Checklist

To verify the project structure is correct:

```bash
# Extension compiles
npm run compile

# Web viewer builds
cd web-viewer
npm run build

# No TypeScript errors
tsc --noEmit

# All files present
ls -R
```

---

**Everything is organized and ready to use! 🎉**

