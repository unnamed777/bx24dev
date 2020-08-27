import messageListener from "lib/MessageListener";
import { alert, getExposedPromise } from 'lib/functions';

export default class WebhookProvider {
    constructor({tabId, frameId}) {
        this.tabId = tabId;
        this.frameId = frameId;
    }

    /**
     * @returns {Promise<B24Auth>}
     */
    async obtain() {
        messageListener.subscribe('webhookAuthSubmitUrl', this.onUrlSubmit.bind(this));
        let result;

        this.webhookTab = await browser.tabs.create({
            url: '/webhook/index.html',
            //openerTabId: this.callerTab.id,
        });

        const {promise, resolve} = getExposedPromise();
        this.submitResolve = resolve;

        return promise;
    }

    async onUrlSubmit({type, payload}) {
        let result = /^.*:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)/.exec(payload);

        this.authData = {
            url: result[0],
            domain: result[1],
            userId: result[2],
            key: result[3],
        };

        this.appName = 'Webhook';
        this.domain = this.authData.domain;
        this.type = 'webhook';

        await browser.tabs.remove(this.webhookTab.id);
        this.submitResolve(this.authData);
    }

    async refresh() {
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