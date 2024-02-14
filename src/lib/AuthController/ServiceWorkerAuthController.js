import AbstractAuthController from 'lib/AuthController/AbstractAuthController';
import WebhookProvider from 'lib/AuthProvider/WebhookProvider';
import TokenProvider from 'lib/AuthProvider/TokenProvider';

export default class ServiceWorkerAuthController extends AbstractAuthController
{
    static get providers() {
        return {
            'webhook': WebhookProvider,
            'token': TokenProvider,
        };
    }

    async openAppPage() {
        console.log('openExtensionPage()');
    }
}