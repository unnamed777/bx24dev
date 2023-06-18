import AuthController from 'lib/AuthController';
//import md5 from 'md5';

export default class AbstractManager {
    constructor(messageListener) {
        this.messageListener = messageListener;

        console.log('Manager.constructor()');
        this.messageListener.subscribe('getRecentList', this.onMessageGetRecentList.bind(this));
        this.messageListener.subscribe('openRecentConnection', this.onMessageOpenRecentConnection.bind(this));
        this.messageListener.subscribe('getSavedList', this.onMessageGetSavedList.bind(this));
        this.messageListener.subscribe('rememberAuth', this.onMessageRememberAuth.bind(this));
        this.messageListener.subscribe('forgetAuth', this.onMessageForgetAuth.bind(this));
        this.messageListener.subscribe('openSavedConnection', this.onMessageOpenSavedConnection.bind(this));

         /** @type {Array<AuthController>} */
        this.instances = [null];
    }

    /**
     *
     * @param tab
     * @param {string} providerName
     * @param {Object} providerPayload
     * @returns {AuthController}
     */
    createTabInstance({ tab, providerName, providerPayload }) {
        console.log('Manager.createTabInstance()');

        this.instances.push(null);
        const newInstanceId = this.instances.length - 1;

        let instance = new AuthController({
            id: newInstanceId,
            tab,
            providerName,
            providerPayload
        });

        this.instances[newInstanceId] = instance;

        return instance;
    }

    async onMessageGetRecentList(payload, sender, sendResponse) {
        let result = [];
        let uniq = new Set();

        for (let authController of this.instances) {
            if (!(authController instanceof AuthController)) {
                continue;
            }

            let data = authController.getData();
            let credentials = authController.provider.getCredentials ? authController.provider.getCredentials() : {};
            let uniqId;

            switch (authController.getProviderName()) {
                case 'webhook':
                    uniqId = this.getUniqIdByCredentials('webhook', credentials);

                    if (uniq.has(uniqId)) {
                        continue;
                    }

                    result.push({
                        type: 'webhook',
                        authId: authController.getId(),
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
                        authId: authController.getId(),
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

        return result;
    }

    async onMessageOpenRecentConnection({ payload }, sender, sendResponse) {
        const recentAuthController = this.instances[payload.authId];
        let providerName;

        if (recentAuthController.getProviderName() === 'grabOauth') {
            providerName = 'classicOauth';
        } else {
            providerName = recentAuthController.getProviderName();
        }

        if (recentAuthController.provider.getCredentials === undefined) {
            throw new Error('Provider doesn\'t have reusable credentials');
        }

        await this.createTabInstance({
            tab: null,
            providerName,
            providerPayload: recentAuthController.provider.getCredentials(),
        });

        return true;
    }

    async onMessageGetSavedList(payload, sender, sendResponse) {
        let storageResult = await browser.storage.local.get('savedAuth');

        if (!storageResult.savedAuth) {
            return [];
        }

        let result = [];

        for (let item of storageResult.savedAuth) {
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

        return result;
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
        const authController = this.instances[payload.payload.authId];

        if (authController.provider.getCredentials === undefined) {
            throw new Error('Provider doesn\'t have reusable credentials');
        }

        const credentials = authController.provider.getCredentials();
        // noinspection JSVoidFunctionReturnValueUsed
        let storageResult = await browser.storage.local.get('savedAuth');
        let savedAuth;

        if (storageResult.savedAuth) {
            savedAuth = storageResult.savedAuth;
        } else {
            savedAuth = [];
        }

        let newItem;

        switch (authController.getProviderName()) {
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
            return;
        }

        savedAuth.push(newItem);
        await browser.storage.local.set({ savedAuth });

        return newItem.id;
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

        await browser.storage.local.set({ savedAuth });
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

        return true;
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
}