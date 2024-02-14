export default ({ addListener, removeListener }) => {
    console.log('MessageListener factory()');

    return {
        subscribers: {},

        init() {
            this.subscribers = {};
        },

        subscribe(type, callback) {
            console.log('MessageListener.subscribe()');

            if (this.subscribers[type]) {
                console.warn(`"${type}" already have a subscriber, replace it with new one`);
                removeListener(this.subscribers[type]);
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
            addListener(this.subscribers[type]);
        },

        unsubscribe(type) {
            if (!this.subscribers[type]) {
                return;
            }

            removeListener(this.subscribers[type]);
            delete(this.subscribers[type]);
        },

        /*notify({type, payload}, sender, sendResponse) {
            if (!this.subscribers[type]) {
                return;
            }

            this.subscribers[type].forEach(func => func({type, payload}, sender, sendResponse));
        }*/
    };
}