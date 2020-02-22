import Vuex from 'vuex';
import dealFields from "./modules/dealFields";
import leadFields from "./modules/leadFields";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        activeAppId: null,
        activeModule: null,
        breadcrumb: [],
    },
    mutations: {
        setActiveAppId(state, payload) {
            state.activeAppId = payload;
        },

        setActiveModule(state, payload) {
            state.activeModule = payload;
        },

        setBreadcrumb(state, payload) {
            state.breadcrumb = payload;
        }
    },
    modules: {
        dealFields,
        leadFields,
    }
});

export default store;
