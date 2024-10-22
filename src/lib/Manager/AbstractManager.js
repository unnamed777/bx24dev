import md5 from "md5";
import browser from 'lib/browser-stub';

export default class AbstractManager {
    /** @var AbstractInstance */
    instanceClass;
    instances;

    constructor(messageListener) {
        console.log('AbstractManager.constructor()');
        this.messageListener = messageListener;

        console.log('AbstractManager.constructor()');
        this.messageListener.subscribe('getRecentList', this.onMessageGetRecentList.bind(this));
        this.messageListener.subscribe('openRecentConnection', this.onMessageOpenRecentConnection.bind(this));
        this.messageListener.subscribe('getSavedList', this.onMessageGetSavedList.bind(this));
        this.messageListener.subscribe('rememberAuth', this.onMessageRememberAuth.bind(this));
        this.messageListener.subscribe('forgetAuth', this.onMessageForgetAuth.bind(this));
        this.messageListener.subscribe('openSavedConnection', this.onMessageOpenSavedConnection.bind(this));

         /** @type {Array<AbstractInstance>} */
        this.instances = [null];
        console.log('AbstractManager.constructor() end');
    }

    /**
     *
     * @param tab
     * @param {string} providerName
     * @param {Object} providerPayload
     * @returns {AbstractInstance}
     */
    createTabInstance({ tab, providerName, providerPayload }) {
        console.log('AbstractManager.createTabInstance()');

        this.instances.push(null);
        const newInstanceId = this.instances.length - 1;

        let instance = new (this.instanceClass)({
            id: newInstanceId,
            tab,
            providerName,
            providerPayload
        });

        this.instances[newInstanceId] = instance;

        return instance;
    }

    hydrateAllInstances() {
    }

    async onMessageGetRecentList(payload, sender, sendResponse) {
        console.log('AbstractManager.onMessageGetRecentList()');
        let result = [];
        let uniq = new Set();

        this.hydrateAllInstances();

        for (let instance of this.instances) {
            if (!instance) {
                continue;
            }

            let data = instance.getData();
            let credentials = instance.provider.getCredentials ? instance.provider.getCredentials() : {};
            let uniqId;

            switch (instance.getProviderName()) {
                case 'webhook':
                    uniqId = this.getUniqIdByCredentials('webhook', credentials);

                    if (uniq.has(uniqId)) {
                        continue;
                    }

                    result.push({
                        type: 'webhook',
                        authId: instance.getId(),
                        id: uniqId,
                        title: data.title,
                        portal: data.portal,
                        url: credentials.url,
                    });

                    uniq.add(uniqId);
                    break;

                case 'grabOauth':
                case 'classicOauth':
                    uniqId = this.getUniqIdByCredentials('oauth', credentials);

                    if (uniq.has(uniqId)) {
                        continue;
                    }

                    result.push({
                        type: 'oauth',
                        authId: instance.getId(),
                        id: uniqId,
                        title: data.title,
                        portal: data.portal,
                        appUrl: credentials.appUrl,
                        clientId: credentials.clientId.substr(0, 8) + '***'
                    });

                    uniq.add(uniqId);
                    break;
            }
        }

        console.log('AbstractManager.onMessageGetRecentList() end');
        /*console.log('return fake result');
        return [
            {
                "type": "webhook",
                "authId": 1,
                "id": "23ea3e0f5d187e8d7f7d1e8a1b82db38",
                "title": "Webhook",
                "portal": "test.bitrix24.ru",
                "url": "https://test.bitrix24.ru/rest/1/asdf"
            }
        ];*/

        sendResponse(result);
        //return result;
    }

    async onMessageOpenRecentConnection({ payload }, sender, sendResponse) {
        if (!this.instances[payload.authId]) {
            if (!(await this.hydrateInstanceById(payload.authId))) {
                sendResponse(false);
                return;
            }
        }

        const recentInstance = this.instances[payload.authId];
        let providerName;

        if (recentInstance.getProviderName() === 'grabOauth') {
            providerName = 'classicOauth';
        } else {
            providerName = recentInstance.getProviderName();
        }

        if (recentInstance.provider.getCredentials === undefined) {
            throw new Error('Provider doesn\'t have reusable credentials');
        }

        console.log(recentInstance);

        await this.createTabInstance({
            tab: null,
            providerName,
            providerPayload: recentInstance.provider.getCredentials(),
        });

        sendResponse(true);
    }

    async onMessageGetSavedList(payload, sender, sendResponse) {
        console.log('AbstractManager.onMessageGetSavedList()');
        const items = await this.innerGetSavedAuthList();

        if (items.length === 0) {
            sendResponse([]);
            return;
        }

        let result = [];

        for (let item of items) {
            let exportItem;

            switch (item.type) {
                case 'webhook':
                    let parts = /^.*:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)\/?$/.exec(item.credentials.url);

                    exportItem = {
                        id: item.id,
                        type: 'webhook',
                        title: 'Webhook',
                        portal: parts[1],
                        url: item.credentials.url,
                    };
                    break;

                case 'oauth':
                    exportItem = {
                        id: item.id,
                        type: 'oauth',
                        title: item.credentials.appName,
                        portal: item.credentials.domain,
                        appUrl: item.credentials.appUrl,
                    };
                    break;
            }

            result.push(exportItem);
        }

        sendResponse(result);
    }

    /**
     * @returns {Promise<[]>}
     */
    async innerGetSavedAuthList() {
        let storageResult = await browser.storage.local.get('savedAuth');

        if (!storageResult.savedAuth) {
            return [];
        }

        return storageResult.savedAuth;
    }

    /**
     * Saves auth data to local storage
     *
     * @param payload
     * @param sender
     * @param sendResponse
     * @returns {Promise<*>}
     */
    async onMessageRememberAuth(payload, sender, sendResponse) {
        console.log('AbstractManager.onMessageRememberAuth()');
        const instance = this.instances[payload.payload.authId];
        console.log(instance);

        if (instance.provider.getCredentials === undefined) {
            throw new Error('Provider doesn\'t have reusable credentials');
        }

        const credentials = instance.provider.getCredentials();

        console.log('AbstractManager.onMessageRememberAuth() Try to obtain list');
        let savedAuth = await this.innerGetSavedAuthList();
        console.log('AbstractManager.onMessageRememberAuth() List is obtained');

        let newItem;

        switch (instance.getProviderName()) {
            case 'webhook':
                newItem = {
                    type: 'webhook',
                    id: this.getUniqIdByCredentials('webhook', credentials),
                    credentials,
                };
                break;

            case 'grabOauth':
            case 'classicOauth':
                newItem = {
                    type: 'oauth',
                    id: this.getUniqIdByCredentials('oauth', credentials),
                    credentials,
                };
                break;

            default:
                throw new Error('Unsupported provider');
        }

        // Don't save item if it already exists
        if (savedAuth.map(item => item.id).includes(newItem.id)) {
            console.log('AbstractManager.onMessageRememberAuth() The auth already saved');
            return;
        }

        savedAuth.push(newItem);
        await this.innerSetSavedAuthList(savedAuth);

        console.log('AbstractManager.onMessageRememberAuth() done, id %s', newItem.id);

        sendResponse(newItem.id);
    }

    /**
     * @param {Array} savedAuth
     * @returns {Promise<void>}
     */
    async innerSetSavedAuthList(savedAuth) {
    }

    /**
     * Removes auth data from local storage
     *
     * @param payload
     * @param sender
     * @param sendResponse
     * @returns {Promise<void>}
     */
    async onMessageForgetAuth(payload, sender, sendResponse) {
        const keyToRemove = payload.payload.id;

        let { savedAuth = [] } = await browser.storage.local.get('savedAuth');

        for (let index in savedAuth) {
            let auth = savedAuth[index];
            /*let key;

            switch (auth.type) {
                case 'webhook':
                    key = md5(auth.url);
                    break;
            }*/

            if (auth.id === keyToRemove) {
                savedAuth = savedAuth.slice(0, index).concat(savedAuth.slice(index + 1));
                break;
            }
        }

        await this.innerSetSavedAuthList(savedAuth);
        sendResponse(null);
    }

    async onMessageOpenSavedConnection(payload, sender, sendResponse) {
        const savedId = payload.payload.id;
        let { savedAuth = [] } = await browser.storage.local.get('savedAuth');
        const savedItem = savedAuth.find(item => item.id === savedId);

        if (!savedItem) {
            return false;
        }

        let providerName;
        let providerPayload;

        switch (savedItem.type) {
            case 'webhook':
                providerName = 'webhook';

                providerPayload = {
                    ...savedItem.credentials
                };
                break;

            case 'oauth':
                providerName = 'classicOauth';

                providerPayload = {
                    ...savedItem.credentials
                };
                break;

            default:
                return false;
        }

        this.createTabInstance({
            providerName: providerName,
            providerPayload: providerPayload,
        });

        sendResponse(true);
    }

    /**
     *
     * @param {string} type
     * @param {Object} credentials
     * @returns {string}
     */
    getUniqIdByCredentials(type, credentials) {
        switch (type) {
            case 'webhook':
                return md5(credentials.url);

            case 'oauth':
                return md5(credentials.clientId + credentials.clientSecret);

            default:
                throw new Error('Unknown type of credentials');
        }
    }

    hydrateInstance(data) {
        // To be overriden
    }

    hydrateInstanceById(id) {
        // To be overriden
    }
}