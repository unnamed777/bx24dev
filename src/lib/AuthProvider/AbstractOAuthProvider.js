import { alert, sleep } from 'lib/functions';
import { getExposedPromise } from 'lib/functions';
import browser from 'webextension-polyfill';

export default class AbstractOAuthProvider {
    constructor() {
        this.debug = true;
    }

    /**
     * @returns {Promise<B24Auth>}
     */
    async authorize() {
        await this.obtainCode();
        await this.obtainFirstToken();

        this.appUrl = this.credentials.appUrl;
        this.appName = this.credentials.appName;
        this.domain = this.auth.domain;
        this.type = 'oauth';

        return this.auth;
    }

    async obtainCode() {
        const authUrl = `https://${this.credentials.domain}/oauth/authorize/?client_id=${this.credentials.clientId}&state=bx24dev-ext-auth`;
        this.debug && console.log('authUrl = %s', authUrl);

        const { promise, resolve } = getExposedPromise();
        this.onRedirectToApp = resolve;

        let authTab = await browser.tabs.create({
            url: 'about:blank',
            active: true,
            // Required to inherit cookieStoreId (firefox containers)
            openerTabId: this.tabId,
        });

        this.debug && console.log('Tab created, id = ', authTab.id);

        // Get rid of port. Url with port doesn't match pattern with port
        // However, url with port matches pattern without port
        const waitForUrl = this.credentials.appUrl.replace(/^(.*:\/\/)(?:([^/:]*)(:[0-9]{2,5})?)(.*)$/gi, '$1$2$4');
        this.debug && console.log('waitForUrl = %s', waitForUrl);

        browser.webRequest.onBeforeRequest.addListener(this.redirectCallback, {
            urls: [waitForUrl + '?*'],
            tabId: authTab.id,
        }, ['blocking']);

        this.debug && console.log('onBeforeRequest listener added');

        try {
            // Firefox 106 has a bug - if tab has been just created and immediately updated after that,
            // url isn't changed. I need to wait a bit before updating the tab
            if ((await browser.runtime.getBrowserInfo()).vendor === 'Mozilla') {
                await sleep(100);
            }
        } catch (ex) {}

        browser.tabs.update(authTab.id, { url: authUrl });
        this.debug && console.log('Tab url update requested');

        // Wait here till authorization is provided
        this.debug && console.log('Start waiting for url with code');
        /** @var {String} */
        const redirectUrl = await promise;
        this.debug && console.log('Url with code captured, %s', redirectUrl);

        await browser.tabs.update(this.tabId, { active: true });
        this.debug && console.log('B24 tab selected');
        await browser.tabs.remove(authTab.id);
        this.debug && console.log('Auth tab removed');

        this.code = (new URL(redirectUrl)).searchParams.get('code');
        this.debug && console.log('OAuth code: %s', this.code);
        return this.code;
    }

    async redirectCallback(details) {
        this.debug && console.log('Captured url details', details);

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
        console.log('OAuthProvider.refresh()');

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

        this.auth.access_token = result.access_token;
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

    /**
     * Data for initial authorization (like clientId + secret)
     *
     * @returns Object
     */
    getCredentials() {
        return { ...this.credentials };
    }
}