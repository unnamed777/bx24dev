import { alert, sleep } from 'lib/functions';
import { getExposedPromise } from 'lib/functions';
import browser from 'lib/browser-stub';

export default class AbstractOAuthProvider {
    tabId;
    frameId;
    credentials;

    /**
     * @param instance
     * @param instanceId
     * @param {MessageListener} messageListener
     */
    constructor({ instance, instanceId, messageListener }) {
        this.debug = false;
        this.instance = instance;
        this.instanceId = instanceId;
        this.messageListener = messageListener;
        this.requestId = null;
    }

    /**
     *
     * @param {FullOAuthProviderData}
     * @returns {AbstractOAuthProvider}
     */
    static hydrate({ tabId, frameId, instanceId, instance, messageListener, serializedData }) {
        const provider = new this.prototype.constructor({
            tabId,
            frameId,
            instanceId,
            messageListener,
        });

        provider.appName = serializedData.appName;
        provider.domain = serializedData.domain;
        provider.appUrl = serializedData.appUrl;
        provider.type = serializedData.type;
        provider.auth = serializedData.auth;
        provider.credentials = serializedData.credentials;
        instance.auth = provider.auth;

        return provider;
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
        this.requestId = Date.now();

        // The event will be fired when browser catches redirect to app oauth url
        // and opens own helper `/tab/redirect.html` instead.
        this.messageListener.subscribe('oauthCallback', this.onOAuthCallback.bind(this));

        let oldRuleIds = [
            //...(await browser.declarativeNetRequest.getDynamicRules()).map(rule => rule.id),
            ...(await browser.declarativeNetRequest.getSessionRules()).map(rule => rule.id),
        ];

        await browser.declarativeNetRequest.updateSessionRules({
            removeRuleIds: oldRuleIds,
            addRules: [{
                id: this.requestId,
                priority: 1,
                condition: {
                    // Maybe escape of appUrl needed
                    regexFilter: "^" + this.credentials.appUrl + ".*?\\?(.*)$",
                    resourceTypes: ["main_frame"]
                },
                action: {
                    type: "redirect",
					redirect: {
						regexSubstitution: `${browser.runtime.getURL('/tab/helpers/redirect.html')}#id=${this.requestId}&\\1`
					}
                }
            }
        ]})

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

        try {
            // Firefox 106 has a bug - if tab has been just created and immediately updated after that,
            // url isn't changed. I need to wait a bit before updating the tab
            if ((await browser.runtime.getBrowserInfo()).vendor === 'Mozilla') {
                await sleep(100);
            }
        } catch (ex) {}

        // Go to bitrix24 auth url
        browser.tabs.update(authTab.id, { url: authUrl });
        this.debug && console.log('Tab url update requested');

        // Wait here till authorization is provided
        this.debug && console.log('Start waiting for the OAuth code');
        this.code = await promise;
        this.debug && console.log('OAuth code captured: %s', code);

        await browser.tabs.update(this.tabId, { active: true });
        this.debug && console.log('B24 tab selected');
        await browser.tabs.remove(authTab.id);
        this.debug && console.log('Auth tab removed');

        return this.code;
    }

    onOAuthCallback(payload) {
        if (parseInt(payload.params.id, 10) !== this.requestId) {
            return;
        }

        // Remove redirect rule
        browser.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [this.requestId],
        });

        this.onRedirectToApp(payload.params.code);
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

    /**
     *
     * @returns {FullOAuthProviderData}
     */
    serialize() {
        return {
            tabId: this.tabId || null,
            frameId: this.frameId || null,
            instanceId: this.instanceId,
            appName: this.appName,
            domain: this.domain,
            appUrl: this.appUrl,
            type: this.type,
            auth: this.auth,
            credentials: this.credentials,
        };
    }
}