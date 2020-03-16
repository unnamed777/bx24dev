import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Activity extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.activity.fields';
    }

    static get listEndpoint() {
        return 'crm.activity.list';
    }
}