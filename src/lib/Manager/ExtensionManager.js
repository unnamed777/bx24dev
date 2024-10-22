import messageListener from '../MessageListener/extensionMessageListener';
import AbstractManager from './AbstractManager';
import ExtensionInstance from 'lib/Instance/ExtensionInstance';
import browser from 'lib/browser-stub';
import { sleep } from 'lib/functions';

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

    /**
     * Message "getAuth" used in an Extension tab to obtain auth of the instance
     */
    async onMessageGetAuth(payload, sender, sendResponse) {
        const instanceId = payload.payload.authId;
        console.log('Manager.onMessageGetAuth()', instanceId, payload);

        if (!this.instances[instanceId]) {
            console.log('Instance isn\'t in memory, try to hydrate');
            // If there is no instance in memory, try to hydrate it from session data
            let result = (await browser.storage.session.get('instanceData')) || { instanceData: {} };
            const data = result.instanceData[instanceId];

            if (!data) {
                console.error(`Authorization with ID ${instanceId} not found`);
                return;
            }

            this.hydrateInstance(data);
        }

        //await sleep(5000);
        console.log('Data will be sent as response', this.instances[instanceId].getData());
        sendResponse(this.instances[instanceId].getData());
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
        sendResponse(result);
    }

    async openByButton({ callerTab }) {
        let providerName = null;
        let providerPayload = {};
        console.log('openByButton, tabId %d', callerTab.id);

        if (
            /\/marketplace\/app\//i.test(callerTab.url) !== false
            || /\/crm\/deal\/details\//i.test(callerTab.url) !== false
            || /\/crm\/contact\/details\//i.test(callerTab.url) !== false
            || /\/crm\/company\/details\//i.test(callerTab.url) !== false
            || /\/crm\/lead\/details\//i.test(callerTab.url) !== false
            || /\/crm\/type\/\d+\/details\//i.test(callerTab.url) !== false
        ) {
            console.log('*.bitrix24.ru app');
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

            console.log('appFound', appFound);

            if (appFound) {
                providerPayload.tabId = callerTab.id;
                providerPayload.frameId = frame.frameId;
                providerPayload.portal = /\/\/(.*?)\//gi.exec(callerTab.url)[1];
                providerPayload.appUrl = frame.url;
                providerName = 'app';
            }
        } else if (/\/devops\/edit\/application\/\d+\//.test(callerTab.url)) {
            // "Edit app" page
            // noinspection JSVoidFunctionReturnValueUsed
            let frames = await browser.webNavigation.getAllFrames({ tabId: callerTab.id });
            let frameFound = false;
            let frame;

            for (frame of frames) {
                if (/\/devops\/edit\/application\/\d+\/\?.*IFRAME.*/.test(frame.url) !== false) {
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

        console.log('provider', providerName, providerPayload);

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
    async createTabInstance({ tab, providerName, providerPayload }) {
        console.log('Manager.createTabInstance()');

        let { lastInstanceId = 0, instanceData = {} } = await browser.storage.session.get(['lastInstanceId', 'instanceData']);
        const newInstanceId = lastInstanceId + 1;

        let instance = new ExtensionInstance({
            id: newInstanceId,
            tab,
            messageListener: this.messageListener,
            providerName,
            providerPayload
        });

        this.instances[newInstanceId] = instance;
        console.log('instance created');

        if ((await instance.obtainAuth()) === false) {
            return;
        }

        console.log('after obtainAuth()');

        await instance.openTab();

        // Save data into session for further hydration
        instanceData[newInstanceId] = instance.serialize();

        browser.storage.session.set({
            lastInstanceId: newInstanceId,
            instanceData: instanceData,
        });

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

    hydrateInstance(data) {
        this.instances[data.id] = ExtensionInstance.hydrate({
            id: data.id,
            // @todo Try to find tab
            tab: null,
            providerName: data.providerName,
            providerPayload: data.providerPayload,
            providerSerializedData: data.provider,
            messageListener: this.messageListener,
        });
    }

    async hydrateAllInstances() {
        let result = (await browser.storage.session.get('instanceData')) || { instanceData: {} };

        for (let data of Object.values(result.instanceData)) {
            this.hydrateInstance(data);
        }
    }
}

const manager = new ExtensionManager(messageListener);

export default manager;
