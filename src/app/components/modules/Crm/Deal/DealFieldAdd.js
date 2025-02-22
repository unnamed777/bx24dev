import { h } from "vue";
import AbstractFieldAdd from "@app/components/modules/Crm/Abstract/AbstractFieldAdd.vue";

export default {
    name: 'DealFieldAdd',

    render() {
        return h(AbstractFieldAdd, {
            breadcrumb: ['CRM', 'Сделки', 'Поля', 'Добавить'],
            addEndpoint: 'crm.deal.userfield.add',
            reloadFieldsAction: 'dealFields/forceLoad',
            listRoute: 'crmDealFields',
        });
    },
};