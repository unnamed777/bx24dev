import { h } from "vue";
import AbstractFields from "@app/components/modules/Crm/Abstract/AbstractFields.vue";
import ContactUserField from "@lib/entities/Crm/ContactUserField";

export default {
    name: 'ContactFields',

    render() {
        return h(AbstractFields, {
            load: () => this.$store.dispatch('contactFields/load'),
            breadcrumb: ['CRM', 'Контакты', 'Поля'],
            b24EditEntity: 'CRM_CONTACTS',
            rawFields: this.$store.state.contactFields.items,
            addFieldRoute: 'crmContactFieldAdd',
            editFieldRoute: 'crmContactFieldEdit',
            listEndpoint: ContactUserField.listEndpoint,
            deleteEndpoint: ContactUserField.deleteEndpoint,
            reloadFieldsAction: 'contactFields/reload',
        });
    },
};
