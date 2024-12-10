import { Browser, ElementHandle, Page } from "puppeteer";

/**
 * Attempts to find a video matching the minimum quality.
 * @param browser Puppeteer browser instance
 * @param eventLinks List of event link elements
 * @param minimumQuality Minimum video quality required
 * @returns HTMLVideoElement or null
 */
export const findVideoWithQuality = async (browser: Browser, eventLinks: ElementHandle[], minimumQuality: number) => {
    for (const eventLink of eventLinks) {
        try {
            await eventLink.click();

            const pages = await browser.pages();
            const currentPage = pages[pages.length - 1];
            // Wait for the page to load completely
            await currentPage.waitForNavigation({ waitUntil: "networkidle0" });

            const video = await findVideoInPage(currentPage, minimumQuality);
            if (video) return video;

            await currentPage.close();
        } catch (error) {
            console.error("Error processing event link:", error);
        }
    }
    return null;
};

/**
 * Searches for a video element on the current page.
 * @param page Puppeteer page instance
 * @param minimumQuality Minimum video quality required
 * @returns HTMLVideoElement or null
 */
const findVideoInPage = async (page: Page, minimumQuality: number): Promise<ElementHandle<HTMLVideoElement> | null> => {
    try {
        const videoElements = await page.$$("xpath/.//video");
        for (const videoElement of videoElements) {
            const quality = await videoElement.evaluate((video) => (video as HTMLVideoElement).videoHeight);
            if (quality >= minimumQuality) {
                console.log(`Video found with quality ${quality}`);
                return videoElement as ElementHandle<HTMLVideoElement>;
            }
        }
    } catch (error) {
        console.error("Error finding video in page:", error);
    }
    return null;
};