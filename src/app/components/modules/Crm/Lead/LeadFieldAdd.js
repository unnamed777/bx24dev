import { h } from "vue";
import AbstractFieldAdd from "@app/components/modules/Crm/Abstract/AbstractFieldAdd.vue";

export default {
    name: 'LeadFieldAdd',

    render() {
        return h(AbstractFieldAdd, {
            breadcrumb: ['CRM', 'Лиды', 'Поля', 'Добавить'],
            addEndpoint: 'crm.lead.userfield.add',
            reloadFieldsAction: 'leadFields/reload',
            listRoute: 'crmLeadFields',
        });
    },
};