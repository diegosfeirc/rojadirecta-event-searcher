import { Page, ElementHandle } from 'puppeteer';

export const getVideo = async (currentPage: Page, iframes: ElementHandle<HTMLIFrameElement>[]): Promise<ElementHandle<HTMLVideoElement> | null> => {
    while (true) {
        const video = await getVideoDirectly(currentPage);
        if (video) {
            return video;
        }

        const videoInIframes = await getVideoRecursively(iframes);
        if (videoInIframes) {
            return videoInIframes;
        }
    }
}

const getVideoDirectly = async (currentPage: Page): Promise<ElementHandle<HTMLVideoElement> | null> => {
    try {
        const videoElement = await currentPage.$x(`//video[@class='jw-video jw-reset'] | //video`);
        if (videoElement.length > 0) {
            const htmlVideoElement = await videoElement[0].asElement() as ElementHandle<HTMLVideoElement>;
            await htmlVideoElement.click();
            const videoQuality = await htmlVideoElement.evaluate((video) => video.videoHeight);
            console.log('Video found Directly');
            console.log('Video quality:', videoQuality);
            return htmlVideoElement;
        } else {
            console.log("Video element not found directly");
            return null;
        } 
    } catch (error) {
        console.log("Error getting video quality directly:", error);
        return null;
    }
}


const getVideoRecursively = async (iframes: ElementHandle<HTMLIFrameElement>[]): Promise<ElementHandle<HTMLVideoElement> | null> => {
    // Function implementation goes here
    if (iframes.length === 0) {
        return null;
    }
    for (let iframe of iframes) {
        const frame = await iframe.contentFrame();
        if (!frame) {
            continue;
        }

        try {
            const video = await frame.$('video');
            const videoHeight = await frame.$eval('video', (video) => video.videoHeight);
            if (video && videoHeight) {
                console.log('Video found Recursively');
                console.log('Video quality:', videoHeight);

                return video;
            }

                
        }
        catch (error) {
            console.log("Error getting video quality\n");
        }

        const nextIframes = await frame.$$('iframe');
        const foundInNextIframes = await getVideoRecursively(nextIframes);
        if (foundInNextIframes) {
            return foundInNextIframes;
        }
    }

    return null; // Placeholder return statement
}