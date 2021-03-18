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

    static get domain() {
        return 'order';
    }

    static get listDomain() {
        return 'orders';
    }

    static get pageNavigation() {
        return {
            name: 'navigation',
            unit: 'page',
        };
    }
}