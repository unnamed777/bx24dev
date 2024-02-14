import { getExposedPromise } from "@lib/functions";

const responseQueue = [];

export default async (message) => {
    console.log('sendMessage()', message);

    let messageChannel = new MessageChannel();

    // Temporary
    if (navigator.serviceWorker.controller === null) {
        console.warn('serviceWorker.controller is null, reload page.');
        return Promise.resolve();
    }

    const { promise, resolve } = getExposedPromise();

    // Listen to a response from the SW
    messageChannel.port1.onmessage = (event) => {
        console.log('sendMessage. Port response', event.data);
        resolve(event.data.payload);
    };

    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);

    // Resolve the promise if nothing returned in 2 seconds.
    // If a reply is supposed to be sent, the promise is already resolved after this timeout.
    // Otherwise, it'll free resources.
    setTimeout((id) => {
        resolve(undefined);
    }, 2000);

    return promise;
};