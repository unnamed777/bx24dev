const messageListener = {
    subscribers: {},
    /** @var {MessagePort} port */
    port: null,

    init() {
        this.subscribers = {};
        self.addEventListener('message', this.onMessage.bind(this));
        /*self.addEventListener('message', (event) => {
            console.log('messageListener.onMessage dumb handler.\ndata:%o has post:%o', event.data, !!event.ports[0]);

            if (event.ports[0]) {
                let rand = Math.round(Math.random() * 100);
                console.log('messageListener.onMessage dumb handler. Send reply %d to port', rand);
                event.ports[0].postMessage('Dumb reply ' + rand);
            }
        });*/
    },

    subscribe(type, callback) {
        console.log('MessageListener.subscribe(%s)', type);

        if (this.subscribers[type]) {
            console.warn(`"${type}" already have a subscriber, replace it with new one`);
            //self.removeEventListener('message', this.subscribers[type]);
        }

        this.subscribers[type] = callback;
    },

    unsubscribe(type) {
        if (!this.subscribers[type]) {
            return;
        }

        self.removeEventListener('message', this.subscribers[type]);
        delete(this.subscribers[type]);
    },

    /**
     *
     * @param {MessageEvent} event
     */
    async onMessage(event) {
        console.log('messageListener.onMessage()', event.data);
        const type = event.data.type;

        // No registered callback
        if (!this.subscribers[type]) {
            console.log('messageListener.onMessage(): No subscriber');
            return;
        }

        let result = this.subscribers[type]({payload: event.data.payload});

        if (result instanceof Promise) {
            result = await result;
        }

        console.log('messageListener.onMessage() callback result', result);

        event.ports[0].postMessage({
            type: 'PORT_RESPONSE',
            payload: result,
        });
    }
};

messageListener.init();

export default messageListener;