import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';

export default {
    name: 'ContactFields',

    render(h) {
        return h(AbstractFields, {
            props: {
                load: () => this.$store.dispatch('contactFields/load'),
                breadcrumb: ['CRM', 'Контакты', 'Поля'],
                b24EditEntity: 'CRM_CONTACTS',
                rawFields: this.$store.state.contactFields.items,
                addFieldRoute: 'crmContactFieldAdd',
            },
        });
    },
};
