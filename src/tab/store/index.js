import Vue from "vue";
import Vuex from 'vuex';
import router from '../router';
import fieldTypes from './fieldTypes';
import dealFields from "./modules/dealFields";
import dealStages from "./modules/dealStages";
import leadFields from "./modules/leadFields";
import leadStatuses from "./modules/leadStatuses";
import contactFields from "./modules/contactFields";
import companyFields from "./modules/companyFields";
import invoiceFields from "./modules/invoiceFields";
import invoiceStatuses from "./modules/invoiceStatuses";
import activityFields from "./modules/activityFields";
import activityOwnerTypes from "./modules/activityOwnerTypes";
import catalogFields from "./modules/catalogFields";
import productSectionFields from "./modules/productSectionFields";
import productFields from "./modules/productFields";
import crmStatuses from "./modules/crmStatuses";
import entities from "./modules/entities";
import entityProperties from "./modules/entityProperties";
import users from "./modules/users";
import orderFields from "./modules/orderFields";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        activeAppId: null,
        activeModule: null,
        breadcrumb: [],
        appData: {},
        scope: [],
        availableMethods: [],
    },

    mutations: {
        // @todo get rid
        setActiveAppId(state, payload) {
            state.activeAppId = payload;
        },

        setAppData(state, payload) {
            state.appData = payload;
        },

        setActiveModule(state, payload) {
            state.activeModule = payload;
        },

        setScope(state, payload) {
            state.scope = payload;
        },

        setAvailableMethods(state, payload) {
            state.availableMethods = payload;
        },

        setBreadcrumb(state, payload) {
            state.breadcrumb = payload.map((item) => {
                if (typeof item === 'object') {
                    return {
                        text: item.text,
                        link: router.resolve({
                            name: item.route,
                            params: item.params
                        }).href
                    };
                } else {
                    return {
                        link: '#',
                        text: item,
                    };
                }
            });
        }
    },

    modules: {
        dealFields,
        dealStages,
        leadFields,
        leadStatuses,
        companyFields,
        contactFields,
        invoiceFields,
        invoiceStatuses,
        activityFields,
        activityOwnerTypes,
        catalogFields,
        productSectionFields,
        productFields,
        crmStatuses,
        entities,
        entityProperties,
        users,
        fieldTypes,
        orderFields,
    }
});

export default store;
