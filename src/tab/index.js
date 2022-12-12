import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import browser from 'webextension-polyfill';
import BX24 from 'lib/BX24';

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
    console.log('obtainAuthData()');
    let authData = await browser.runtime.sendMessage({
        type: 'getAuth',
        payload: {
            authId,
        },
    });

    console.log('obtainAuthData(), got message response');

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


const getInitialData = async () => {
    const scope = await BX24.fetch('scope');
    await store.commit('setScope', scope);
}

(async () => {
    const authId = getAuthId();
    const authData = await obtainAuthData(authId);
    initBX24(authId, authData);
    await getInitialData();

    //setTimeout(() => { BX24.expiredTokenHandler(); }, 1000);

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