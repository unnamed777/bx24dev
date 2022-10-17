import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Catalog extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'catalog.catalog.getFields';
    }

    static get listEndpoint() {
        return 'catalog.catalog.list';
    }

    static get endpoint() {
        return 'catalog.catalog.get';
    }

    static get domain() {
        return 'catalog';
    }

    static get listDomain() {
        return 'catalogs';
    }

    /*static get pageNavigation() {
        return {
            name: 'navigation',
            unit: 'page',
        };
    }*/
}