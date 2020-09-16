import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Invoice extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.invoice.fields';
    }

    static get listEndpoint() {
        return 'crm.invoice.list';
    }
}