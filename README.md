# Try Clothes On - Chromium Extension Template

This is a minimal file structure for a Chromium-based browser extension. Replace the placeholder icon files and add your own logic as needed.

## File Structure

- `manifest.json` - Main configuration file for the extension (required by all Chromium extensions).
- `popup.html` - The HTML for the extension's popup window.
- `popup.js` - JavaScript for the popup window.
- `background.js` - Background script for handling extension events and background logic.
- `content.js` - Content script that can be injected into web pages.
- `icons/` - Folder containing icon files for the extension (required sizes: 16x16, 32x32, 48x48, 128x128). Replace the placeholder files with actual PNG images.

## Getting Started

1. Replace the icon placeholder files in `icons/` with your own PNG images of the correct sizes.
2. Add your extension logic to `popup.js`, `background.js`, and `content.js` as needed.
3. Load the extension in Chrome/Chromium:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select this folder

## Purpose

This template provides the minimal required files for a Chromium extension. You can expand upon this structure to add features and functionality for your project.
