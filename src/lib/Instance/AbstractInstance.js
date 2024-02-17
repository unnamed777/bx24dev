import { alert } from 'lib/functions';

/**
 * @typedef {Object} B24Auth
 * @property {string} domain
 * @property {string} access_token
 * @property {number} expires_in
 * @property {number} member_id
 * @property {string} refresh_token
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
    constructor({id, tab, providerName, messageListener, providerPayload}) {
        console.log('AbstractInstance.constructor()', providerName);
        this.id = id;
        this.callerTab = tab;
        this.messageListener = messageListener;

        this.providerName = providerName;
        this.providerPayload = providerPayload;

        // noinspection JSIgnoredPromiseFromCall
        this.run();
    }

    async run() {
        this.provider = new (this.constructor.providers[this.providerName])({
            instance: this,
            instanceId: this.id,
            messageListener: this.messageListener,
            ...this.providerPayload,
        });

        try {
            this.auth = await this.provider.obtain();
        } catch (ex) {
            alert(ex.toString());
            return;
        }

        console.log('Auth from provider', this.auth);

        if (!this.auth) {
            this.provider.suppressOwnAlert = true;
            alert('Авторизация не была получена. ' + this.provider.authError);
            return;
        }

        await this.onInstanceReady();
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
}