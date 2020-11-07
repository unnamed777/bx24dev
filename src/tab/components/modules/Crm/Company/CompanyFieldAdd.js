import AbstractFieldAdd from 'components/modules/Crm/Abstract/AbstractFieldAdd.vue';

export default {
    name: 'CompanyFieldAdd',

    render(h) {
        return h(AbstractFieldAdd, {
            props: {
                breadcrumb: ['CRM', 'Компании', 'Поля', 'Добавить'],
                addEndpoint: 'crm.company.userfield.add',
                reloadFieldsAction: 'companyFields/forceLoad',
                listRoute: 'crmCompanyFields',
            },
        });
    },
};