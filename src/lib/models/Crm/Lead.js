import AbstractEntity from 'lib/models/AbstractEntity';

export default class Lead extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.lead.fields';
    }

    static get listEndpoint() {
        return 'crm.lead.list';
    }
}