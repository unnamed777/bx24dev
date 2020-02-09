import Vue from 'vue'
import App from './App'
import router from './router'

browser.tabs.create({
    url: '/tab/index.html',
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App),
});
