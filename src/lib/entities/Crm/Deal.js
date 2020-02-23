import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Deal extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.deal.fields';
    }

    static get listEndpoint() {
        return 'crm.deal.list';
    }
}