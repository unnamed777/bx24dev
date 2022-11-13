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
        availableMethods: [],
    },

    mutations: {
        setAppData(state, payload) {
            state.appData = payload;
        },

        setScope(state, payload) {
            state.scope = payload;
        },

        setAvailableMethods(state, payload) {
            let methods = [...payload];
            // Dirty hack to have sale.* methods, because "methods" doesn't return them
            if (state.scope && state.scope.indexOf('sale') !== -1) {
                methods = methods.concat([
                    'sale.basketItem.getFieldsCatalogProduct', 'sale.basketItem.list', 'sale.basketProperties.get', 'sale.basketitem.add', 'sale.basketitem.addCatalogProduct',
                    'sale.basketitem.delete', 'sale.basketitem.get', 'sale.basketitem.getFields', 'sale.basketitem.update', 'sale.basketproperties.add',
                    'sale.basketproperties.delete', 'sale.basketproperties.getFields', 'sale.basketproperties.list', 'sale.basketproperties.update', 'sale.businessValuePersonDomain.add',
                    'sale.businessValuePersonDomain.deleteByFilter', 'sale.businessValuePersonDomain.getFields', 'sale.businessValuePersonDomain.list', 'sale.order.add', 'sale.order.delete',
                    'sale.order.get', 'sale.order.getFields', 'sale.order.list', 'sale.order.tryadd', 'sale.order.tryupdate',
                    'sale.order.update', 'sale.payment.add', 'sale.payment.delete', 'sale.payment.get', 'sale.payment.getFields',
                    'sale.payment.list', 'sale.payment.update', 'sale.persontype.add', 'sale.persontype.delete', 'sale.persontype.get',
                    'sale.persontype.getFields', 'sale.persontype.list', 'sale.persontype.update', 'sale.property.add', 'sale.property.delete',
                    'sale.property.get', 'sale.property.getFieldsByType', 'sale.property.list', 'sale.property.update', 'sale.propertyRelation.add',
                    'sale.propertyRelation.deleteByFilter', 'sale.propertyRelation.getFields', 'sale.propertyRelation.list', 'sale.propertyVariant.add', 'sale.propertyVariant.delete',
                    'sale.propertyVariant.get', 'sale.propertyVariant.getFields', 'sale.propertyVariant.list', 'sale.propertyVariant.update', 'sale.propertygroup.add',
                    'sale.propertygroup.delete', 'sale.propertygroup.get', 'sale.propertygroup.getFields', 'sale.propertygroup.list', 'sale.propertygroup.update',
                    'sale.propertyvalue.delete', 'sale.propertyvalue.get', 'sale.propertyvalue.getFields', 'sale.propertyvalue.list', 'sale.propertyvalue.modify',
                    'sale.shipment.add', 'sale.shipment.delete', 'sale.shipment.get', 'sale.shipment.getFields', 'sale.shipment.list',
                    'sale.shipment.update', 'sale.shipmentitem.add', 'sale.shipmentitem.delete', 'sale.shipmentitem.get', 'sale.shipmentitem.getFields',
                    'sale.shipmentitem.list', 'sale.shipmentitem.update', 'sale.status.add', 'sale.status.delete', 'sale.status.get',
                    'sale.status.getFields', 'sale.status.list', 'sale.status.update', 'sale.statusLang.add', 'sale.statusLang.deleteByFilter',
                    'sale.statusLang.getFields', 'sale.statusLang.getListLangs', 'sale.statusLang.list', 'sale.tradeBinding.getFields', 'sale.tradeBinding.list',
                    'sale.tradePlatform.getFields', 'sale.tradePlatform.list',
                ]);
            }

            if (state.scope && state.scope.indexOf('crm') !== -1) {
                methods = methods.concat([
                    'crm.type.add', 'crm.type.delete', 'crm.type.fields', 'crm.type.get', 'crm.type.list', 'crm.type.update',
                    'crm.item.add', 'crm.item.delete', 'crm.item.fields', 'crm.item.get', 'crm.item.list', 'crm.item.update',
                ]);
            }

            // The same with catalog.*
            // Something weird with scopes
            if (state.scope && (state.scope.indexOf('sale') !== -1 || state.scope.indexOf('catalog') !== -1 || state.scope.indexOf('crm') !== -1)) {
                methods = methods.concat([
                    'catalog.catalog.add', 'catalog.catalog.delete', 'catalog.catalog.get', 'catalog.catalog.getFields', 'catalog.catalog.isOffers',
                    'catalog.catalog.list', 'catalog.catalog.update', 'catalog.enum.getRoundTypes', 'catalog.extra.get', 'catalog.extra.getFields',
                    'catalog.extra.list', 'catalog.measure.get', 'catalog.measure.getFields', 'catalog.measure.list', 'catalog.price.delete',
                    'catalog.price.get', 'catalog.price.getFields', 'catalog.price.list', 'catalog.price.modify', 'catalog.priceType.get', 'catalog.priceType.getFields',
                    'catalog.priceType.list', 'catalog.product.add', 'catalog.product.delete', 'catalog.product.download', 'catalog.product.get', 'catalog.product.getFieldsByFilter',
                    'catalog.product.list', 'catalog.product.update', 'catalog.ratio.get', 'catalog.ratio.getFields', 'catalog.ratio.list', 'catalog.roundingRule.get',
                    'catalog.roundingRule.getFields', 'catalog.roundingRule.list', 'catalog.section.add', 'catalog.section.delete', 'catalog.section.get', 'catalog.section.getFields',
                    'catalog.section.list', 'catalog.section.update', 'catalog.store.get', 'catalog.store.getFields', 'catalog.store.list', 'catalog.vat.get',
                    'catalog.vat.getFields', 'catalog.vat.list',
                ]);
            }

            if (state.scope && state.scope.includes('task')) {
                methods = methods.concat([
                    'tasks.task.add', 'tasks.task.approve', 'tasks.task.complete', 'tasks.task.counters.get', 'tasks.task.defer', 'tasks.task.delegate', 'tasks.task.delete',
                    'tasks.task.disapprove', 'tasks.task.favorite.add', 'tasks.task.favorite.delete', 'tasks.task.get', 'tasks.task.getFields', 'tasks.task.getaccess',
                    'tasks.task.history.list', 'tasks.task.list', 'tasks.task.pause', 'tasks.task.renew', 'tasks.task.start', 'tasks.task.startwatch', 'tasks.task.stopwatch',
                    'tasks.task.update',
                ]);
            }

            methods = methods.filter((value, index, self) => self.indexOf(value) === index);
            methods.sort();

            state.availableMethods = methods;
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
