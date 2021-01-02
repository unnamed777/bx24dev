import AbstractFieldEdit from 'components/modules/Crm/Abstract/AbstractFieldEdit.vue';
import DealUserField from "lib/entities/Crm/DealUserField";

export default {
    name: 'DealFieldEdit',

    render(h) {
        return h(AbstractFieldEdit, {
            props: {
                breadcrumb: ['CRM', 'Сделки', 'Поля'],
                getEndpoint: DealUserField.endpoint,
                updateEndpoint: DealUserField.updateEndpoint,
                reloadFieldsAction: 'dealFields/forceLoad',
                listRoute: 'crmDealFields',
            },
        });
    },
};