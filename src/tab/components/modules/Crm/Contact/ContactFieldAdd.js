import AbstractFieldAdd from 'components/modules/Crm/Abstract/AbstractFieldAdd.vue';

export default {
    name: 'ContactFieldAdd',

    render(h) {
        return h(AbstractFieldAdd, {
            props: {
                breadcrumb: ['CRM', 'Контакты', 'Поля', 'Добавить'],
                addEndpoint: 'crm.contacts.userfield.add',
                reloadFieldsAction: 'contactFields/forceLoad',
                listRoute: 'crmContactFields',
            },
        });
    },
};