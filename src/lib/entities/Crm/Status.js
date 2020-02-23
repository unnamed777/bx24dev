import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Lead extends AbstractEntity {
    static get defaultOrder() {
        return {
            'ENTITY_ID': 'ASC',
            'SORT': 'ASC'
        };
    }

    static get fieldsEndpoint() {
        return 'crm.status.fields';
    }

    static get listEndpoint() {
        return 'crm.status.list';
    }

    static load(params = {}) {
        return super.load(params).then(collection => {
            collection.filterByEntityId = function (entityId) {
                return this.getAll().filter(item => item.ENTITY_ID === entityId);
            };

            return collection;
        });
    }
}