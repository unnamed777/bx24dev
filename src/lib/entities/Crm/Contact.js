import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Contact extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.contact.fields';
    }

    static get listEndpoint() {
        return 'crm.contact.list';
    }
}