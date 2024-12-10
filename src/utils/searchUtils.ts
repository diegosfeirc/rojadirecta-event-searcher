
import { Page, ElementHandle } from "puppeteer";

/**
 * Searches for an event on the page.
 * @param page Puppeteer page instance
 * @param eventName Event name to search
 */
export const searchEventOnPage = async (page: Page, eventName: string): Promise<void> => {
    try {
        const searchInput = await page.$x("//input[@id='searchInput']");
        if (searchInput.length === 0) {
            throw new Error("Search input not found.");
        }
        await searchInput[0].type(eventName);

        const events = await page.$x("//span[@itemtype='http://schema.org/SportsEvent']");
        if (events.length === 0) {
            console.warn("No events found.");
        } else {
            await (events[0] as ElementHandle<Element>).click();
        }
    } catch (error) {
        console.error("Error during event search:", error);
    }
};

/**
 * Gets the event links from the page.
 * @param page Puppeteer page instance
 * @returns List of event link elements
 */
export const getEventLinks = async (page: Page): Promise<ElementHandle[]> => {
    try {
        return await page.$x("//a[@rel='nofollow']//span[text()='Ver']") as ElementHandle<Element>[];
    } catch (error) {
        console.error("Error fetching event links:", error);
        return [];
    }
};