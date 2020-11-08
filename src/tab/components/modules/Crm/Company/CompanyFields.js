import AbstractFields from 'components/modules/Crm/Abstract/AbstractFields.vue';
import CompanyUserField from "lib/entities/Crm/CompanyUserField";

export default {
    name: 'CompanyFields',

    render(h) {
        return h(AbstractFields, {
            props: {
                load: () => this.$store.dispatch('companyFields/load'),
                breadcrumb: ['CRM', 'Компании', 'Поля'],
                b24EditEntity: 'CRM_COMPANY',
                rawFields: this.$store.state.companyFields.items,
                addFieldRoute: 'crmCompanyFieldAdd',
                listEndpoint: CompanyUserField.listEndpoint,
                deleteEndpoint: CompanyUserField.deleteEndpoint,
                reloadFieldsAction: 'companyFields/reload',
            },
        });
    },
};
