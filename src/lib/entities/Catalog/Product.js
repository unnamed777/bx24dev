import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from 'lib/BX24';

export default class Product extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'catalog.product.getFieldsByFilter';
    }

    static get endpoint() {
        return 'catalog.product.get';
    }

    static get listEndpoint() {
        return 'catalog.product.list';
    }

    static get addEndpoint() {
        return 'catalog.product.add';
    }

    static get updateEndpoint() {
        return 'catalog.product.update';
    }

    static get deleteEndpoint() {
        return 'catalog.product.delete';
    }

    static get domain() {
        return 'product';
    }

    static get listDomain() {
        return 'products';
    }

    static get TYPE_PRODUCT() {
        return 1;
    }

    static get defaultSelect() {
        return ['id', 'iblockId'];
    }

    static async loadFields(filter) {
        if (!filter) {
            throw new Error('filter params is required');
        }

        if (!filter.iblockId) {
            throw new Error('iblockId is required');
        }

        if (!filter.productType) {
            throw new Error('productType is required');
        }

        let result = await BX24.fetch(this.fieldsEndpoint, { filter });

        return result[this.domain];
    }
}
