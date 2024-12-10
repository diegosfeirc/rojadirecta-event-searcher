import { Browser } from "puppeteer";
import { launchRojadirectaPage } from "../utils/launcher";
import { searchEventOnPage, getEventLinks } from "../utils/searchUtils";
import { findVideoWithQuality } from "../utils/videoUtils";

/**
 * Handles the end-to-end process of searching for an event and finding a video.
 * @param browser Puppeteer browser instance
 * @param eventName Event name to search
 * @param minimumQuality Minimum video quality required
 */
export const searchAndFindVideo = async (browser: Browser, eventName: string, minimumQuality: number) => {
    const page = await launchRojadirectaPage(browser);

    if (!page) {
        throw new Error("Failed to launch Rojadirecta page.");
    }

    await searchEventOnPage(page, eventName);
    const eventLinks = await getEventLinks(page);

    if (eventLinks.length === 0) {
        console.warn("No events found for the search.");
        return null;
    }

    return await findVideoWithQuality(browser, eventLinks, minimumQuality);
};