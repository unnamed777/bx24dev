import { h } from "vue";
import AbstractFields from "@app/components/modules/Crm/Abstract/AbstractFields.vue";
import CompanyUserField from "@lib/entities/Crm/CompanyUserField";

export default {
    name: 'CompanyFields',

    render() {
        return h(AbstractFields, {
            load: () => this.$store.dispatch('companyFields/load'),
            breadcrumb: ['CRM', 'Компании', 'Поля'],
            b24EditEntity: 'CRM_COMPANY',
            rawFields: this.$store.state.companyFields.items,
            addFieldRoute: 'crmCompanyFieldAdd',
            editFieldRoute: 'crmCompanyFieldEdit',
            listEndpoint: CompanyUserField.listEndpoint,
            deleteEndpoint: CompanyUserField.deleteEndpoint,
            reloadFieldsAction: 'companyFields/reload',
        });
    },
};
