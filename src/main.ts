import puppeteer, { Browser } from "puppeteer";
import { initializeBrowser } from "./utils/browserUtils";
import { searchAndFindVideo } from "./services/eventService";

const config = {
    eventToSearch: "Albany - Syracuse",
    minimumVideoQuality: 720,
    headless: false,
};

const main = async () => {
    let browser: Browser | null = null;
    try {
        browser = await initializeBrowser(config.headless);
        const video = await searchAndFindVideo(browser, config.eventToSearch, config.minimumVideoQuality);

        if (video) {
            console.log("Playing video...");
            await video.evaluate((vid: HTMLVideoElement) => {
                vid.play();
                vid.muted = false;
                vid.requestFullscreen();
            });
        } else {
            console.log("No suitable video found.");
        }
    } catch (error) {
        console.error("Error in main execution:", error);
    } finally {
        if (browser) await browser.close();
    }
};

main();