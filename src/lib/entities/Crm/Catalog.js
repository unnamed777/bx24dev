import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Catalog extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.catalog.fields';
    }

    static get listEndpoint() {
        return 'crm.catalog.list';
    }

    static get endpoint() {
        return 'crm.catalog.get';
    }
}