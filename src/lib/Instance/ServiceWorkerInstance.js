import AbstractInstance from 'lib/Instance/AbstractInstance';
import WebhookProvider from 'lib/AuthProvider/WebhookProvider';
import TokenProvider from 'lib/AuthProvider/TokenProvider';
import { getExposedPromise } from "lib/functions";

export default class ServiceWorkerInstance extends AbstractInstance
{
    readyPromise;
    readyResolve;

    static get providers() {
        return {
            'webhook': WebhookProvider,
            'token': TokenProvider,
        };
    }

    constructor(args) {
        super(args);

        // Maybe I need to introduce this promise in abstract class?
        const { promise, resolve } = getExposedPromise();
        this.readyPromise = promise;
        this.readyResolve = resolve;
    }

    async onInstanceReady() {
        console.log('ServiceWorkerInstance()');
        this.readyResolve();
    }
}