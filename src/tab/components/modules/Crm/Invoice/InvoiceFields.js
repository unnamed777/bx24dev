import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';

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
            },
        });
    },
};
