import AbstractEntity from 'lib/entities/AbstractEntity';

export default class AbstractUserField extends AbstractEntity {
    static get endpoint() {
        return `crm.${this.entity}.userfield.get`;
    }

    static get listEndpoint() {
        return `crm.${this.entity}.userfield.list`;
    }

    static get addEndpoint() {
        return `crm.${this.entity}.userfield.add`;
    }

    static get updateEndpoint() {
        return `crm.${this.entity}.userfield.update`;
    }

    static get deleteEndpoint() {
        return `crm.${this.entity}.userfield.delete`;
    }
}