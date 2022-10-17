import AbstractEntity from 'lib/entities/AbstractEntity';

export default class ProductPropertyEnum extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'catalog.productPropertyEnum.getFields';
    }

    static get endpoint() {
        return 'catalog.productPropertyEnum.get';
    }

    static get listEndpoint() {
        return 'catalog.productPropertyEnum.list';
    }

    static get addEndpoint() {
        return 'catalog.productPropertyEnum.add';
    }

    static get updateEndpoint() {
        return 'catalog.productPropertyEnum.update';
    }

    static get deleteEndpoint() {
        return 'catalog.productPropertyEnum.delete';
    }

    static get domain() {
        return 'productPropertyEnum';
    }

    static get listDomain() {
        return 'productPropertyEnums';
    }
}
