import AbstractManager from 'lib/Manager/AbstractManager';
import messageListener from 'lib/MessageListener/serviceWorkerMessageListener';
import ServiceWorkerAuthController from 'lib/AuthController/ServiceWorkerAuthController';
import localforage from "localforage";

class ServiceWorkerManager extends AbstractManager {
    constructor(messageListener) {
        console.log('ServiceWorkerManager.constructor()');
        super(messageListener);
        this.authControllerClass = ServiceWorkerAuthController;
        this.messageListener.subscribe('createWebInstance', this.onMessageCreateWebInstance.bind(this));
    }

    onMessageCreateWebInstance({ payload }) {
        console.log('Manager.onMessageCreateWebInstance()');

        this.createWebInstance({
            providerName: payload.providerName,
            providerPayload: payload.providerPayload,
        });
    }

    /**
     *
     * @param {string} providerName
     * @param {Object} providerPayload
     * @returns {ServiceWorkerAuthController}
     */
    createWebInstance({ providerName, providerPayload }) {
        console.log('ServiceWorkerManager.createWebInstance()');

        this.instances.push(null);
        const newInstanceId = this.instances.length - 1;
        console.log(1);

        let instance = new ServiceWorkerAuthController({
            id: newInstanceId,
            messageListener: this.messageListener,
            providerName,
            providerPayload
        });
        console.log(2);

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