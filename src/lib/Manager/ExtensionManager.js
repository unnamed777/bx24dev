import messageListener from '../MessageListener/extensionMessageListener';
import AbstractManager from './AbstractManager';
import ExtensionInstance from 'lib/Instance/ExtensionInstance';
//import browser from 'webextension-polyfill';
import md5 from 'md5';

class ExtensionManager extends AbstractManager {
    constructor(messageListener) {
        super(messageListener);
        this.instanceClass = ExtensionInstance;
        this.messageListener.subscribe('createExtensionInstance', this.onMessageCreateExtensionInstance.bind(this));
        this.messageListener.subscribe('getAuth', this.onMessageGetAuth.bind(this));
        this.messageListener.subscribe('refreshAuth', this.onMessageRefreshAuth.bind(this));
    }

    onMessageCreateExtensionInstance({ payload }) {
        console.log('Manager.onMessageCreateExtensionInstance()');
        this.createTabInstance({
            providerName: payload.providerName,
            providerPayload: payload.providerPayload,
        });
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
     * @returns {AbstractInstance}
     */
    createTabInstance({ tab, providerName, providerPayload }) {
        console.log('Manager.createTabInstance()');

        this.instances.push(null);
        const newInstanceId = this.instances.length - 1;

        let instance = new ExtensionInstance({
            id: newInstanceId,
            tab,
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
        let storageResult = await browser.storage.local.get('savedAuth');

        if (!storageResult.savedAuth) {
            return [];
        }

        return storageResult.savedAuth;
    }

    /**
     * @param {Array} savedAuth
     * @returns {Promise<void>}
     */
    async innerSetSavedAuthList(savedAuth) {
        await browser.storage.local.set({ savedAuth });
    }
}

const manager = new ExtensionManager(messageListener);

export default manager;
