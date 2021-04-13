import Vue from 'vue';
import App from './App';
import browser from 'webextension-polyfill';

const getInitialData = async () => {
    // @todo make batch
    const scope = await BX24.fetch('scope');
    await store.commit('setScope', scope);

    const methods = await BX24.fetch('methods');
    await store.commit('setAvailableMethods', methods);
}

(async () => {
    //await getInitialData();

    window.app = new Vue({
        el: '#app',

        render: h => h(App, {}),

        methods: {
        }
    });
})();
