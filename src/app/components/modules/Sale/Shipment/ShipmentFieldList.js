import { h } from "vue";
import AbstractEntityFieldList from "@app/components/modules/Sale/AbstractEntityFieldList.vue";

export default {
    name: 'ShipmentFieldFields',

    render() {
        return h(AbstractEntityFieldList, {
            breadcrumb: ['Интернет-магазин', 'Отгрузки', 'Поля'],
            loadActionName: 'saleShipmentFields/load',
            getter: ($store) => $store.state.saleShipmentFields.items,
        });
    },
};
