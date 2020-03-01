import BX24 from "./BX24";
import messageListener from '../lib/MessageListener';

messageListener.init();

export default class ExtensionRunner {
    constructor({tab}) {
        this.callerTab = tab;
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

        if (this.pageType) {
            await this[`obtain${this.pageType}Auth`]();
        } else {
            this.alert('-');
            return;
        }

        if (!this.auth) {
            return;
        }

        messageListener.subscribe('getAppData', this.onExtensionRequestAuth.bind(this));
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
                this.pageType = 'App';
            }
        } else if (/bitrix24\.ru\/marketplace\/local\/edit\/\d+\//.test(this.callerTab.url)) {
            this.pageType = 'Oauth';
        }

        console.log(this.pageType);
    }

    alert(message) {
        browser.tabs.executeScript({code : `alert(${JSON.stringify(message)});`});
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
            title: this.callerTab.title,
            portal: this.portal,
            appUrl: this.appUrl,
            auth: this.auth,
        });
    }

    async obtainAppAuth() {
        messageListener.subscribe('refreshAppAuth', this.onRefreshAppAuth.bind(this));
        let result;

        try {
            result = (await browser.tabs.executeScript(this.tabId, {
                frameId: this.frameId,
                code: `
                        function refreshAuthHelper(auth) {
                            console.log(auth);
                            browser.runtime.sendMessage({
                                type: 'refreshAuth',
                                payload: {
                                    id: ${this.id},
                                    auth: auth,
                                }
                            });
                        }

                        exportFunction(refreshAuthHelper, window, {defineAs: 'refreshAuthHelper'});

                        window.wrappedJSObject.BX24.getAuth();
                    `,
            }))[0];

        } catch (ex) {
            this.alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
            return;
        }

        console.log('executeScript result', result);

        // If auth is failed (expired in app), try to refresh it
        if (result === false) {
            result = await this.refreshAppAuth();
        }

        if (!result) {
            this.alert('Авторизация не получена.');
            return;
        }

        this.auth = result;
    }

    async refreshAppAuth() {
        // If b24 authorization is expired or other error happens, this call will notify of problem
        this.refreshTimeout = setTimeout(this.onRefreshAppAuthFailed, 3000);

        try {
            browser.tabs.executeScript(this.tabId, {
                frameId: this.frameId,
                code: `window.wrappedJSObject.BX24.refreshAuth(window.wrappedJSObject.refreshAuthHelper);`,
            });
        } catch (ex) {
            alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
        }
    }

    onRefreshAppAuth({payload}) {
        if (payload.id !== this.id) {
            return;
        }

        console.log('onRefreshAppAuth');
        clearTimeout(this.refreshTimeout);
        BX24.setAuth(payload.auth);
    }

    onRefreshAppAuthFailed() {
        this.alert('Не удалось получить авторизацию. Попробуйте перезагрузить страницу с приложением Б24');
    }

    obtainOauthAuth() {
    }
}
