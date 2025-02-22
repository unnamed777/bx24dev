import { h } from "vue";
import AbstractFieldEdit from "@app/components/modules/Crm/Abstract/AbstractFieldEdit.vue";
import LeadUserField from "@lib/entities/Crm/LeadUserField";

export default {
    name: 'LeadFieldEdit',

    render() {
        return h(AbstractFieldEdit, {
            breadcrumb: ['CRM', 'Лиды', 'Поля'],
            getEndpoint: LeadUserField.endpoint,
            updateEndpoint: LeadUserField.updateEndpoint,
            reloadFieldsAction: 'leadFields/forceLoad',
            listRoute: 'crmLeadFields',
        });
    },
};