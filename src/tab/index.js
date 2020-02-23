import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';

window.app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {},
    methods: {
        test() {
            console.log('test method');
        }
    }
});
