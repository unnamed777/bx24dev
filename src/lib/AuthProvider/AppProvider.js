import { alert, getExposedPromise } from 'lib/functions';
import browser from 'lib/browser-stub';

export default class AppProvider {
    constructor({ tabId, frameId, instanceId, instance, messageListener }) {
        this.tabId = tabId;
        this.frameId = frameId;
        this.instanceId = instanceId;
        this.authError = null;
        this.messageListener = messageListener;
    }

    /**
     *
     * @param {SessionAppProviderData}
     * @returns {AppProvider}
     */
    static hydrate({ tabId, frameId, instanceId, instance, messageListener, serializedData }) {
        const provider = new this.prototype.constructor({
            tabId,
            frameId,
            instanceId,
            messageListener,
        });

        provider.appName = serializedData.appName;
        provider.domain = serializedData.domain;
        provider.appUrl = serializedData.appUrl;
        provider.type = serializedData.type;
        provider.auth = serializedData.auth;
        instance.auth = provider.auth;

        return provider;
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
            this.returnAuthCallbackId = this.messageListener.subscribe(`AppProvider_${this.instanceId}:returnAuth`, this.onReturnAuth.bind(this));

            const { promise, resolve } = getExposedPromise();
            this.getAuthResultResolve = resolve;
            this.getAuthResultTimeout = setTimeout(this.onGetAuthResultFailed.bind(this), 3000);

            // Keep it for debug purposes
            /*console.log('before');
            await browser.scripting.executeScript({
                target: {
                    tabId: this.tabId,
                    frameIds: [this.frameId],
                },
                func: () => {
                    window.alert('here');
                },
            });
            console.log('after');
            return;*/

            await browser.scripting.executeScript({
                target: {
                    tabId: this.tabId,
                    frameIds: [this.frameId],
                },
                args: [this.instanceId],
                // Inject a code to inject a code to run a code. Inception.jpg
                func: (instanceId) => {
                    // 1. In content page context subscribe to custom event to receive auth data
                    // 2. Add a script `pc_app_provider` to the page in page context to get access to page global variables.
                    // 3. `pc_app_provider` call bx24 api and emit custom event with auth data
                    // 4. This content page context script catches event and transmits it back to extension context
                    // 5. AppProvider waits for 3 secs for that answer or throws an error

                    // @todo Has to be fixed too
                    let injectRefreshFunction = function () {
                        console.log('injectRefreshFunction');

                        BX24.refreshAuth((auth) => {
                            document.dispatchEvent(new CustomEvent(`bx24dev_${instanceId}:getRefreshResult`, { detail: auth }));
                        });
                    };

                    document.addEventListener(`bx24dev_${instanceId}:getAuthResult`, (e) => {
                        chrome.runtime.sendMessage({
                            type: `AppProvider_${instanceId}:returnAuth`,
                            payload: {
                                instanceId: instanceId,
                                auth: e.detail,
                            },
                        });
                    });

                    document.addEventListener(`bx24dev_${instanceId}:getRefreshResult`, (e) => {
                        chrome.runtime.sendMessage({
                            type: `AppProvider_${instanceId}:authRefreshed`,
                            payload: {
                                instanceId: instanceId,
                                auth: e.detail,
                            },
                        });
                    });

                    let script = document.createElement('script');
                    script.src = chrome.runtime.getURL('tab/pc_app_provider.js');
                    script.dataset.instanceId = instanceId;
                    //script.onload = function() { this.remove(); };
                    (document.head || document.documentElement).appendChild(script);
                    script = null;
                },
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
        // Usually Instance is responsible for showing error, but just in case
        // a provider can show own error message if Instance haven't done the job
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

    /**
     * @returns {SessionAppProviderData}
     */
    serialize() {
        return {
            tabId: this.tabId,
            frameId: this.frameId,
            instanceId: this.instanceId,
            appName: this.appName,
            domain: this.domain,
            appUrl: this.appUrl,
            type: this.type,
            auth: this.auth,
        };
    }
}