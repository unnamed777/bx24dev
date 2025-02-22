import { h } from "vue";
import AbstractFieldEdit from "@app/components/modules/Crm/Abstract/AbstractFieldEdit.vue";
import InvoiceUserField from "@lib/entities/Crm/InvoiceUserField";

export default {
    name: 'InvoiceFieldEdit',

    render() {
        return h(AbstractFieldEdit, {
            breadcrumb: ['CRM', 'Счета', 'Поля'],
            getEndpoint: InvoiceUserField.endpoint,
            updateEndpoint: InvoiceUserField.updateEndpoint,
            reloadFieldsAction: 'invoiceFields/forceLoad',
            listRoute: 'crmInvoiceFields',
        });
    },
};