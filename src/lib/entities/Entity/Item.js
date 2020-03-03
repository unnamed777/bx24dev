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
            },
            ID: {
                type: 'integer',
                isRequired: true,
                isReadOnly: true,
                title: 'ID',
            },
            DATE_CREATE: {
                type: 'string',
                isReadOnly: true,
                title: 'Дата создания',
            },
            CREATED_BY: {
                type: 'integer',
                isReadOnly: true,
                title: 'Кем создан',
            },
            TIMESTAMP_X: {
                type: 'string',
                isReadOnly: true,
                title: 'Дата изменения',
            },
            MODIFIED: {
                type: 'integer',
                isReadOnly: true,
                title: 'Кем изменён',
            },
            NAME: {
                type: 'integer',
                isRequired: true,
                isReadOnly: true,
                title: 'Название',
            },
            ACTIVE: {
                type: 'boolean',
                title: 'Активен',
            },
            DATE_ACTIVE_FROM: {
                type: 'datetime',
                title: 'Активен с',
            },
            DATE_ACTIVE_TO: {
                type: 'datetime',
                title: 'Активен до',
            },
            SORT: {
                type: 'integer',
                title: 'Сортировка',
            },
            PREVIEW_PICTURE: {
                type: 'integer',
                title: 'Картинка анонса',
            },
            PREVIEW_TEXT: {
                type: 'string',
                title: 'Текст анонса',
            },
            DETAIL_PICTURE: {
                type: 'integer',
                title: 'Детальная картинка',
            },
            DETAIL_TEXT: {
                type: 'string',
                title: 'Детальный текст',
            },
            CODE: {
                type: 'string',
                title: 'Символьный код',
            },
            SECTION: {
                type: 'integer',
                title: 'Раздел',
            },
        };
    }

    static prepareParams(params) {
        if (!params.ENTITY) {
            throw new Error('ENTITY is required');
        }

        return params;
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

    static loadFields() {
        return this.fields;
    }

    /**
     *
     * @param {EntityItemFilterParams} params
     *
     * @typedef {Object} EntityItemFilterParams
     * @property {string} ENTITY
     * @property {Object} SORT
     * @property {Object} FILTER
     *
     * @returns {Promise<Collection>}
     */
    static load(params = {}) {
        return super.load(params);
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
}
