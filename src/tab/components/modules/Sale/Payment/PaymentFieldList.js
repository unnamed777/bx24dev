import AbstractEntityFieldList from 'components/modules/Sale/AbstractEntityFieldList.vue';

export default {
    name: 'PaymentFieldFields',

    render(h) {
        return h(AbstractEntityFieldList, {
            props: {
                breadcrumb: ['Интернет-магазин', 'Оплаты', 'Поля'],
                loadActionName: 'salePaymentFields/load',
                getter: ($store) => $store.state.salePaymentFields.items,
            },
        });
    },
};
