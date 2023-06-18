export default ({ addListener, removeListener }) => {
    return {
        init() {
            this.subscribers = {};
        },

        /*onMessage(message, sender, sendResponse) {
            if (message.type) {
                this.notify(message, sender, sendResponse);
            }
        },*/

        subscribe(type, callback) {
            if (this.subscribers[type]) {
                console.warn(`"${type}" already have a subscriber, replace it with new one`);
                removeListener(this.subscribers[type]);
            }

            // @todo Rewrite, dirty
            this.subscribers[type] = (payload, sender, sendResponse) => {
                //console.log('MessageListener', payload.type, type);
                if (payload.type !== type) {
                    return;
                }

                return callback(payload, sender, sendResponse);
            };

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