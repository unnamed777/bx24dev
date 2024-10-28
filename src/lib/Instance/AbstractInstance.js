import { alert } from 'lib/functions';

/**
 * @typedef {Object} B24Auth
 * @property {string} domain
 * @property {string} access_token OAuth
 * @property {number} expires_in OAuth
 * @property {number} member_id OAuth
 * @property {string} refresh_token OAuth
 * @property {string} url Webhook
 */

/**
 * @typedef {Object} AuthorizationData
 * @property {String} title
 * @property {String} portal
 * @property {String} appUrl
 * @property {String} authType
 * @property {B24Auth} auth
 */
export default class AbstractInstance {
    constructor({ id, tab, providerName, messageListener, providerPayload }) {
        console.log('AbstractInstance.constructor()', providerName);
        this.id = id;
        this.callerTab = tab;
        this.messageListener = messageListener;

        this.providerName = providerName;
        this.providerPayload = providerPayload;

        //this.run();
    }

    async obtainAuth() {
        // Initialize auth provider
        this.provider = new (this.constructor.providers[this.providerName])({
            instance: this,
            instanceId: this.id,
            messageListener: this.messageListener,
            ...this.providerPayload,
        });

        // Obtain auth
        try {
            this.auth = await this.provider.obtain();
        } catch (ex) {
            alert(ex.toString());
            return false;
        }

        console.log('Auth from provider', this.auth);

        if (!this.auth) {
            this.provider.suppressOwnAlert = true;
            alert('Авторизация не была получена. ' + this.provider.authError);
            return false;
        }

        return true;
    }

    /**
     * @param {SessionInstanceData}
     * @returns {AbstractInstance}
     */
    static hydrate({id, tab, providerName, messageListener, providerPayload, providerSerializedData}) {
        const instance = new this.prototype.constructor({
            id,
            tab,
            providerName,
            messageListener,
            providerPayload,
        });

        if (typeof instance.constructor.providers[instance.providerName].hydrate !== 'function') {
            throw new Error(`Provider ${instance.providerName} doesn't support hydration`);
        }

        instance.provider = (instance.constructor.providers[instance.providerName]).hydrate({
            instance,
            instanceId: instance.id,
            messageListener: messageListener,
            ...instance.providerPayload,
            serializedData: providerSerializedData,
        });

        return instance;
    }

    async onInstanceReady() {}

    /**
     * @returns {AuthorizationData}
     */
    getData() {
        return {
            title: this.provider.appName,
            portal: this.provider.domain,
            appUrl: this.provider.appUrl,
            auth: this.auth,
            authType: this.provider.type,
        };
    }

    getId() {
        return this.id;
    }

    getProviderName() {
        return this.providerName;
    }

    /**
     *
     * @returns {SessionInstanceData}
     */
    serialize() {
        return {
            id: this.id,
            callerTabId: this.callerTab?.id,
            providerName: this.providerName,
            providerPayload: this.providerPayload,
            provider: typeof this.provider.serialize === 'function' ? this.provider.serialize() : null,
        };
    }
}