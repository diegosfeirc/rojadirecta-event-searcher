import puppeteer from "puppeteer";
import { launchPage } from "./launcher";
import { searchEvent, getEventsLinks, findGoodVideo } from "./searcher";

const eventToSearch = "Paris 2024"; // Event to search. CHANGE THIS VALUE TO SEARCH FOR A DIFFERENT EVENT
const minimumVideoQuality = 720; // Minimum video quality to watch the event. CHANGE THIS VALUE TO WATCH THE EVENT IN A DIFFERENT QUALITY


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
            const video = await findGoodVideo(browser, eventsLinks, minimumVideoQuality);
            if (video) {
                console.log("Video found");
                // We play the video
                await video.evaluate((video) => video.play());
                // We unsilence the video
                await video.evaluate((video) => video.muted = false);
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
