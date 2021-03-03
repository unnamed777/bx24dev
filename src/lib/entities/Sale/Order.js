import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from "lib/BX24";

export default class Order extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'sale.order.getFields';
    }

    static get listEndpoint() {
        return 'sale.order.list';
    }

    static get endpoint() {
        return 'sale.order.get';
    }

    static async loadFields() {
        return (await BX24.fetch(this.fieldsEndpoint)).order;
    }
}