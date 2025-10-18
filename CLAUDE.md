# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js TypeScript application that downloads storybook content from web pages. It uses Playwright to automate browser interactions and capture screenshots and audio files from storybook presentations.

## Commands

### Running the Application
```bash
# Run with tsx (recommended for development)
tsx main.ts <STORYBOOK_URL>

# Build the TypeScript code
npx tsc

# Run the built version
node dist/main.js <STORYBOOK_URL>
```

### Package Management
This project uses `pnpm` as the package manager:
```bash
# Install dependencies
pnpm install

# Add new dependencies
pnpm add <package-name>

# Add dev dependencies
pnpm add -D <package-name>
```

## Architecture

### Core Components

**main.ts**: Single entry point containing the main orchestration logic
- **Browser Automation**: Uses Playwright with Chrome channel for browser control
- **Screenshot Capture**: Captures each page of the storybook as PNG files
- **Audio Extraction**: Downloads audio files (OGG format) from storybook pages
- **File Management**: Creates and manages a `storybook/` output directory

### Key Functions

- `run(url)`: Main orchestration function that coordinates browser automation
- `captureScreenshots(page)`: Takes screenshots of each storybook page
- `saveAudio(page)`: Extracts and saves audio files from blob URLs
- `prepareScreenshotDir()`: Sets up the output directory
- `injectPageStyles(page)`: Injects CSS to hide UI elements during screenshot capture

### Data Flow

1. Browser launches with maximized window and no viewport constraints
2. Navigates to provided storybook URL
3. Captures screenshots of all pages by clicking through navigation
4. Reloads page and extracts audio files by monitoring network responses
5. Saves all content to `storybook/` directory with sequential naming

## TypeScript Configuration

- Uses `nodenext` module resolution with ESNext target
- Strict type checking enabled with additional strictness options
- Outputs to `dist/` directory
- Supports ESM modules (type: "module" in package.json)

## Dependencies

- **playwright**: Browser automation framework
- **tsx**: TypeScript execution engine for development
- **@types/node**: Node.js type definitions
- **typescript**: TypeScript compiler

## Development Notes

- The application runs in non-headless mode for debugging purposes
- Uses Chrome browser channel specifically
- Handles blob URLs for audio extraction
- Implements timeout handling for audio capture operations
- CSS injection removes UI elements like navigation buttons for clean screenshots