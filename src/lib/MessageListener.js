import browser from 'webextension-polyfill';

export default {
    init() {
        this.subscribers = {};

        browser.runtime.onMessage.addListener(this.onMessage.bind(this));
    },

    onMessage(message, sender, sendResponse) {
        if (message.type) {
            this.notify(message, sender, sendResponse);
        }
    },

    subscribe(type, callback) {
        if (!this.subscribers[type]) {
            this.subscribers[type] = [];
        }

        this.subscribers[type].push(callback);
        return this.subscribers[type].length - 1;
    },

    unsubscribe(type, id) {
        if (!this.subscribers[type]) {
            return;
        }

        delete(this.subscribers[type][id]);
    },

    notify({type, payload}, sender, sendResponse) {
        if (!this.subscribers[type]) {
            return;
        }

        this.subscribers[type].forEach(func => func({type, payload}, sender, sendResponse));
    }
};

export const newMessageListener = {
    init() {
        this.subscribers = {};
    },

    onMessage(message, sender, sendResponse) {
        if (message.type) {
            this.notify(message, sender, sendResponse);
        }
    },

    subscribe(type, callback) {
        if (this.subscribers[type]) {
            console.warn(`"${type}" already have a subscriber, replace it with new one`);
            browser.runtime.onMessage.removeListener(this.subscribers[type]);
        }

        // @todo Rewrite, dirty
        this.subscribers[type] = (payload, sender, sendResponse) => {
            //console.log('MessageListener', payload.type, type);
            if (payload.type !== type) {
                return;
            }

            return callback(payload, sender, sendResponse);
        };

        browser.runtime.onMessage.addListener(this.subscribers[type]);
    },

    unsubscribe(type) {
        if (!this.subscribers[type]) {
            return;
        }

        browser.runtime.onMessage.removeListener(this.subscribers[type]);
        delete(this.subscribers[type]);
    },

    /*notify({type, payload}, sender, sendResponse) {
        if (!this.subscribers[type]) {
            return;
        }

        this.subscribers[type].forEach(func => func({type, payload}, sender, sendResponse));
    }*/
};

newMessageListener.init();