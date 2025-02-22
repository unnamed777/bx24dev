import { h } from "vue";
import AbstractFieldEdit from "@app/components/modules/Crm/Abstract/AbstractFieldEdit.vue";
import CompanyUserField from "@lib/entities/Crm/CompanyUserField";

export default {
    name: 'CompanyFieldEdit',

    render() {
        return h(AbstractFieldEdit, {
            breadcrumb: ['CRM', 'Компании', 'Поля'],
            getEndpoint: CompanyUserField.endpoint,
            updateEndpoint: CompanyUserField.updateEndpoint,
            reloadFieldsAction: 'companyFields/forceLoad',
            listRoute: 'crmCompanyFields',
        });
    },
};