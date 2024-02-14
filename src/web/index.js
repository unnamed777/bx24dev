import Vue from 'vue';
import App from './App';
import { getExposedPromise } from "lib/functions";

const initApp = () => {
    window.app = new Vue({
        el: '#app',

        render: h => h(App, {}),

        methods: {
            ready() {
                this.$children[0].ready();
            }
        }
    });
};

const registerServiceWorker = async () => {
    console.log('registerServiceWorker()');
    const { promise, resolve, reject } = getExposedPromise();

    if (!("serviceWorker" in navigator)) {
        alert('Браузер не поддерживает Service Worker');
        return Promise.reject();
    }

    try {
        const registration = await navigator.serviceWorker.register("../web_sw.js", {
            updateViaCache: 'none',
        });

        /*if (registration.installing) {
            console.log("Service worker installing");
        } else if (registration.waiting) {
            console.log("Service worker installed");
        } else if (registration.active) {
            console.log("Service worker active");
            resolve();
        }*/
        // @todo tmp
        //registration.update();
    } catch (error) {
        console.error(`Registration failed`, error);
        reject(error);
    }

    return navigator.serviceWorker.ready;
};

(async () => {
    initApp();
    let tmp = await registerServiceWorker();
    console.log('ready resolved', tmp.active);
    console.log(navigator.serviceWorker.controller);
    setTimeout(() => console.log(navigator.serviceWorker.controller), 10);
    window.app.ready();
})();