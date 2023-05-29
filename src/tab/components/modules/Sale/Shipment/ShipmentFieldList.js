import AbstractEntityFieldList from 'components/modules/Sale/AbstractEntityFieldList.vue';

export default {
    name: 'ShipmentFieldFields',

    render(h) {
        return h(AbstractEntityFieldList, {
            props: {
                breadcrumb: ['Интернет-магазин', 'Отгрузки', 'Поля'],
                loadActionName: 'saleShipmentFields/load',
                getter: ($store) => $store.state.saleShipmentFields.items,
            },
        });
    },
};
