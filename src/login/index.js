import Vue from 'vue';
import App from './App';
import browser from 'webextension-polyfill';

(async () => {
    window.app = new Vue({
        el: '#app',

        render: h => h(App, {}),

        methods: {
        }
    });
})();
