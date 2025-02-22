import { h } from "vue";
import AbstractFields from "@app/components/modules/Crm/Abstract/AbstractFields.vue";
import InvoiceUserField from "@lib/entities/Crm/InvoiceUserField";

export default {
    name: 'InvoiceFields',

    render() {
        return h(AbstractFields, {
            load: () => this.$store.dispatch('invoiceFields/load'),
            breadcrumb: ['CRM', 'Счета', 'Поля'],
            b24EditEntity: 'CRM_INVOICE',
            rawFields: this.$store.state.invoiceFields.items,
            addFieldRoute: 'crmInvoiceFieldAdd',
            editFieldRoute: 'crmInvoiceFieldEdit',
            listEndpoint: InvoiceUserField.listEndpoint,
            deleteEndpoint: InvoiceUserField.deleteEndpoint,
            reloadFieldsAction: 'invoiceFields/reload',
        });
    },
};
