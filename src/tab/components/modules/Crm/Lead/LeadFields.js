import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';

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
            },
        });
    },
};
