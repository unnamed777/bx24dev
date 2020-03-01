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

    notify({type, payload}, sender, sendResponse) {
        if (!this.subscribers[type]) {
            return;
        }

        this.subscribers[type].forEach(func => func({type, payload}, sender, sendResponse));
    }
};
