import puppeteer from "puppeteer-extra";
import Adblocker from 'puppeteer-extra-plugin-adblocker'
import { launchPage } from "./launcher";
import { searchEvent, getEventsLinks, findGoodVideo } from "./searcher";

const eventToSearch = "Philadelphia Union - Cruz Azul"; // Event to search. CHANGE THIS VALUE TO SEARCH FOR A DIFFERENT EVENT
const minimumVideoQuality = 360; // Minimum video quality to watch the event. CHANGE THIS VALUE TO WATCH THE EVENT IN A DIFFERENT QUALITY



puppeteer.use(Adblocker({ blockTrackers: true, blockTrackersAndAnnoyances: true, useCache: true}))

const main = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await launchPage(browser);
        if (page === undefined) {
            console.log("Page is undefined");
            return;
        }
        else {
            await searchEvent(page, eventToSearch);
            const eventsLinks = await getEventsLinks(page);
            const video = await findGoodVideo(browser, eventsLinks);
            if (video) {
                console.log("Video found");
                // We play the video
                await video.evaluate((video) => video.play());
                // We put the video in full screen
                await video.evaluate((video) => video.requestFullscreen());
            } else {
                console.log("Video not found");
            }
        }
    } catch (error) {
        console.log("Error in main function:", error);
    }
}

main();
