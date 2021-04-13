import messageListener from 'lib/MessageListener';
import { alert, getExposedPromise } from 'lib/functions';
import browser from 'webextension-polyfill';

export default class WebhookProvider {
    constructor({ url }) {
        this.url = url;
    }

    obtain() {
        let result = /^.*:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)\/?$/.exec(this.url);

        // That's not an url, may be just host, user and key
        if (result === null) {
            result = /^([^\s]+) ([^\s]+) ([^\s]+)/.exec(this.url);

            if (result !== null) {
                result[0] = `https://${result[1]}/rest/${result[2]}/${result[3]}`;
            }
        } else if (result[0].substr(-1) === '/') {
            result[0] = result[0].substr(0, result[0].length - 1);
        }

        this.authData = {
            url: result[0],
            domain: result[1],
            userId: result[2],
            key: result[3],
        };

        this.appName = 'Webhook';
        this.domain = this.authData.domain;
        this.type = 'webhook';

        return this.authData;
    }

    async refresh() {
    }

    onRefresh({payload}) {
    }

    onRefreshFailed() {
    }
}