import BX24 from "./BX24";
import messageListener from '../lib/MessageListener';
import { alert } from 'lib/functions';
import AppProvider from 'lib/AuthProvider/AppProvider';
import OAuthProvider from 'lib/AuthProvider/OAuthProvider';

messageListener.init();

/**
 * @typedef {Object} B24Auth
 * @property {string} domain
 * @property {string} access_token
 * @property {number} expires_in
 * @property {number} member_id
 * @property {string} refresh_token
 */

export default class ExtensionRunner {
    constructor({tab}) {
        this.callerTab = tab;
    }

    static get providers() {
        return {
            'app': AppProvider,
            'oauth': OAuthProvider,
        };
    }

    static createInstance({tab}) {
        if (!this.instances) {
            this.instances = [null];
        }

        let instance = new ExtensionRunner({tab});
        this.instances.push(instance);
        instance.id = this.instances.length - 1;

        return instance;
    }

    async run() {
        await this.detectPage();

        if (!this.pageType) {
            alert('-');
            return;
        }

        this.provider = new (this.constructor.providers[this.pageType])({
            tabId: this.tabId,
            frameId: this.frameId
        });

        try {
            this.auth = await this.provider.obtain();
        } catch (ex) {
            alert(ex.toString());
            return;
        }

        if (!this.auth) {
            alert('Авторизация не была получена');
            return;
        }

        // Add listener if obtaining authorization is successful only
        messageListener.subscribe('getAppData', this.onExtensionRequestAuth.bind(this));
        messageListener.subscribe('refreshAuth', this.onExtensionRefreshAuth.bind(this));
        this.openExtensionPage();
    }

    async detectPage() {
        this.pageType = null;

        if (/bitrix24\.ru\/marketplace\/app\//i.test(this.callerTab.url) !== false) {
            let frames = await browser.webNavigation.getAllFrames({tabId: this.callerTab.id});
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
                this.tabId = this.callerTab.id;
                this.frameId = frame.frameId;
                this.portal = /\/\/(.*?)\//gi.exec(this.callerTab.url)[1];
                this.appUrl = frame.url;
                this.pageType = 'app';
            }
        } else if (/bitrix24\.ru\/marketplace\/local\/edit\/\d+\//.test(this.callerTab.url)) {
            let frames = await browser.webNavigation.getAllFrames({tabId: this.callerTab.id});
            let frameFound = false;
            let frame;

            for (frame of frames) {
                if (/bitrix24\.ru\/marketplace\/local\/edit\/\d+\/\?.*IFRAME.*/.test(frame.url) !== false) {
                    frameFound = true;
                    break;
                }
            }

            if (frameFound) {
                this.tabId = this.callerTab.id;
                this.frameId = frame.frameId;
            }

            this.pageType = 'oauth';
        }

        console.log(this.pageType);
    }

    async openExtensionPage() {
        this.extensionTab = await browser.tabs.create({
            url: '/tab/index.html',
            openerTabId: this.callerTab.id,
        });
    }

    onExtensionRequestAuth(message, sender, sendResponse) {
        // Listen to own extension tab only
        if (!sender.tab || sender.tab.id !== this.extensionTab.id) {
            return;
        }

        sendResponse({
            title: this.provider.appName,
            portal: this.provider.domain,
            appUrl: this.provider.appUrl,
            auth: this.auth,
        });
    }

    async onExtensionRefreshAuth(message, sender, sendResponse) {
        // Listen to own extension tab only
        if (!sender.tab || sender.tab.id !== this.extensionTab.id) {
            return;
        }

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
