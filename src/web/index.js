import Vue from 'vue';
import App from '@web/App';
import store from '@app/store';
import router from '@web/router';

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
            params.authId = 0;

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

            to.params.authId = 0;
            this.$router.push(to);
        }
    }
});