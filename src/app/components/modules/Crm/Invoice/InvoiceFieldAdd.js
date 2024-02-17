import AbstractFieldAdd from 'components/modules/Crm/Abstract/AbstractFieldAdd.vue';

export default {
    name: 'InvoiceFieldAdd',

    render(h) {
        return h(AbstractFieldAdd, {
            props: {
                breadcrumb: ['CRM', 'Счета', 'Поля', 'Добавить'],
                addEndpoint: 'crm.invoice.userfield.add',
                reloadFieldsAction: 'invoiceFields/forceLoad',
                listRoute: 'crmInvoiceFields',
            },
        });
    },
};