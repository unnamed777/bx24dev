import AbstractFieldAdd from 'components/modules/Crm/Abstract/AbstractFieldAdd.vue';

export default {
    name: 'DealFieldAdd',

    render(h) {
        return h(AbstractFieldAdd, {
            props: {
                breadcrumb: ['CRM', 'Сделки', 'Поля', 'Добавить'],
                addEndpoint: 'crm.deal.userfield.add',
                reloadFieldsAction: 'dealFields/forceLoad',
                listRoute: 'crmDealFields',
            },
        });
    },
};