import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Lead extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.lead.fields';
    }

    static get listEndpoint() {
        return 'crm.lead.list';
    }
}