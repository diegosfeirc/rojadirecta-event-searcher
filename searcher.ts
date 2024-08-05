/// <reference lib="dom" />
import { Page, ElementHandle, Browser } from "puppeteer";
import { getVideo } from "./player";


export const searchEvent = async (page: Page, event_search: string): Promise<void> => {
    try {
        // We search for the event or team in the search bar of the page
        const searchInput = await page.$x("//input[@id='searchInput']");
        await searchInput[0].type(event_search);

        // We click on the first event that appears
        const clickableEvents = await page.$x(`//span[@itemtype='http://schema.org/SportsEvent']`);
        console.log(clickableEvents);
        console.log(clickableEvents.length);
        if (clickableEvents.length > 0) { // If there are clickable events
            await (clickableEvents[0] as ElementHandle).click(); // Click on the first event
        } else {
            console.log("No clickable events found");
        }
    } catch (error) {
        console.log("Error searching the event:", error);
    }
};

// Function to get the events links. Receives the page and the browser as parameters
export const getEventsLinks = async (page: Page): Promise<ElementHandle<Node>[]> => {
    try {
        // We search for the links of the events
        const eventsLinks = await page.$x(`//a[@rel='nofollow']//span[text()= 'Ver']`);

        // We return the links of the events
        return eventsLinks;
    } catch (error) {
        console.log("Error getting the events links:", error);
        return [];
    }
};

export const findGoodVideo = async (browser: Browser, eventsLinks: ElementHandle<Node>[]): Promise<ElementHandle<HTMLVideoElement> | null> => {
    try {
        for (let eventIndex = 0; eventIndex < eventsLinks.length; eventIndex++) {
            await (eventsLinks[eventIndex] as ElementHandle).click();
            await waitFor(2);
            const pages = await browser.pages();
            const currentPage = pages[pages.length - 1];
            
            // We wait until the page is loaded
            await waitFor(5);

            await currentPage.bringToFront();
            await currentPage.setViewport({ width: 1440, height: 900 });
            const iframes = await currentPage.$$('iframe');
            const video = await getVideo(currentPage, iframes);
            if (video) {
                return video;
            }
        }
        return null;
    } catch (error) {
        console.log("Error finding the video:", error);
        return null;
    }
}


const waitFor = async (seconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
