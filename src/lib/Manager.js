import messageListener from 'lib/MessageListener';
import { alert } from 'lib/functions';
import AppProvider from 'lib/AuthProvider/AppProvider';
import OAuthProvider from 'lib/AuthProvider/OAuthProvider';
import WebhookProvider from 'lib/AuthProvider/WebhookProvider';
import TokenProvider from 'lib/AuthProvider/TokenProvider';
import browser from 'webextension-polyfill';

messageListener.init();

/**
 * @typedef {Object} B24Auth
 * @property {string} domain
 * @property {string} access_token
 * @property {number} expires_in
 * @property {number} member_id
 * @property {string} refresh_token
 */

export default class Manager {
    static init() {
        console.log('Manager.init()');
        messageListener.subscribe('createExtensionInstance', this.onCreateExtensionInstance.bind(this));
    }

    static onCreateExtensionInstance({type, payload}) {
        const instance = this.createInstance({
            providerName: payload.providerName,
            providerPayload: payload.providerPayload,
        });
    }

    static get providers() {
        return {
            'app': AppProvider,
            'oauth': OAuthProvider,
            'webhook': WebhookProvider,
            'token': TokenProvider,
        };
    }

    static async openByButton({ callerTab }) {
        let providerName = null;
        let providerPayload = {};

        if (/bitrix24\.ru\/marketplace\/app\//i.test(callerTab.url) !== false) {
            // App's page
            let frames = await browser.webNavigation.getAllFrames({tabId: callerTab.id});
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

            providerName = 'oauth';
        }

        if (providerName) {
            this.createInstance({
                tab: callerTab,
                providerName,
                providerPayload,
            });
        } else {
            this.openLoginPage();
        }
    }

    static openLoginPage() {
        browser.tabs.create({
            url: '/login/index.html',
            //openerTabId: this.callerTab.id,
        });
    }

    constructor({tab, providerName, providerPayload}) {
        this.callerTab = tab;

        this.providerName = providerName;
        this.providerPayload = providerPayload;

        this.run();
    }

    /**
     *
     * @param tab
     * @param mode Seems to be obsolete
     * @returns {Manager}
     */
    static createInstance({ tab, providerName, providerPayload }) {
        console.log('createInstance()');
        if (!this.instances) {
            this.instances = [null];
        }

        // @todo split Manager and Provider
        let instance = new Manager({tab, providerName, providerPayload });
        this.instances.push(instance);
        instance.id = this.instances.length - 1;

        return instance;
    }

    async run() {
        this.provider = new (this.constructor.providers[this.providerName])({
            //tabId: this.tabId,
            //frameId: this.frameId,
            //instanceId: this.id,
            ...this.providerPayload,
        });

        try {
            this.auth = await this.provider.obtain();
        } catch (ex) {
            alert(ex.toString());
            return;
        }

        console.log('Auth from provider', this.auth);

        if (!this.auth) {
            alert('Авторизация не была получена');
            return;
        }

        // Add listener if obtaining authorization is successful only
        messageListener.subscribe('getAppData', this.onExtensionRequestAuth.bind(this));
        messageListener.subscribe('refreshAuth', this.onExtensionRefreshAuth.bind(this));
        await this.openExtensionPage();
    }

    async openExtensionPage() {
        console.log('openExtensionPage()');
        this.extensionTab = await browser.tabs.create({
            url: '/tab/index.html',
            openerTabId: this.callerTab ? this.callerTab.id : null,
        });
    }

    onExtensionRequestAuth(message, sender, sendResponse) {
        // Listen to own extension tab only
        if (!sender.tab || sender.tab.id !== this.extensionTab.id) {
            return;
        }

        console.log(this.provider);

        sendResponse({
            title: this.provider.appName,
            portal: this.provider.domain,
            appUrl: this.provider.appUrl,
            auth: this.auth,
            authType: this.provider.type,
        });
    }

    async onExtensionRefreshAuth(message, sender, sendResponse) {
        // Listen to own extension tab only
        if (!sender.tab || sender.tab.id !== this.extensionTab.id) {
            return;
        }

        console.log('onExtensionRefreshAuth', message, sender);

        try {
            this.auth = await this.provider.refresh();
        } catch (ex) {
            alert(ex.toString());
            return;
        }

        if (!this.auth) {
            alert('Авторизация не была получена');
            return;
        }

        sendResponse({
            title: this.provider.appName,
            portal: this.provider.domain,
            appUrl: this.provider.appUrl,
            auth: this.auth,
        });
    }
}
