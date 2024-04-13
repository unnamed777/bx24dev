import Vue from 'vue';
import App from '@web/App';
import store from '@app/store';
import router from '@web/router';
import channel, { TYPE_REQUEST_ACTIVE_CONNECTIONS, TYPE_REQUEST_AUTH_DATA_BY_UUID } from "@web/etc/channel";

window.app = new Vue({
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

        /**
         * @param {Object} to
         */
        goToRoute(to) {
            if (!to.params) {
                to.params = {};
            }

            // @todo Is it the best way to get authId?
            to.params.authId = router.currentRoute.params.authId;
            this.$router.push(to);
        }
    }
});

channel.registerHandler(TYPE_REQUEST_ACTIVE_CONNECTIONS, (data) => {
    // The instance doesn't have authorization data yet
    if (!store.state.appData.auth) {
        return;
    }

    channel.sendResponse(data.uuid, store.state.appData);
});

channel.registerHandler(TYPE_REQUEST_AUTH_DATA_BY_UUID, (data) => {
    const authId = router.currentRoute.params.authId;

    if (authId !== data.payload.authId) {
        return;
    }

    channel.sendResponse(data.uuid, store.state.appData);
});