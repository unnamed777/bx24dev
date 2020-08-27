import messageListener from "lib/MessageListener";
import { alert, getExposedPromise } from 'lib/functions';

export default class AppProvider {
    constructor({tabId, frameId}) {
        this.tabId = tabId;
        this.frameId = frameId;
    }

    /**
     * @returns {Promise<B24Auth>}
     */
    async obtain() {
        messageListener.subscribe('refreshAppAuth', this.onRefresh.bind(this));
        let result;

        const callerTab = (await browser.tabs.get(this.tabId));
        this.appName = callerTab.title;
        this.domain = (new URL(callerTab.url)).hostname;
        this.appUrl = (await browser.webNavigation.getFrame({ tabId: this.tabId, frameId: this.frameId })).url;
        this.type = 'oauth';

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
            alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
            return;
        }

        console.log('executeScript result', result);

        // If auth is failed (expired in app), try to refresh it
        if (result === false) {
            result = await this.refresh();
        }

        return result;
    }

    async refresh() {
        // If b24 authorization is expired or other error happens, this call will notify of problem
        this.refreshTimeout = setTimeout(this.onRefreshFailed, 3000);
        const {promise, resolve } = getExposedPromise();
        this.refreshResolve = resolve;

        // @todo add promise which will be resolved when refreshAuth callback fired
        try {
            browser.tabs.executeScript(this.tabId, {
                frameId: this.frameId,
                code: `window.wrappedJSObject.BX24.refreshAuth(window.wrappedJSObject.refreshAuthHelper);`,
            });
        } catch (ex) {
            alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
        }

        return promise;
    }

    onRefresh({payload}) {
        if (payload.id !== this.id) {
            return;
        }

        console.log('onRefreshAppAuth');
        clearTimeout(this.refreshTimeout);
        alert('onRefreshAppAuth happened...');
        this.refreshResolve(payload.auth);
        delete this.refreshResolve;
    }

    onRefreshFailed() {
        alert('Не удалось получить авторизацию. Попробуйте перезагрузить страницу с приложением Б24');

        if (this.refreshResolve) {
            this.refreshResolve(null);
            delete this.refreshResolve;
        }
    }
}