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
import crmCatalogs from "./modules/crmCatalogs";
import crmSmartProcesses from './modules/crm/smartProcesses';
import productSectionFields from "./modules/productSectionFields";
import productFields from "./modules/productFields";
import crmStatuses from "./modules/crmStatuses";
import entities from "./modules/entities";
import entityProperties from "./modules/entityProperties";
import users from "./modules/users";
import saleOrderFields from "./modules/sale/orderFields";
import salePaymentFields from "./modules/sale/paymentFields";
import saleShipmentFields from "./modules/sale/shipmentFields";
import catalogCatalogs from "./modules/catalog/catalogs";
import catalogProductProperties from "./modules/catalog/productProperties";
import catalogProductPropertyFields from "./modules/catalog/productPropertyFields";
import catalogProductPropertyEnums from "./modules/catalog/productPropertyEnums";
import catalogProductFields from "./modules/catalog/productFields";
import catalogSectionFields from "./modules/catalog/sectionFields";
import console from './modules/console';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        breadcrumb: [],
        appData: {},
        scope: [],
    },

    mutations: {
        setAppData(state, payload) {
            state.appData = payload;
        },

        setScope(state, payload) {
            state.scope = payload;
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
        crmCatalogs,
        catalogFields,
        productSectionFields,
        productFields,
        crmStatuses,
        crmSmartProcesses,
        entities,
        entityProperties,
        users,
        fieldTypes,
        saleOrderFields,
        salePaymentFields,
        saleShipmentFields,
        catalogCatalogs,
        catalogProductPropertyFields,
        catalogProductProperties,
        catalogProductPropertyEnums,
        catalogProductFields,
        catalogSectionFields,
        console,
    }
});

export default store;
