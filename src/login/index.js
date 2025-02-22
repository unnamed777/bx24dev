import { createApp } from "vue";
import App from "./App";
import browser from "webextension-polyfill";

(async () => {
    window.app = createApp(App);
    window.app.mount('#app');
})();
