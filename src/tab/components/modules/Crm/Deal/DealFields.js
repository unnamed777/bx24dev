import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';

export default {
    name: 'DealFields',

    render(h) {
        return h(AbstractFields, {
            props: {
                load: () => this.$store.dispatch('dealFields/load'),
                breadcrumb: ['CRM', 'Сделки', 'Поля'],
                b24EditEntity: 'CRM_DEAL',
                rawFields: this.$store.state.dealFields.items,
                addFieldRoute: 'crmDealFieldAdd',
            },
        });
    },
};