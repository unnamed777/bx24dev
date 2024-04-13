import { getExposedPromise } from "lib/functions";

export const TYPE_REQUEST_ACTIVE_CONNECTIONS = 'REQUEST_ACTIVE_CONNECTIONS';
export const TYPE_REQUEST_AUTH_DATA_BY_UUID = 'REQUEST_AUTH_DATA_BY_UUID';
const TYPE_RESPONSE = 'RESPONSE';

class Channel {
    constructor() {
        this.channel = new BroadcastChannel('channel');
        // For multiple responses
        this.responseCallbacks = {};
        // For single responses
        this.responseResolves = {};
        this.handlers = {};

        this.channel.addEventListener('message', this.onMessage.bind(this));
    }

    onMessage(e) {
        //console.log(e);

        if (typeof e.data !== 'object' || e.data.type === undefined) {
            return;
        }

        if (e.data.type === TYPE_RESPONSE) {
            // That's a response for a previous request
            // Call according callback
            this.responseCallbacks[e.data.uuid]?.(e.data);
            this.responseResolves[e.data.uuid]?.(e.data);
        } else {
            // That's a request.
            // Call registered handler
            if (this.handlers[e.data.type]) {
                this.handlers[e.data.type](e.data);
            } else {
                console.warn("Got request %s, but there is no registered handler", e.data.type);
            }
        }
    }

    /**
     * Send message to other tabs and call `callback` with response from each of them
     *
     * @param {String} type
     * @param {Object} payload
     * @param {Function} callback Function receives {type, uuid, payload}
     */
    sendMessageWithMultipleResponses(type, payload = {}, callback) {
        if (typeof payload !== 'object') {
            payload = {};
        }

        if (typeof callback !== 'function') {
            throw new Error('"callback" is expected');
        }

        const uuid = window.crypto.randomUUID();
        this.responseCallbacks[uuid] = callback;

        this.channel.postMessage({
            type,
            uuid,
            payload,
        });

        // Stop waiting after some timeout
        setTimeout(() => {
            delete this.responseCallbacks[uuid];
        }, 3000);
    }

    /**
     * Send message to other tabs and call `callback` with response from each of them
     *
     * @param {String} type
     * @param {Object} payload
     * @return {Promise<{uuid: string, type: string, payload: Object}>}
     */
    sendMessageWithSingleResponse(type, payload = {}) {
        if (typeof payload !== 'object') {
            payload = {};
        }

        const uuid = window.crypto.randomUUID();
        const { promise, resolve, reject } = getExposedPromise();
        this.responseResolves[uuid] = resolve;

        this.channel.postMessage({
            type,
            uuid,
            payload,
        });

        // @todo Dirty, re-write
        setTimeout(() => {
            reject();
        }, 1000);

        return promise;
    }

    /**
     * @param {String} uuid
     * @param {Object} payload
     */
    sendResponse(uuid, payload = {}) {
        this.channel.postMessage({
            type: TYPE_RESPONSE,
            uuid,
            payload,
        })
    }

    /**
     * @param {String} type
     * @param {Function} callback
     */
    registerHandler(type, callback) {
        if (this.handlers[type] !== undefined) {
            throw new Error(`Handler for "${type}" already registered`);
        }

        this.handlers[type] = callback;
    };
}

export default new Channel;