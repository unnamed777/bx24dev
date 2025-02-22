import { h } from "vue";
import AbstractEntityFieldList from "@app/components/modules/Sale/AbstractEntityFieldList.vue";

export default {
    name: 'OrderFieldFields',

    render() {
        return h(AbstractEntityFieldList, {
            breadcrumb: ['Интернет-магазин', 'Заказы', 'Поля'],
            loadActionName: 'saleOrderFields/load',
            getter: ($store) => $store.state.saleOrderFields.items,
        });
    },
};
