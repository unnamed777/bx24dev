import { newMessageListener as messageListener, default as oldMessageListener } from 'lib/MessageListener';
import AuthController from 'lib/AuthController';
import browser from 'webextension-polyfill';
import md5 from 'md5';
import { alert } from "lib/functions";

//oldMessageListener.init();

class Manager {
    constructor() {
        console.log('Manager.constructor()');
        messageListener.subscribe('createExtensionInstance', this.onMessageCreateExtensionInstance.bind(this));
        messageListener.subscribe('getAuth', this.onMessageGetAuth.bind(this));
        messageListener.subscribe('refreshAuth', this.onMessageRefreshAuth.bind(this));
        messageListener.subscribe('getRecentList', this.onMessageGetRecentList.bind(this));
        messageListener.subscribe('openRecentConnection', this.onMessageOpenRecentConnection.bind(this));
        messageListener.subscribe('getSavedList', this.onMessageGetSavedList.bind(this));
        messageListener.subscribe('rememberAuth', this.onMessageRememberAuth.bind(this));
        messageListener.subscribe('forgetAuth', this.onMessageForgetAuth.bind(this));
        messageListener.subscribe('createExtensionInstanceBySavedId', this.onMessageCreateExtensionInstanceBySavedId.bind(this));

         /** @type {Array<AuthController>} */
        this.instances = [null];
    }

    onMessageCreateExtensionInstance({ payload }) {
        console.log('Manager.onMessageCreateExtensionInstance()');
        this.createTabInstance({
            providerName: payload.providerName,
            providerPayload: payload.providerPayload,
        });
    }

    async openByButton({ callerTab }) {
        let providerName = null;
        let providerPayload = {};

        if (/bitrix24\.ru\/marketplace\/app\//i.test(callerTab.url) !== false) {
            // App's page
            // noinspection JSVoidFunctionReturnValueUsed
            let frames = await browser.webNavigation.getAllFrames({ tabId: callerTab.id });
            let appFound = false;
            let frame;

            // Check app frame
            for (frame of frames) {
                if (/\?DOMAIN=.*APP_SID=/gi.test(frame.url) !== false) {
                    appFound = true;
                    break;
                }
            }

            if (appFound) {
                providerPayload.tabId = callerTab.id;
                providerPayload.frameId = frame.frameId;
                providerPayload.portal = /\/\/(.*?)\//gi.exec(callerTab.url)[1];
                providerPayload.appUrl = frame.url;
                providerName = 'app';
            }
        } else if (/bitrix24\.ru\/devops\/edit\/application\/\d+\//.test(callerTab.url)) {
            // "Edit app" page
            // noinspection JSVoidFunctionReturnValueUsed
            let frames = await browser.webNavigation.getAllFrames({ tabId: callerTab.id });
            let frameFound = false;
            let frame;

            for (frame of frames) {
                if (/bitrix24\.ru\/devops\/edit\/application\/\d+\/\?.*IFRAME.*/.test(frame.url) !== false) {
                    frameFound = true;
                    break;
                }
            }

            if (frameFound) {
                providerPayload.tabId = callerTab.id;
                providerPayload.frameId = frame.frameId;
            }

            providerName = 'grabOauth';
        }

        if (providerName) {
            this.createTabInstance({
                tab: callerTab,
                providerName,
                providerPayload,
            });
        } else {
            this.openLoginPage();
        }
    }

    openLoginPage() {
        browser.tabs.create({
            url: '/login/index.html',
            //openerTabId: this.callerTab.id,
        });
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

    onMessageGetAuth(payload, sender, sendResponse) {
        // or instanceId? Just changed it
        const authId = payload.payload.authId;
        console.log('Manager.onMessageGetAuth()', authId, payload);

        if (!this.instances[authId]) {
            console.error(`Authorization with ID ${authId} not found`);
            return;
        }

        console.log(this.instances[authId].getData());
        sendResponse(this.instances[authId].getData());
    }

    async onMessageRefreshAuth(payload, sender, sendResponse) {
        const authId = payload.payload.authId;
        console.log('Manager.onMessageRefreshAuth()', authId);

        if (!this.instances[authId]) {
            console.error(`Authorization with ID ${authId} not found`);
            return;
        }

        let result = await this.instances[authId].refreshAuth();
        console.log('Manager.onMessageRefreshAuth(), result', result);
        return result;
        //sendResponse(result);
    }

    async onMessageGetRecentList(payload, sender, sendResponse) {
        let result = [];
        let uniq = new Set();
        console.log(this.instances);

        for (let authController of this.instances) {
            if (!(authController instanceof AuthController)) {
                continue;
            }

            let data = authController.getData();
            let credentials = authController.provider.getCredentials ? authController.provider.getCredentials() : {};

            switch (authController.getProviderName()) {
                case 'webhook':
                    if (uniq.has(data.auth.url)) {
                        continue;
                    }

                    result.push({
                        type: 'webhook',
                        authId: authController.getId(),
                        id: md5(credentials.url),
                        title: data.title,
                        portal: data.portal,
                        url: credentials.url,
                    });

                    uniq.add(data.auth.url);
                    break;

                case 'grabOauth':
                    let uniqId = md5(credentials.clientId + credentials.clientSecret);

                    if (uniq.has(uniqId)) {
                        continue;
                    }

                    result.push({
                        type: 'oauth',
                        authId: authController.getId(),
                        id: uniqId,
                        title: data.title,
                        portal: data.portal,
                        clientId: credentials.clientId.substr(0, 8) + '***'
                    });
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
                    let parts = /^.*:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)\/?$/.exec(item.url);

                    exportItem = {
                        id: item.id,
                        type: 'webhook',
                        title: 'Webhook',
                        portal: parts[1],
                        url: item.url,
                    };
                    break;

                case 'oauth':
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
                    url: authController.getData().auth.url,
                };

                newItem.id = md5(newItem.url);
                break;
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
            let key;

            switch (auth.type) {
                case 'webhook':
                    key = md5(auth.url);
                    break;
            }

            if (key === keyToRemove) {
                savedAuth = savedAuth.slice(0, index).concat(savedAuth.slice(index + 1));
                break;
            }
        }

        await browser.storage.local.set({ savedAuth });
    }

    async onMessageCreateExtensionInstanceBySavedId(payload, sender, sendResponse) {
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
                    url: savedItem.url
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
}

const manager = new Manager;

export default manager;
