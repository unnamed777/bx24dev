import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';
import LeadUserField from 'lib/entities/Crm/LeadUserField';

export default {
    name: 'LeadFields',

    render(h) {
        return h(AbstractFields, {
            props: {
                load: () => this.$store.dispatch('leadFields/load'),
                breadcrumb: ['CRM', 'Лиды', 'Поля'],
                b24EditEntity: 'CRM_LEAD',
                rawFields: this.$store.state.leadFields.items,
                addFieldRoute: 'crmLeadFieldAdd',
                editFieldRoute: 'crmLeadFieldEdit',
                listEndpoint: LeadUserField.listEndpoint,
                deleteEndpoint: LeadUserField.deleteEndpoint,
                reloadFieldsAction: 'leadFields/reload',
            },
        });
    },
};
