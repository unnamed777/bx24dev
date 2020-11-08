import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';
import ContactUserField from "lib/entities/Crm/ContactUserField";

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
                listEndpoint: ContactUserField.listEndpoint,
                deleteEndpoint: ContactUserField.deleteEndpoint,
                reloadFieldsAction: 'contactFields/reload',
            },
        });
    },
};
