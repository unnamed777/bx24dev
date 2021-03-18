import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from "lib/BX24";

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

    static get pageNavigation() {
        return {
            name: 'navigation',
            unit: 'page',
        };
    }
}