import AbstractFieldEdit from 'components/modules/Crm/Abstract/AbstractFieldEdit.vue';
import ContactUserField from "lib/entities/Crm/ContactUserField";

export default {
    name: 'ContactFieldEdit',

    render(h) {
        return h(AbstractFieldEdit, {
            props: {
                breadcrumb: ['CRM', 'Контакты', 'Поля'],
                getEndpoint: ContactUserField.endpoint,
                updateEndpoint: ContactUserField.updateEndpoint,
                reloadFieldsAction: 'contactFields/forceLoad',
                listRoute: 'crmContactFields',
            },
        });
    },
};