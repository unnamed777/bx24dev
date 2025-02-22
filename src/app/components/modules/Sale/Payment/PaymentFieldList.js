import { h } from "vue";
import AbstractEntityFieldList from "@app/components/modules/Sale/AbstractEntityFieldList.vue";

export default {
    name: 'PaymentFieldFields',

    render() {
        return h(AbstractEntityFieldList, {
            breadcrumb: ['Интернет-магазин', 'Оплаты', 'Поля'],
            loadActionName: 'salePaymentFields/load',
            getter: ($store) => $store.state.salePaymentFields.items,
        });
    },
};
