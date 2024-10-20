import AbstractInstance from 'lib/Instance/AbstractInstance';
import browser from 'lib/browser-stub';
import AppProvider from 'lib/AuthProvider/AppProvider';
import GrabOAuthProvider from 'lib/AuthProvider/GrabOAuthProvider';
import WebhookProvider from 'lib/AuthProvider/WebhookProvider';
import ClassicOAuthProvider from 'lib/AuthProvider/ClassicOAuthProvider';
import TokenProvider from 'lib/AuthProvider/TokenProvider';

export default class ExtensionInstance extends AbstractInstance
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

    async openTab() {
        console.log('ExtensionInstance.openTab()');

        // Could be race condition for webhook + instance.id
        this.extensionTab = await browser.tabs.create({
            url: '/tab/index.html#/' + this.id,
            openerTabId: this.callerTab ? this.callerTab.id : null,
        });
    }

    async refreshAuth() {
        console.log('ExtensionInstance.refreshAuth()');

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