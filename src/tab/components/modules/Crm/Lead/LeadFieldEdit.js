import AbstractFieldEdit from 'components/modules/Crm/Abstract/AbstractFieldEdit.vue';
import LeadUserField from "lib/entities/Crm/LeadUserField";

export default {
    name: 'LeadFieldEdit',

    render(h) {
        return h(AbstractFieldEdit, {
            props: {
                breadcrumb: ['CRM', 'Лиды', 'Поля'],
                getEndpoint: LeadUserField.endpoint,
                updateEndpoint: LeadUserField.updateEndpoint,
                reloadFieldsAction: 'leadFields/forceLoad',
                listRoute: 'crmLeadFields',
            },
        });
    },
};