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

    /**
     * @param {WebhookAuthProviderData} serializedData
     * @returns {WebhookProvider}
     */
    static hydrate({ tabId, frameId, instanceId, instance, messageListener, serializedData }) {
        const provider = new this.prototype.constructor({
            url: serializedData.credentials.url,
        });

        provider.appName = serializedData.appName;
        provider.domain = serializedData.domain;
        provider.type = serializedData.type;
        provider.auth = serializedData.auth;
        provider.credentials = serializedData.credentials;
        instance.auth = provider.auth;

        return provider;
    }

    obtain() {
        let result = /^.*:\/\/([^\/]+)\/rest\/([0-9]+)\/([^\/]+)(?:\/?|\/.+)?$$/.exec(this.credentials.url);

        // Seems to be inconsistent with others. Use credentials?
        this.auth = {
            url: result[0],
            domain: result[1],
            userId: result[2],
            key: result[3],
        };

        this.appName = 'Webhook';
        this.domain = this.auth.domain;
        this.type = 'webhook';

        return this.auth;
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

    /**
     * @returns {WebhookAuthProviderData}
     */
    serialize() {
        return {
            appName: this.appName,
            domain: this.domain,
            type: this.type,
            auth: this.auth,
            credentials: this.credentials,
        };
    }
}