import { h } from "vue";
import AbstractFieldEdit from "@app/components/modules/Crm/Abstract/AbstractFieldEdit.vue";
import ContactUserField from "@lib/entities/Crm/ContactUserField";

export default {
    name: 'ContactFieldEdit',

    render() {
        return h(AbstractFieldEdit, {
            breadcrumb: ['CRM', 'Контакты', 'Поля'],
            getEndpoint: ContactUserField.endpoint,
            updateEndpoint: ContactUserField.updateEndpoint,
            reloadFieldsAction: 'contactFields/forceLoad',
            listRoute: 'crmContactFields',
        });
    },
};