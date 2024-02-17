import AbstractEntityFieldList from 'components/modules/Sale/AbstractEntityFieldList.vue';

export default {
    name: 'OrderFieldFields',

    render(h) {
        return h(AbstractEntityFieldList, {
            props: {
                breadcrumb: ['Интернет-магазин', 'Заказы', 'Поля'],
                loadActionName: 'saleOrderFields/load',
                getter: ($store) => $store.state.saleOrderFields.items,
            },
        });
    },
};
