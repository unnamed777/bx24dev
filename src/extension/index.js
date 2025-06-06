import { createApp } from "vue";
import PortalVue from "portal-vue";

import App from "@app/App";
import router from "@app/router";
import store from "@app/store";
import browser from "lib/browser-stub";
import BX24 from "lib/BX24";
import loadInitialData from "@app/etc/loadInitialData";

const getAuthId = () => {
    // The app needs to know id of AuthController before any routing
    let authId = document.location.hash.substr(2);
    let pos;

    if ((pos = authId.indexOf('/')) !== -1) {
        authId = authId.substr(0, pos);
    }

    return authId;
}

const obtainAuthData = async (authId) => {
    /** @var {AuthorizationData} */
    /** @see ExtensionManager.onMessageGetAuth() */
    let authData = await browser.runtime.sendMessage({
        type: 'getAuth',
        payload: {
            authId,
        },
    });

    //console.log('obtainAuthData(), got message response', authData);

    await store.commit('setAppData', authData);
    return authData;
};

const initBX24 = (authId, authData) => {
    BX24.setAuth(authData.authType, authData.auth);

    BX24.registerExpiredTokenHandler(async () => {
        console.log('expiredTokenHandler()');

        let authData = await browser.runtime.sendMessage({
            type: 'refreshAuth',
            payload: {
                authId,
            },
        });

        if (!authData || !authData.auth) {
            console.error('Didn\'t get new token');
            alert('Не удалось обновить ключ авторизации');
            return false;
        }

        BX24.setAuth(authData.authType, authData.auth);
        return true;
    });

    window.BX24 = BX24;
};

// @todo refactor
const resolveRoute = (route, params) => {
    params.authId = authId;

    return router.resolve({
        name: route,
        params: {
            ...params,
        },
    }).path;
};

// @todo refactor
/**
 * @param {Object} to
 */
const goToRoute = (to) => {
    if (!to.params) {
        to.params = {};
    }

    to.params.authId = authId;
    router.push(to);
};

let authId;

(async () => {
    authId = getAuthId();
    const authData = await obtainAuthData(authId);
    initBX24(authId, authData);
    await loadInitialData();

    //setTimeout(() => { BX24.expiredTokenHandler(); }, 1000);

    window.app = createApp(App, {
        mode: 'extension',
        title: authData.title,
        portal: authData.portal,
        authId: authId,
    });

    window.app
        .use(router)
        .use(store)
        .use(PortalVue)
        .provide('resolveRoute', resolveRoute)
        .provide('goToRoute', goToRoute)
        .mount('#app');

    /*window.app = new Vue({
        el: '#app',
        router,
        store,

        render: h => h(App, {
            props: {
                mode: 'extension',
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

            goToRoute(to) {
                if (!to.params) {
                    to.params = {};
                }

                to.params.authId = authId;
                this.$router.push(to);
            }
        }
    });*/
})();
