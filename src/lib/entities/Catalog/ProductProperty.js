import AbstractEntity from 'lib/entities/AbstractEntity';

export default class ProductProperty extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'catalog.productProperty.getFields';
    }

    static get endpoint() {
        return 'catalog.productProperty.get';
    }

    static get listEndpoint() {
        return 'catalog.productProperty.list';
    }

    static get addEndpoint() {
        return 'catalog.productProperty.add';
    }

    static get updateEndpoint() {
        return 'catalog.productProperty.update';
    }

    static get deleteEndpoint() {
        return 'catalog.productProperty.delete';
    }

    static get domain() {
        return 'productProperty';
    }

    static get listDomain() {
        return 'productProperties';
    }

    /*static add(data) {
        // Check all required fields
        if (!data.iblockId) {
            throw new Error('iblockId is required');
        }

        return BX24.call(this.addEndpoint, data);
    }

    static update(data) {
        // Check all required fields
        if (!data.iblockId) {
            throw new Error('iblockId is required');
        }

        return BX24.call(this.updateEndpoint, data);
    }*/
}
