import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Entity extends AbstractEntity {
    static get listEndpoint() {
        return 'entity.item.property.get';
    }

    static prepareParams(params) {
        if (!params.ENTITY) {
            throw new Error('ENTITY is required');
        }

        return params;
    }
}
