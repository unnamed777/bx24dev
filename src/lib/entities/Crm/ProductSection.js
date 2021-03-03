import AbstractEntity from 'lib/entities/AbstractEntity';

export default class ProductSection extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.productsection.fields';
    }

    static get listEndpoint() {
        return 'crm.productsection.list';
    }

    static get endpoint() {
        return 'crm.productsection.get';
    }

    static get addEndpoint() {
        return 'crm.productsection.add';
    }

    static get updateEndpoint() {
        return 'crm.productsection.update';
    }

    static get deleteEndpoint() {
        return 'crm.productsection.delete';
    }
}