import { h } from "vue";
import AbstractFieldAdd from "@app/components/modules/Crm/Abstract/AbstractFieldAdd.vue";

export default {
    name: 'InvoiceFieldAdd',

    render() {
        return h(AbstractFieldAdd, {
            breadcrumb: ['CRM', 'Счета', 'Поля', 'Добавить'],
            addEndpoint: 'crm.invoice.userfield.add',
            reloadFieldsAction: 'invoiceFields/forceLoad',
            listRoute: 'crmInvoiceFields',
        });
    },
};