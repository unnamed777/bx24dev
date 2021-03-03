import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Product extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.product.fields';
    }

    static get listEndpoint() {
        return 'crm.product.list';
    }

    static get endpoint() {
        return 'crm.product.get';
    }
}