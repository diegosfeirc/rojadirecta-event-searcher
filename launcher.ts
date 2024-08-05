import { Browser, Page } from 'puppeteer'; // Import the Browser and Page types from the puppeteer module

export const launchPage = async (browser: Browser): Promise<Page | undefined> => { 
    try {

        // Open a new page
        const page = await browser.newPage();

        // Set screen size
        await page.setViewport({ width: 1440, height: 900 });

        // Navigate the page to a URL
        await page.goto('http://www.rojadirecta.eu/');

        // Return the page object
        return page;
    } catch (error) { // Catch and display errors
        console.log("Error in launching the page:", error);

    }
};