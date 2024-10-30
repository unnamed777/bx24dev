export default class TokenProvider {
    constructor({domain, token}) {
        this.domain = domain;
        this.token = token;
    }

    /**
     * @param {TokenAuthProviderData} serializedData
     * @returns {TokenProvider}
     */
    static hydrate({ tabId, frameId, instanceId, instance, messageListener, serializedData }) {
        const provider = new this.prototype.constructor({
            domain: serializedData.auth.domain,
            token: serializedData.auth.access_token,
        });

        provider.appName = serializedData.appName;
        provider.type = serializedData.type;
        provider.auth = serializedData.auth;

        return provider;
    }

    obtain() {
        this.appName = 'Token';
        this.appUrl = '';
        this.type = 'token';

        this.auth = {
            domain: this.domain,
            access_token: this.token,
        };

        return this.auth;
    }

    /**
     * @returns {TokenAuthProviderData}
     */
    serialize() {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            type: this.type,
            auth: this.auth,
        };
    }
}