import puppeteer, { Browser } from "puppeteer";

/**
 * Initializes the Puppeteer browser instance.
 * @param headless Run browser in headless mode
 * @returns Puppeteer browser instance
 */
export const initializeBrowser = async (headless: boolean = true): Promise<Browser> => {
    return await puppeteer.launch({ headless });
};