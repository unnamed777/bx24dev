import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Payment extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'sale.payment.getFields';
    }

    static get listEndpoint() {
        return 'sale.payment.list';
    }

    static get endpoint() {
        return 'sale.payment.get';
    }

    static get domain() {
        return 'payment';
    }

    static get listDomain() {
        return 'payments';
    }

    static get defaultOrder() {
        return {'id': 'asc'};
    }

    static get pageNavigation() {
        return {
            name: 'navigation',
            unit: 'page',
        };
    }
}