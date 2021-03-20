import messageListener from 'lib/MessageListener';
import { alert } from 'lib/functions';
import AppProvider from 'lib/AuthProvider/AppProvider';
import OAuthProvider from 'lib/AuthProvider/OAuthProvider';
import WebhookProvider from 'lib/AuthProvider/WebhookProvider';
import TokenProvider from 'lib/AuthProvider/TokenProvider';
import browser from 'webextension-polyfill';

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
export default class Authorization {
    static get providers() {
        return {
            'app': AppProvider,
            'oauth': OAuthProvider,
            'webhook': WebhookProvider,
            'token': TokenProvider,
        };
    }

    constructor({id, tab, providerName, providerPayload}) {
        console.log('Authorization constructor()');
        this.id = id;
        this.callerTab = tab;

        this.providerName = providerName;
        this.providerPayload = providerPayload;

        // noinspection JSIgnoredPromiseFromCall
        this.run();
    }

    async run() {
        this.provider = new (this.constructor.providers[this.providerName])({
            instanceId: this.id,
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

        //messageListener.subscribe('refreshAuth', this.onExtensionRefreshAuth.bind(this));
        await this.openExtensionPage();
    }

    async openExtensionPage() {
        console.log('openExtensionPage()');
        // Could be race condition for webhook + instance.id
        this.extensionTab = await browser.tabs.create({
            url: '/tab/index.html#/' + this.id,
            openerTabId: this.callerTab ? this.callerTab.id : null,
        });
    }

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

    async refreshAuth() {
        console.log('Authorization.refreshAuth()');

        try {
            this.auth = await this.provider.refresh();
        } catch (ex) {
            alert(ex.toString());
            return;
        }

        if (!this.auth) {
            alert('Авторизация не была получена');
            return;
        }

        console.log('refreshed auth', this.auth);

        return this.getData();
    }
}