import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Company extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.company.fields';
    }

    static get listEndpoint() {
        return 'crm.company.list';
    }
}