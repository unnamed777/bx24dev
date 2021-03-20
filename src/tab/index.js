import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import browser from 'webextension-polyfill';
import BX24 from 'lib/BX24';

(async () => {
    // The app needs to know id of Authorization before any routing
    let authId = document.location.hash.substr(2);
    let pos;

    if ((pos = authId.indexOf('/')) !== -1) {
        authId = authId.substr(0, pos);
    }

    /** @var {AuthorizationData} */
    let authData = await browser.runtime.sendMessage({
        type: 'getAuth',
        payload: {
            authId,
        },
    });

    await store.commit('setAppData', authData);

    BX24.setAuth(authData.authType, authData.auth);
    window.BX24 = BX24;

    // @todo make batch
    const scope = await BX24.fetch('scope');
    await store.commit('setScope', scope);

    const methods = await BX24.fetch('methods');
    await store.commit('setAvailableMethods', methods);

    window.app = new Vue({
        el: '#app',
        router,
        store,

        render: h => h(App, {
            props: {
                title: authData.title,
                portal: authData.portal,
            },
        }),

        data: {
            authId: authId,
        },

        methods: {
            resolveRoute(route, params) {
                params.authId = authId;

                return this.$router.resolve({
                    name: route,
                    params: {
                        ...params,
                    },
                }).route.path;
            },

            /**
             * @param {Object} to
             */
            goToRoute(to) {
                if (!to.params) {
                    to.params = {};
                }

                to.params.authId = authId;
                this.$router.push(to);
            }
        }
    });
})();