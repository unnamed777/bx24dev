import { getExposedPromise } from "@lib/functions";

let sendMessage;

let loaded = false;

const backgroundSendMessage = async function (message) {
    // Before first use include polyfill.
    // @todo Maybe I'll move it to root script later.
    if (loaded === false) {
        await import('webextension-polyfill');
    }

    return browser.runtime.sendMessage(null, message);
};

const serviceWorkerSendMessage = async (message) => {
    console.log('serviceWorkerSendMessage ', message);
    const messageChannel = new MessageChannel();
    const { promise, resolve } = getExposedPromise();

    messageChannel.port1.addEventListener('message', (event) => resolve(event.data));

    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);

    // Resolve the promise if nothing returned in 1 second.
    // If a reply is supposed to be sent, the promise is already resolved after this timeout.
    // Otherwise, it'll free resources.
    setTimeout(() => resolve(undefined), 1000);

    return promise;
};

if (typeof chrome === 'undefined' && typeof browser === 'undefined') {
    console.log('web page');
    sendMessage = serviceWorkerSendMessage;
} else {
    console.log('extension page');
    sendMessage = backgroundSendMessage;
}

export default sendMessage;