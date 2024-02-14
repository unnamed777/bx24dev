import AbstractAuthController from 'lib/AuthController/AbstractAuthController';
import browser from 'webextension-polyfill';
import AppProvider from 'lib/AuthProvider/AppProvider';
import GrabOAuthProvider from 'lib/AuthProvider/GrabOAuthProvider';
import WebhookProvider from 'lib/AuthProvider/WebhookProvider';
import ClassicOAuthProvider from 'lib/AuthProvider/ClassicOAuthProvider';
import TokenProvider from 'lib/AuthProvider/TokenProvider';

export default class ExtensionAuthController extends AbstractAuthController
{
    static get providers() {
        return {
            'app': AppProvider,
            'grabOauth': GrabOAuthProvider,
            'webhook': WebhookProvider,
            'token': TokenProvider,
            'classicOauth': ClassicOAuthProvider,
        };
    }

    async openAppPage() {
        console.log('openExtensionPage()');
        // Could be race condition for webhook + instance.id
        this.extensionTab = await browser.tabs.create({
            url: '/tab/index.html#/' + this.id,
            openerTabId: this.callerTab ? this.callerTab.id : null,
        });
    }

    async refreshAuth() {
        console.log('AuthController.refreshAuth()');

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