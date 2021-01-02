import AbstractFieldEdit from 'components/modules/Crm/Abstract/AbstractFieldEdit.vue';
import InvoiceUserField from "lib/entities/Crm/InvoiceUserField";

export default {
    name: 'InvoiceFieldEdit',

    render(h) {
        return h(AbstractFieldEdit, {
            props: {
                breadcrumb: ['CRM', 'Счета', 'Поля'],
                getEndpoint: InvoiceUserField.endpoint,
                updateEndpoint: InvoiceUserField.updateEndpoint,
                reloadFieldsAction: 'invoiceFields/forceLoad',
                listRoute: 'crmInvoiceFields',
            },
        });
    },
};