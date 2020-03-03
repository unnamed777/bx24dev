import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from 'lib/BX24';

export default class Entity extends AbstractEntity {
    static get listEndpoint() {
        return 'entity.get';
    }

    static get rightsEndpoint() {
        return 'entity.rights';
    }

    static get addEndpoint() {
        return 'entity.add';
    }

    static get rightLabels() {
        return {
            'R': 'Чтение',
            'W': 'Запись',
            'X': 'Управление',
        };
    }

    static prepareParams(params) {
        return params;
    }

    /**
     * @param entityId
     */
    static loadRights(entityId) {
        return BX24.fetch(this.rightsEndpoint, {ENTITY: entityId});
    }

    /**
     * @param {string} entityId
     * @param {Object} rights
     */
    static setRights(entityId, rights) {
        return BX24.call(this.rightsEndpoint, {ENTITY: entityId, ACCESS: rights});
    }

    static add(data) {
        if (!data.ENTITY) {
            throw new Error('ENTITY is required');
        }

        if (!data.NAME) {
            throw new Error('NAME is required');
        }

        return BX24.call(this.addEndpoint, data);
    }
}
