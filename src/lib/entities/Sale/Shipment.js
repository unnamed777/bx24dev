import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Shipment extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'sale.shipment.getFields';
    }

    static get listEndpoint() {
        return 'sale.shipment.list';
    }

    static get endpoint() {
        return 'sale.shipment.get';
    }

    static get domain() {
        return 'shipment';
    }

    static get listDomain() {
        return 'shipments';
    }

    static get pageNavigation() {
        return {
            name: 'navigation',
            unit: 'page',
        };
    }
}