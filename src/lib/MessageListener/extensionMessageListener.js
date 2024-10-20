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
            console.log('MessageListener wrapped callback, payload type: %s, expected type: %s', payload.type, type);
            if (payload.type !== type) {
                return;
            }

            return callback(payload, sender, sendResponse);
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