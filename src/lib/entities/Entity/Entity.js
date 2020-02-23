import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from 'lib/BX24';

export default class Entity extends AbstractEntity {
    static get listEndpoint() {
        return 'entity.get';
    }

    static get rightsEndpoint() {
        return 'entity.rights';
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
}
