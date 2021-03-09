import messageListener from 'lib/MessageListener';
import { alert } from 'lib/functions';
import { getExposedPromise } from 'lib/functions';
import browser from 'webextension-polyfill';

export default class OAuthProvider {
    constructor({tabId, frameId}) {
        this.tabId = tabId;
        this.frameId = frameId;
        this.redirectCallback = this.redirectCallback.bind(this);
    }

    /**
     * @returns {Promise<B24Auth>}
     */
    async obtain() {
        this.credentials = await this.getCredentials();

        await this.obtainCode();
        await this.obtainFirstToken();

        this.appUrl = this.credentials.appUrl;
        this.appName = this.credentials.appName;
        this.domain = this.auth.domain;
        this.type = 'oauth';

        return this.auth;
    }

    /**
     * Obtains b24 application credential from its editing page
     * @returns {Promise<B24OauthCredentials>}
     * @typedef {Object} B24OauthCredentials
     * @property {string} appName
     * @property {string} appUrl
     * @property {string} domain
     * @property {string} clientId
     * @property {string} clientSecret
     */
    async getCredentials() {
        let result;

        try {
            result = (await browser.tabs.executeScript(this.tabId, {
                frameId: this.frameId,
                code: `(function () {
                    let appName = document.querySelector('#pagetitle .ui-side-panel-wrap-title-name').innerHTML.trim();
                    let appUrl = document.querySelector('input[name="APPLICATION_URL_HANDLER"]').value;
                    let clientId = document.querySelector('input[name="APPLICATION_DATA_CLIENT_ID"]').value;
                    let clientSecret = document.querySelector('input[name="APPLICATION_DATA_CLIENT_SECRET"]').value;
                    // or host with port?
                    let domain = (new URL(document.location.href)).hostname;
                    
                    return {
                        appName,
                        appUrl,
                        domain,
                        clientId,
                        clientSecret,
                    };
                })();`,
            }))[0];
        } catch (ex) {
            console.error(ex);
            alert('Ошибка получения данных OAuth со страницы редактирования приложения');
            throw ex;
        }

        return result;
    }

    async obtainCode() {
        const waitForUrl = this.credentials.appUrl;
        const authUrl = `https://${this.credentials.domain}/oauth/authorize/?client_id=${this.credentials.clientId}&state=bx24dev-ext-auth`;

        const { promise, resolve } = getExposedPromise();
        this.onRedirectToApp = resolve;

        let authTab = await browser.tabs.create({
            url: 'about:blank',
            active: true,
            // Required to inherit cookieStoreId (firefox containers)
            openerTabId: this.tabId,
        });

        browser.webRequest.onBeforeRequest.addListener(this.redirectCallback, {
            urls: [waitForUrl + '?*'],
            tabId: authTab.id,
        }, ['blocking']);

        browser.tabs.update(authTab.id, { url: authUrl });

        // Wait here till authorization is provided
        /** @var {String} */
        const redirectUrl = await promise;

        await browser.tabs.update(this.tabId, { active: true });
        await browser.tabs.remove(authTab.id);

        this.code = (new URL(redirectUrl)).searchParams.get('code');
        return this.code;
    }

    async redirectCallback(details) {
        console.log('Captured url details', details);

        browser.webRequest.onBeforeRequest.removeListener(this.redirectCallback);
        this.onRedirectToApp(details.url);

        return {
            cancel: true,
        };
    }

    async obtainFirstToken() {
        const urlParams = this.createUrlParamsFromObject({
            grant_type: 'authorization_code',
            client_id: this.credentials.clientId,
            client_secret: this.credentials.clientSecret,
            code: this.code,
        });

        const tokenUrl = 'https://oauth.bitrix.info/oauth/token/?' + urlParams.toString();
        let result;

        try {
            result = await fetch(tokenUrl).then(response => response.json());
        } catch (ex) {
            console.error(ex);
            throw new Error(`Ошибка получения первого токена через OAuth.\n${ex.toString()}`);
        }

        if (result.error) {
            console.error(result);
            throw new Error(`Ошибка получения первого токена через OAuth.\n${result.error_description} (${result.error})`);
        }

        /** @var {B24Auth} */
        this.auth = {
            domain: /:\/\/(.*?)\//.exec(result.client_endpoint)[1],
            access_token: result.access_token,
            expires_in: result.expires_in,
            member_id: result.member_id,
            refresh_token: result.refresh_token,
        };
    }

    async refresh() {
        const urlParams = this.createUrlParamsFromObject({
            grant_type: 'refresh_token',
            client_id: this.credentials.clientId,
            client_secret: this.credentials.clientSecret,
            refresh_token: this.auth.refresh_token,
        });

        const refreshUrl = `https://oauth.bitrix.info/oauth/token/?${urlParams.toString()}`;
        const result = await fetch(refreshUrl).then(response => response.json());

        if (result.error) {
            console.error('Refresh token error', result);
            throw new Error(`Ошибка получения нового токена через OAuth\n${result.error_description} (${result.error})`);
        }

        this.auth.refresh_token = result.refresh_token;
        this.auth.expires_in = result.expires_in;

        return this.auth;
    }

    /**
     *
     * @param {Object} obj
     */
    createUrlParamsFromObject(obj) {
        const urlParams = new URLSearchParams;

        for (let [param, value] of Object.entries(obj)) {
            urlParams.append(param, value);
        }

        return urlParams;
    }

}