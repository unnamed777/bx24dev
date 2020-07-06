import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

//import vSelect from 'vue-select';

window.app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {},
    methods: {}
});

/*Vue.component('v-select', vSelect);

vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('span', ''),
  },
});*/
