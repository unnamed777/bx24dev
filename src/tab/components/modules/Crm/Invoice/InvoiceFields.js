import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';
import InvoiceUserField from "lib/entities/Crm/InvoiceUserField";

export default {
    name: 'InvoiceFields',

    render(h) {
        return h(AbstractFields, {
            props: {
                load: () => this.$store.dispatch('invoiceFields/load'),
                breadcrumb: ['CRM', 'Счета', 'Поля'],
                b24EditEntity: 'CRM_INVOICE',
                rawFields: this.$store.state.invoiceFields.items,
                addFieldRoute: 'crmInvoiceFieldAdd',
                editFieldRoute: 'crmInvoiceFieldEdit',
                listEndpoint: InvoiceUserField.listEndpoint,
                deleteEndpoint: InvoiceUserField.deleteEndpoint,
                reloadFieldsAction: 'invoiceFields/reload',
            },
        });
    },
};
