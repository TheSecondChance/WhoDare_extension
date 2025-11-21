# whoDare Web Viewer

A modern web application to visualize AI vs Human code contribution statistics from GitHub repositories.

## Features

- 🔐 **Encrypted Data Support**: Decrypts and displays encrypted statistics files
- 📊 **Rich Visualizations**: Pie charts, timelines, and detailed breakdowns
- 🌓 **Dark/Light Mode**: Automatic theme detection with manual toggle
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Generate Statistics**: Use the whoDare VS Code extension in your project to generate encrypted statistics
2. **Push to GitHub**: Commit and push the `.whodare/stats.json` file to your repository
3. **View Statistics**: Enter your GitHub repository URL in the web viewer
4. **Auto-Decrypt**: The viewer automatically decrypts the data - no key needed!

## GitHub URL Format

The viewer accepts various GitHub URL formats:

- `https://github.com/owner/repo`
- `https://github.com/owner/repo/tree/branch`
- `https://github.com/owner/repo.git`

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **crypto-js** - Client-side decryption

## Deployment

This is a static site that can be deployed to:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Build and push to gh-pages branch
- Any static hosting service

## License

MIT

