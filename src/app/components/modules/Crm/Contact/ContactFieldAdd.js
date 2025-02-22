import { h } from "vue";
import AbstractFieldAdd from "@app/components/modules/Crm/Abstract/AbstractFieldAdd.vue";

export default {
    name: 'ContactFieldAdd',

    render() {
        return h(AbstractFieldAdd, {
            breadcrumb: ['CRM', 'Контакты', 'Поля', 'Добавить'],
            addEndpoint: 'crm.contacts.userfield.add',
            reloadFieldsAction: 'contactFields/forceLoad',
            listRoute: 'crmContactFields',
        });
    },
};