import AbstractFieldEdit from 'components/modules/Crm/Abstract/AbstractFieldEdit.vue';
import CompanyUserField from "lib/entities/Crm/CompanyUserField";

export default {
    name: 'CompanyFieldEdit',

    render(h) {
        return h(AbstractFieldEdit, {
            props: {
                breadcrumb: ['CRM', 'Компании', 'Поля'],
                getEndpoint: CompanyUserField.endpoint,
                updateEndpoint: CompanyUserField.updateEndpoint,
                reloadFieldsAction: 'companyFields/forceLoad',
                listRoute: 'crmCompanyFields',
            },
        });
    },
};