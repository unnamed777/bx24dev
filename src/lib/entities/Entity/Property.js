import AbstractEntity from 'lib/entities/AbstractEntity';
import { getFieldLabel } from "lib/functions";
import BX24 from "lib/BX24";

export default class Property extends AbstractEntity {
    static get listEndpoint() {
        return 'entity.item.property.get';
    }

    static get addEndpoint() {
        return 'entity.item.property.add';
    }

    static get updateEndpoint() {
        return 'entity.item.property.update';
    }

    static get deleteEndpoint() {
        return 'entity.item.property.delete';
    }

    static get fields() {
        return {
            ENTITY: {
                type: 'string',
                isRequired: true,
                title: 'Хранилище',
            },
            PROPERTY: {
                type: 'string',
                isRequired: true,
                title: 'Код',
            },
            NAME: {
                type: 'string',
                isRequired: true,
                title: 'Название',
            },
            TYPE: {
                type: 'enumeration',
                isRequired: true,
                title: 'Тип',
                items: [
                    { ID: 'S', VALUE: 'Строка' },
                    { ID: 'N', VALUE: 'Число' },
                    { ID: 'F', VALUE: 'Файл' },
                ],
            },
            SORT: {
                type: 'integer',
                isRequired: true,
                title: 'Сортировка',
            },
        };
    }

    static prepareParams(params) {
        if (!params.ENTITY) {
            throw new Error('ENTITY is required');
        }

        return params;
    }

    static loadFields() {
        return this.fields;
    }

    static add(data) {
        // Check all required fields
        if (!data.ENTITY) {
            throw new Error('ENTITY is required');
        }

        return BX24.call(this.addEndpoint, data);
    }

    /**
     * @param {EntityPropertyDeleteParams} params
     *
     * @typedef {Object} EntityPropertyDeleteParams
     * @property {string} ENTITY Required
     * @property {Object} PROPERTY Required
     *
     * @returns {Promise<void>}
     */
    static delete(params) {
        if (!params.ENTITY) {
            throw new Error('ENTITY is required');
        }

        if (!params.PROPERTY) {
            throw new Error('PROPERTY is required');
        }

        return BX24.call(this.deleteEndpoint, params);
    }
}
