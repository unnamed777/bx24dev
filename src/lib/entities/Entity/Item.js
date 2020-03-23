import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from 'lib/BX24';
import { getFieldLabel } from "lib/functions";

export default class Item extends AbstractEntity {
    static get listEndpoint() {
        return 'entity.item.get';
    }

    static get addEndpoint() {
        return 'entity.item.add';
    }

    static get updateEndpoint() {
        return 'entity.item.update';
    }

    static get deleteEndpoint() {
        return 'entity.item.delete';
    }

    static get fields() {
        return {
            ENTITY: {
                type: 'string',
                isRequired: true,
                isReadOnly: true,
                title: 'Хранилище',
                sort: -10,
            },
            ID: {
                type: 'integer',
                isRequired: true,
                isReadOnly: true,
                title: 'ID',
                sort: -9,
            },
            DATE_CREATE: {
                type: 'string',
                isReadOnly: true,
                title: 'Дата создания',
                sort: 400,
            },
            CREATED_BY: {
                type: 'integer',
                isReadOnly: true,
                title: 'Кем создан',
                sort: 405,
            },
            TIMESTAMP_X: {
                type: 'string',
                isReadOnly: true,
                title: 'Дата изменения',
                sort: 410,
            },
            MODIFIED: {
                type: 'integer',
                isReadOnly: true,
                title: 'Кем изменён',
                sort: 420,
            },
            NAME: {
                type: 'integer',
                isRequired: true,
                isReadOnly: false,
                title: 'Название',
                sort: -5,
            },
            ACTIVE: {
                type: 'boolean',
                title: 'Активен',
                isReadOnly: false,
                sort: 600,
            },
            DATE_ACTIVE_FROM: {
                type: 'datetime',
                title: 'Активен с',
                isReadOnly: false,
                sort: 630,
            },
            DATE_ACTIVE_TO: {
                type: 'datetime',
                title: 'Активен до',
                isReadOnly: false,
                sort: 631,
            },
            SORT: {
                type: 'integer',
                title: 'Сортировка',
                isReadOnly: false,
                sort: 700,
            },
            PREVIEW_PICTURE: {
                type: 'integer',
                title: 'Картинка анонса',
                isReadOnly: false,
                sort: 700,
            },
            PREVIEW_TEXT: {
                type: 'string',
                title: 'Текст анонса',
                isReadOnly: false,
                sort: 700,
            },
            DETAIL_PICTURE: {
                type: 'integer',
                title: 'Детальная картинка',
                isReadOnly: false,
                sort: 700,
            },
            DETAIL_TEXT: {
                type: 'string',
                title: 'Детальный текст',
                isReadOnly: false,
                sort: 700,
            },
            CODE: {
                type: 'string',
                title: 'Символьный код',
                isReadOnly: false,
                sort: 30,
            },
            SECTION: {
                type: 'integer',
                title: 'Раздел',
                isReadOnly: false,
                sort: 700,
            },
        };
    }

    static prepareListPayload(payload) {
        if (!payload.ENTITY) {
            throw new Error('ENTITY is required');
        }

        return payload;
    }

    /**
     * @param {string} entityId
     * @param {Object} data
     * @returns {Promise<*>}
     */
    static add(entityId, data) {
        if (entityId) {
            data = { ...data };
            data.ENTITY = entityId;
        }

        if (!data.ENTITY) {
            throw new Error('ENTITY is required');
        }

        if (!data.NAME) {
            throw new Error('NAME is required');
        }

        return BX24.call(this.addEndpoint, data);
    }

    static loadFields() {
        return this.fields;
    }

    /**
     *
     * @param {EntityItemFilterParams} payload
     * @param {Object} options
     *
     * @typedef {Object} EntityItemFilterParams
     * @property {string} ENTITY
     * @property {Object} SORT
     * @property {Object} FILTER
     *
     * @returns {Promise<Collection>}
     */
    static load(payload = {}, options = {}) {
        return super.load(payload, options);
    }

    /**
     * @param {string} entityId
     * @param {number} id
     * @returns {Promise<*>}
     */
    static delete(entityId, id) {
        if (!entityId) {
            throw new Error('entityId is required');
        }

        if (!id) {
            throw new Error('id is required');
        }

        return BX24.call(this.deleteEndpoint, {
            ENTITY: entityId,
            ID: id,
        });
    }

    /**
     * Returns item fields augmented with properties for
     * further using in forms and filters
     *
     * @param {string} entityId
     * @param {Object} properties
     * @returns {Promise<Object>}
     */
    static async getMergedFields(entityId, properties) {
        const fields = await this.getFields();
        const mapTypes = {
            'N': 'double',
            'S': 'string',
            'F': 'string',
        };

        properties.map((property) => {
            let title = property.NAME ? `${property.NAME}` : property.PROPERTY;
            let alias = `PROPERTY_${property.PROPERTY}`;

            fields[alias] = {
                code: alias,
                label: title,
                title: title,
                type: mapTypes[property.TYPE],
                sort: parseInt(property.SORT, 10),
                isProperty: true,
            };
        });

        return fields;
    }
}
