import { chromium, type Page } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";

function getFilesPath(filename: string): string {
  return path.join(process.cwd(), "storybook", filename);
}

function prepareScreenshotDir(): void {
  const screenshotDir = path.join(process.cwd(), "storybook");
  if (fs.existsSync(screenshotDir)) {
    fs.rmSync(screenshotDir, { recursive: true, force: true });
  }
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function injectPageStyles(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      .fake-bottom-pages {
        display: none !important;
      }
      .start-over-button-container {
        display: none !important;
      }
      .page-content {
        border-radius: 0 !important;
        border-width: 0 !important;
      }
    `,
  });
}

async function captureScreenshots(page: Page): Promise<void> {
  const storybookElement = page.locator("storybook");
  await storybookElement.waitFor({ state: "visible", timeout: 30000 });

  await injectPageStyles(page);

  await storybookElement.screenshot({
    path: getFilesPath("page-0.png"),
    type: "png",
  });
  console.log(`Downloaded page 0`);

  const storybookPages = page.locator("storybook-page.right");
  const totalPages = await storybookPages.count();

  for (
    let screenshotIndex = 1;
    screenshotIndex < totalPages;
    screenshotIndex++
  ) {
    try {
      const rightElement = page.locator("storybook-page.right:visible");
      await rightElement.waitFor({ state: "visible", timeout: 10000 });
      await rightElement.click();

      await page.waitForTimeout(1000);

      await storybookElement.screenshot({
        path: getFilesPath(`page-${screenshotIndex}.png`),
        type: "png",
      });
      console.log(`Downloaded page ${screenshotIndex}/${totalPages - 1}`);
    } catch (clickError) {
      break;
    }
  }
}

async function saveAudio(page: Page): Promise<void> {
  let audioIndex = 0;
  let timeoutHandle: NodeJS.Timeout | null = null;

  const audioPromise = new Promise<void>((resolve) => {
    page.on("response", async (response) => {
      const url = response.url();
      const contentType = response.headers()["content-type"];

      if (
        url.startsWith("blob:") &&
        contentType &&
        contentType.includes("audio/")
      ) {
        try {
          const audioBuffer = await response.body();
          const filename = `page-${audioIndex}.ogg`;
          const filepath = getFilesPath(filename);

          fs.writeFileSync(filepath, audioBuffer);
          console.log(`Downloaded audio ${audioIndex}`);
          audioIndex++;

          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
          }

          timeoutHandle = setTimeout(() => {
            resolve();
          }, 15000);
        } catch (error) {
          // ignore error
        }
      }
    });
  });

  try {
    const playButton = page.locator(".play-pause-button");
    await playButton.waitFor({ state: "visible", timeout: 10000 });
    await playButton.click();
  } catch (error) {
    // ignore error
  }

  await audioPromise;
}

async function run(url: string): Promise<void> {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: ["--start-maximized"],
  });

  const context = await browser.newContext({
    viewport: null,
  });
  const page = await context.newPage();

  await page.goto(url);
  await page.waitForLoadState("load");

  await captureScreenshots(page);

  await page.reload();
  await page.waitForLoadState("load");

  await saveAudio(page);

  await browser.close();
}

const url = process.argv[2];
if (!url) {
  console.error("Please provide a URL as the first argument");
  process.exit(1);
}

prepareScreenshotDir();
run(url);
