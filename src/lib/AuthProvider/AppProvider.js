import { alert, getExposedPromise } from 'lib/functions';
//import browser from 'webextension-polyfill';

export default class AppProvider {
    constructor({ tabId, frameId, instanceId, authController, messageListener }) {
        this.tabId = tabId;
        this.frameId = frameId;
        this.instanceId = instanceId;
        this.authError = null;
        this.messageListener = messageListener;
    }

    /**
     * @returns {Promise<B24Auth>|null}
     */
    async obtain() {
        console.log('AppProvider.obtain()');
        this.messageListener.subscribe(`AppProvider_${this.instanceId}:authRefreshed`, this.onAuthRefreshed.bind(this));
        let result;

        const callerTab = (await browser.tabs.get(this.tabId));
        this.appName = callerTab.title;
        this.domain = (new URL(callerTab.url)).hostname;
        this.appUrl = (await browser.webNavigation.getFrame({ tabId: this.tabId, frameId: this.frameId })).url;
        this.type = 'oauth';
        console.log('instanceId', this.instanceId);

        try {
            // Chrome version is too tangled, but seems to work with firefox too
            if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1 || true) {
                // Chrome
                this.returnAuthCallbackId = this.messageListener.subscribe(`AppProvider_${this.instanceId}:returnAuth`, this.onReturnAuth.bind(this));

                const {promise, resolve } = getExposedPromise();
                this.getAuthResultResolve = resolve;
                this.getAuthResultTimeout = setTimeout(this.onGetAuthResultFailed.bind(this), 3000);

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
                        
                        let injectRefreshFunction = function () {
                            console.log('injectRefreshFunction');
                            
                            BX24.refreshAuth((auth) => {
                                document.dispatchEvent(new CustomEvent('bx24dev_${this.instanceId}:getRefreshResult', { detail: auth }));
                            });
                        };
                        
                        document.addEventListener('bx24dev_${this.instanceId}:getAuthResult', (e) => {
                            chrome.runtime.sendMessage({
                                type: 'AppProvider_${this.instanceId}:returnAuth',
                                payload: {
                                    instanceId: ${this.instanceId},
                                    auth: e.detail,
                                },
                            });
                        });
                        
                        document.addEventListener('bx24dev_${this.instanceId}:getRefreshResult', (e) => {
                            chrome.runtime.sendMessage({
                                type: 'AppProvider_${this.instanceId}:authRefreshed',
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
                                type: 'AppProvider_${this.instanceId}:authRefreshed',
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
            this.authError = 'Возможно, для этого приложения уже был запущен инстанс bx24dev';
            //alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
            return;
        }

        return result;
    }

    onReturnAuth({ payload }) {
        console.log('AppProvider.onReturnAuth()');
        /*if (payload.instanceId !== this.instanceId) {
            return;
        }*/

        // We don't need this event anymore
        this.messageListener.unsubscribe(`AppProvider_${this.instanceId}:returnAuth`);
        this.auth = payload.auth;
        console.log('Auth from iframe', payload.auth);
        this.getAuthResultResolve(payload.auth);
        clearTimeout(this.getAuthResultTimeout);
        delete this.getAuthResultResolve;
    }

    onGetAuthResultFailed() {
        // Usually AuthController instance is responsible for showing error, but just in case
        // a provider can show own error message if AuthController instance haven't done the job
        if (this.suppressOwnAlert !== true) {
            this.suppressOwnAlert = false;
            alert('Не удалось получить авторизацию. Попробуйте перезагрузить страницу с приложением Б24');
        }

        if (this.getAuthResultResolve) {
            this.getAuthResultResolve(null);
            delete this.getAuthResultResolve;
        }
    }

    async refresh() {
        let result;
        console.log('provider.refresh()', this.instanceId);

        const callerTab = (await browser.tabs.get(this.tabId));

        try {
            this.authRefreshedCallbackId = this.messageListener.subscribe(`AppProvider_${this.instanceId}:authRefreshed`, this.onAuthRefreshed.bind(this));

            const { promise, resolve } = getExposedPromise();
            this.authRefreshedResultResolve = resolve;
            this.authRefreshedResultTimeout = setTimeout(this.onRefreshFailed.bind(this), 3000);

            await browser.tabs.executeScript(this.tabId, {
                frameId: this.frameId,
                code: `
                    window.__tmpScript = document.createElement('script');
                        
                    window.__tmpScript.textContent = '(' + injectRefreshFunction.toString() + ')();';
                    document.body.appendChild(window.__tmpScript);
                    delete window.__tmpScript;
                    false;
                `,
            });

            result = promise;
        } catch (ex) {
            this.authError = 'Возможно, для этого приложения уже был запущен инстанс bx24dev';
            //alert('Ошибка получения авторизации из фрейма');
            console.error(ex);
            return;
        }

        return result;
    }

    onAuthRefreshed({payload}) {
        if (payload.instanceId !== this.instanceId) {
            return;
        }

        console.log('onAuthRefreshed()', payload);

        this.messageListener.unsubscribe(`AppProvider_${this.instanceId}:authRefreshed`, this.authRefreshedCallbackId);
        clearTimeout(this.authRefreshedResultTimeout);
        this.authRefreshedResultResolve(payload.auth);
        delete this.authRefreshedResultResolve;
    }

    onRefreshFailed() {
        alert('Не удалось получить авторизацию. Попробуйте перезагрузить страницу с приложением Б24');

        if (this.authRefreshedResultResolve) {
            this.authRefreshedResultResolve(null);
            delete this.authRefreshedResultResolve;
        }
    }
}