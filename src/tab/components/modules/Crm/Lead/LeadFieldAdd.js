import AbstractFieldAdd from 'components/modules/Crm/Abstract/AbstractFieldAdd.vue';

export default {
    name: 'LeadFieldAdd',

    render(h) {
        return h(AbstractFieldAdd, {
            props: {
                breadcrumb: ['CRM', 'Лиды', 'Поля', 'Добавить'],
                addEndpoint: 'crm.lead.userfield.add',
                reloadFieldsAction: 'leadFields/forceLoad',
                listRoute: 'crmLeadFields',
            },
        });
    },
};