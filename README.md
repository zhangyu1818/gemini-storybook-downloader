# Gemini Storybook Downloader

A Node.js TypeScript application that automatically downloads Gemini storybook content from web pages, including screenshots and audio files.

## Features

- 📸 **Screenshot Capture**: Captures each page of the storybook as high-quality PNG files
- 🎵 **Audio Extraction**: Downloads audio files from storybook presentations
- 🤖 **Browser Automation**: Uses Playwright for reliable browser automation
- 🗂️ **Organized Output**: Saves content to a structured `storybook/` directory

## Prerequisites

- Node.js (v22 or higher)
- pnpm package manager
- Chrome browser (required for Playwright)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd download-storybook
```

2. Install dependencies:
```bash
pnpm install
```

## Usage

### Basic Usage

Run the application with a storybook URL:

```bash
tsx main.ts <STORYBOOK_URL>
```

**Example:**
```bash
tsx main.ts https://example.com/storybook
```

### Development Mode

For development with TypeScript compilation:

```bash
# Run directly with tsx
tsx main.ts <STORYBOOK_URL>

# Or compile first, then run
npx tsc
node dist/main.js <STORYBOOK_URL>
```

## Output

The application creates a `storybook/` directory in the current working directory containing:

- `page-0.png` - First page screenshot
- `page-1.png` - Second page screenshot
- `page-N.png` - Nth page screenshot
- `page-0.ogg` - Audio file for first page (if available)
- `page-1.ogg` - Audio file for second page (if available)
- `page-N.ogg` - Audio file for Nth page (if available)

## How It Works

1. **Browser Launch**: Opens Chrome in maximized window mode
2. **Page Navigation**: Navigates to the provided storybook URL
3. **Screenshot Capture**: Takes screenshots of each page by clicking through navigation
4. **Audio Extraction**: Reloads the page and captures audio files from blob URLs
5. **File Organization**: Saves all content with sequential naming

## Configuration

The application includes several customizable behaviors:

- **Browser Settings**: Uses Chrome channel with maximized window
- **Timeouts**: 30-second timeout for initial page load, 15-second audio capture timeout
- **CSS Injection**: Automatically hides UI elements for clean screenshots
- **File Formats**: PNG for screenshots, OGG for audio files

## Troubleshooting

### Common Issues

1. **"Please provide a URL as the first argument"**
   - Make sure to provide a valid URL as the second argument
   - Example: `tsx main.ts https://your-storybook-url.com`

2. **Browser launch fails**
   - Ensure Chrome is installed on your system
   - Run `npx playwright install chromium` to install Playwright browsers

3. **Timeout errors**
   - Check your internet connection
   - Verify the storybook URL is accessible
   - Some storybooks may take longer to load initially

### Development Tips

- The application runs in non-headless mode for debugging visibility
- Check the console output for progress information
- The `storybook/` directory is cleaned and recreated on each run

## Requirements

- **Node.js**: v22 or higher
- **pnpm**: v10.17.1 (as specified in packageManager)
- **Chrome Browser**: Required for Playwright automation
- **Operating System**: Windows, macOS, or Linux

## License

MIT License
