import browser from 'lib/browser-stub';

const messageListener = {
    subscribers: {},

    init() {
        this.subscribers = {};
    },

    subscribe(type, callback) {
        console.log('MessageListener.subscribe()');

        if (this.subscribers[type]) {
            console.warn(`"${type}" already have a subscriber, replace it with new one`);
            browser.runtime.onMessage.removeListener(this.subscribers[type]);
        }

        // @todo Rewrite, dirty
        // Wrapper for callback. It allows to react for requested message type only.
        this.subscribers[type] = (payload, sender, sendResponse) => {
            //console.log('MessageListener wrapped callback, payload type: %s, expected type: %s', payload.type, type);
            if (payload.type !== type) {
                return;
            }

            // Firefox supports returning of result via Promise from the listener but Chrome does not.
            // So it's required to use sendResponse() in the listeners (`callback`).
            // https://developer.chrome.com/docs/extensions/develop/concepts/messaging
            // "Async functions are not supported because they return a Promise, which is not supported"
            console.log('MessageListener. Execute callback for type %s', payload.type);
            const result = callback(payload, sender, sendResponse);

            if (result instanceof Promise) {
                // Tell the browser that the listener is async, and it's needed to wait for response via sendResponse()
                return true;
            } else {
                // The listener is sync, return result immediately
                return result;
            }
        };

        // Is not better to have single onMessage() and call callbacks there?
        // Why did I make this wrapper in first place?..
        browser.runtime.onMessage.addListener(this.subscribers[type]);
    },

    unsubscribe(type) {
        if (!this.subscribers[type]) {
            return;
        }

        browser.runtime.onMessage.removeListener(this.subscribers[type]);
        delete(this.subscribers[type]);
    },
}

messageListener.init();

export default messageListener;