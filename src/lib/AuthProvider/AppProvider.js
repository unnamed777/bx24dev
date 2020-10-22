import messageListener from 'lib/MessageListener';
import { alert, getExposedPromise } from 'lib/functions';
import browser from 'webextension-polyfill';

export default class AppProvider {
    constructor({tabId, frameId, instanceId}) {
        this.tabId = tabId;
        this.frameId = frameId;
        this.instanceId = instanceId;
    }

    /**
     * @returns {Promise<B24Auth>|null}
     */
    async obtain() {
        messageListener.subscribe('AppProvider:authRefreshed', this.onAuthRefreshed.bind(this));
        let result;

        const callerTab = (await browser.tabs.get(this.tabId));
        this.appName = callerTab.title;
        this.domain = (new URL(callerTab.url)).hostname;
        this.appUrl = (await browser.webNavigation.getFrame({ tabId: this.tabId, frameId: this.frameId })).url;
        this.type = 'oauth';

        try {
            // Chrome version is too tangled, but seems to work with firefox too
            if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1 || true) {
                // Chrome
                this.returnAuthCallbackId = messageListener.subscribe('AppProvider:returnAuth', this.onReturnAuth.bind(this));

                const {promise, resolve } = getExposedPromise();
                this.getAuthResultResolve = resolve;
                this.getAuthResultTimeout = setTimeout(this.onGetAuthResultFailed, 3000);

                // Inject a code to inject a code to run a code. Inception.jpg
                await browser.tabs.executeScript(this.tabId, {
                    frameId: this.frameId,
                    code: `
                        // 1. Inject code in page context to run BX24.getAuth()
                        // 2. Injected code is run immediately and it emits event "bx24_dev_xxx:getAuthResult" with auth data
                        // 3. This code (content page context) catches the event from injected code
                        // 4. This code sends a message "AppProvider:returnAuth" to extension background page and passes auth data
                        
                        let script = document.createElement('script');
                        
                        let injectFunction = function () {
                            document.dispatchEvent(new CustomEvent('bx24dev_${this.instanceId}:getAuthResult', { detail: BX24.getAuth() }));
                        };
                        
                        document.addEventListener('bx24dev_${this.instanceId}:getAuthResult', (e) => {
                            chrome.runtime.sendMessage({
                                type: 'AppProvider:returnAuth',
                                payload: {
                                    instanceId: ${this.instanceId},
                                    auth: e.detail,
                                },
                            });
                        });
                        
                        script.textContent = '(' + injectFunction.toString() + ')();';
                        document.body.appendChild(script);
                        delete script;
                    `,
                });

                result = promise;
            } else {
                // Firefox
                result = (await browser.tabs.executeScript(this.tabId, {
                    frameId: this.frameId,
                    code: `
                        function refreshAuthHelper(auth) {
                            browser.runtime.sendMessage({
                                type: 'AppProvider:authRefreshed',
                                payload: {
                                    id: ${this.instanceId},
                                    auth: auth,
                                }
                            });
                        }

                        exportFunction(refreshAuthHelper, window, {defineAs: 'refreshAuthHelper'});
                        window.wrappedJSObject.BX24.getAuth();
                    `,
                }))[0];
            }

        } catch (ex) {
            alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
            return;
        }

        // If auth is failed (expired in app), try to refresh it
        /*if (result === false) {
            result = await this.refresh();
        }*/

        return result;
    }

    onReturnAuth({ payload }) {
        if (payload.instanceId !== this.instanceId) {
            return;
        }

        // We don't need this eveny anymore
        messageListener.unsubscribe('AppProvider:returnAuth', this.returnAuthCallbackId);

        console.log('Auth from iframe', payload.auth);
        this.getAuthResultResolve(payload.auth);
        clearTimeout(this.getAuthResultTimeout);
        delete this.getAuthResultResolve;
    }

    onGetAuthResultFailed() {
        alert('Не удалось получить авторизацию. Попробуйте перезагрузить страницу с приложением Б24');

        if (this.getAuthResultResolve) {
            this.getAuthResultResolve(null);
            delete this.getAuthResultResolve;
        }
    }

    async refresh() {
        // If b24 authorization is expired or other error happens, this call will notify of the problem
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

    onAuthRefreshed({payload}) {
        if (payload.id !== this.instanceId) {
            return;
        }

        clearTimeout(this.refreshTimeout);
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