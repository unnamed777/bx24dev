import Vue from 'vue';
import App from './App';

const initApp = () => {
    window.app = new Vue({
        el: '#app',

        render: h => h(App, {}),

        methods: {
        }
    });
};

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("../web_sw.js", {
                updateViaCache: 'none',
            });
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

(async () => {
    await registerServiceWorker();
    initApp();
})();