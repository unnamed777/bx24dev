import { h } from "vue";
import AbstractFieldAdd from "@app/components/modules/Crm/Abstract/AbstractFieldAdd.vue";

export default {
    name: 'CompanyFieldAdd',

    render() {
        return h(AbstractFieldAdd, {
            breadcrumb: ['CRM', 'Компании', 'Поля', 'Добавить'],
            addEndpoint: 'crm.company.userfield.add',
            reloadFieldsAction: 'companyFields/forceLoad',
            listRoute: 'crmCompanyFields',
        });
    },
};