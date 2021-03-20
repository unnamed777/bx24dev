import AbstractEntity from 'lib/entities/AbstractEntity';

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