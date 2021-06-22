export default class WebhookProvider {
    constructor({ url }) {
        let result = /^([^\s]+)\s+([^\s]+)\s+([^\s]+)/.exec(url);

        if (result !== null) {
            url = `https://${result[1]}/rest/${result[2]}/${result[3]}`;
        }

        if (url.substr(-1) === '/') {
            url = url.substr(0, url.length - 1);
        }

        this.credentials = {
            url
        };
    }

    obtain() {
        let result = /^.*:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)\/?$/.exec(this.credentials.url);

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

    getCredentials() {
        return { ...this.credentials };
    }
}