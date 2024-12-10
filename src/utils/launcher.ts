import { Browser, Page } from "puppeteer";

/**
 * Launches the Rojadirecta page.
 * @param browser Puppeteer browser instance
 * @returns Puppeteer page instance or undefined on failure
 */
export const launchRojadirectaPage = async (browser: Browser): Promise<Page | null> => {
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto("http://www.rojadirecta.eu/");
        return page;
    } catch (error) {
        console.error("Failed to launch Rojadirecta page:", error);
        return null;
    }
};