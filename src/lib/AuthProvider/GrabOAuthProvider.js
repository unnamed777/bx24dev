import AbstractOAuthProvider from './AbstractOAuthProvider';
import { alert } from 'lib/functions';
import browser from 'lib/browser-stub';

export default class GrabOAuthProvider extends AbstractOAuthProvider {
    constructor({tabId, frameId}) {
        super();
        this.tabId = tabId;
        this.frameId = frameId;
        this.redirectCallback = this.redirectCallback.bind(this);
    }

    /**
     * @returns {Promise<B24Auth>}
     */
    async obtain() {
        this.credentials = await this.grabCredentials();
        return await this.authorize();
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
    async grabCredentials() {
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
}