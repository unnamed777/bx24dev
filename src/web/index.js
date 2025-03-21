import { createApp } from "vue";
import PortalVue from "portal-vue";

import App from "@web/App";
import store from "@app/store";
import router from "@web/router";
import channel, { TYPE_REQUEST_ACTIVE_CONNECTIONS, TYPE_REQUEST_AUTH_DATA_BY_UUID } from "@web/etc/channel";
import { addToActiveConnections } from "@web/etc/storage";

// @todo Refactor - use composable
const resolveRoute = (route, params) => {
    params.authId = router.currentRoute.params.authId;

    return router.resolve({
        name: route,
        params: {
            ...params,
        },
    }).route.path;
};

// @todo Refactor - use composable
/**
 * @param {Object} to
 * @param {boolean} replace Replace current route in browser history instead of pushing it
 */
const goToRoute = (to, replace = false) => {
    if (!to.params) {
        to.params = {};
    }

    to.params.authId = router.currentRoute.params.authId;

    if (replace) {
        this.$router.replace(to);
    } else {
        this.$router.push(to);
    }
};

window.app = createApp(App, {
    authId: null,
});

window.app
    .use(store)
    .use(router)
    .use(PortalVue)
    .mount('#app');

/*window.app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App, {}),

    data: {
        authId: null,
    },

    methods: {
        resolveRoute(route, params) {
            params.authId = router.currentRoute.params.authId;

            return this.$router.resolve({
                name: route,
                params: {
                    ...params,
                },
            }).route.path;
        },

        goToRoute(to, replace = false) {
            if (!to.params) {
                to.params = {};
            }

            // @todo Is it the best way to get authId?
            to.params.authId = router.currentRoute.params.authId;

            if (replace) {
                this.$router.replace(to);
            } else {
                this.$router.push(to);
            }
        }
    }
});*/

// Login page asks other app tabs for active connections.
// Return info if the tab is authorized.
channel.registerHandler(TYPE_REQUEST_ACTIVE_CONNECTIONS, (data) => {
    // The instance doesn't have authorization data yet
    if (!store.state.appData.auth) {
        return;
    }

    channel.sendResponse(data.uuid, store.state.appData);
});

// When a new browser tab is opened with some UUID in url, that tab asks
// other app tabs for auth data for that UUID. This tab checks UUID and
// returns its auth data if necessary.
channel.registerHandler(TYPE_REQUEST_AUTH_DATA_BY_UUID, (data) => {
    const authId = router.currentRoute.params.authId;

    if (authId !== data.payload.authId) {
        return;
    }

    channel.sendResponse(data.uuid, store.state.appData);
});

// Save auth data in session storage in case of the tab (page) is being reloaded.
// Data is recovered by uuid (authId).
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') {
        return;
    }

    const authId = router.currentRoute.params.authId;

    if (!authId) {
        return;
    }

    addToActiveConnections(authId, store.state.appData);
});