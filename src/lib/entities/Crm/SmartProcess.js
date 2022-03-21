import AbstractEntity from 'lib/entities/AbstractEntity';

export default class SmartProcess extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.type.fields';
    }

    static get listEndpoint() {
        return 'crm.type.list';
    }

    static get endpoint() {
        return 'crm.type.get';
    }

    static get domain() {
        return 'type';
    }

    static get listDomain() {
        return 'types';
    }

    static get defaultOrder() {
        return {'id': 'asc'};
    }

    static get defaultSelect() {
        return null;
    }
}