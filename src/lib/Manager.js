import messageListener from 'lib/MessageListener';
import Tab from 'lib/Tab';
import browser from 'webextension-polyfill';

class Manager {
    constructor() {
        console.log('Manager initialized');
        messageListener.subscribe('createExtensionInstance', this.onCreateExtensionInstance.bind(this));
    }

    onCreateExtensionInstance({ payload }) {
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
     * @param mode Seems to be obsolete
     * @returns {Tab}
     */
    createTabInstance({ tab, providerName, providerPayload }) {
        if (!this.instances) {
            this.instances = [null];
        }

        let instance = new Tab({tab, providerName, providerPayload });
        this.instances.push(instance);
        instance.id = this.instances.length - 1;

        return instance;
    }
}

const manager = new Manager;

export default manager;
