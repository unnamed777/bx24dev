import AbstractManager from 'lib/Manager/AbstractManager';
import messageListener from 'lib/MessageListener/serviceWorkerMessageListener';
import ServiceWorkerInstance from 'lib/Instance/ServiceWorkerInstance';
import localforage from "localforage";

class ServiceWorkerManager extends AbstractManager {
    constructor(messageListener) {
        console.log('ServiceWorkerManager.constructor()');
        super(messageListener);
        this.instanceClass = ServiceWorkerInstance;
        this.messageListener.subscribe('createWebInstance', this.onMessageCreateWebInstance.bind(this));
    }

    async onMessageCreateWebInstance({ payload }) {
        console.log('Manager.onMessageCreateWebInstance()');

        const instance = this.createWebInstance({
            providerName: payload.providerName,
            providerPayload: payload.providerPayload,
        });

        // Because inner procedures are async, we need to wait until the instance is fully ready to be used
        await instance.readyPromise;

        // The login page will use id to open the app
        return { instanceId: instance.id };
    }

    /**
     *
     * @param {string} providerName
     * @param {Object} providerPayload
     * @returns {ServiceWorkerInstance}
     */
    createWebInstance({ providerName, providerPayload }) {
        console.log('ServiceWorkerManager.createWebInstance()');

        this.instances.push(null);
        const newInstanceId = this.instances.length - 1;

        let instance = new ServiceWorkerInstance({
            id: newInstanceId,
            messageListener: this.messageListener,
            providerName,
            providerPayload
        });

        this.instances[newInstanceId] = instance;

        return instance;
    }

    /**
     * @returns {Promise<[]>}
     */
    async innerGetSavedAuthList() {
        const result = await localforage.getItem('savedAuth');
        console.log('result', result);

        if (!result) {
            return [];
        }

        return result;
    }

    /**
     * @param {Array} savedAuth
     * @returns {Promise<void>}
     */
    async innerSetSavedAuthList(savedAuth) {
        await localforage.setItem('savedAuth', savedAuth);
    }
}

console.log('ServiceWorkerManager body');

let manager;

export const init = () => {
    console.log('init ServiceWorkerManager');
    manager = new ServiceWorkerManager(messageListener);
};

export default manager;