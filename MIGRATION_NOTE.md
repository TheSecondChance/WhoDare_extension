# Migration Note: Key Generation Update

## What Changed

The encryption key generation was updated from using `codetracker-default-key` to `howdare-default-key` to match the new branding.

## Action Required

**If you have existing `.howdare/stats.json` files created before this update:**

1. Delete the old stats file:
   ```bash
   rm .howdare/stats.json
   ```

2. Recompile and run the extension:
   ```bash
   npm run compile
   # Press F5 in VS Code to restart the extension
   ```

3. Code as normal - the new stats file will be generated automatically

4. Commit and push the new file to GitHub

## Web Viewer

The web viewer now uses the **Web Crypto API** for proper AES-256-GCM decryption, which is fully compatible with the Node.js encryption from the extension.

### What Was Fixed:

1. **Encryption Key** - Now uses `howdare-default-key` suffix
2. **Decryption Method** - Switched from crypto-js (CBC mode) to Web Crypto API (GCM mode)
3. **Compatibility** - Now properly decrypts files encrypted by the VS Code extension

## Testing

After regenerating your stats file:

1. Make sure the file exists: `.howdare/stats.json`
2. Push to GitHub
3. Enter your repo URL in the web viewer: `https://github.com/yourusername/yourrepo`
4. It should automatically decrypt and display your stats!

No encryption key needed - it's all automatic! ✨

