import AbstractEntity from 'lib/entities/AbstractEntity';

export default class Activity extends AbstractEntity {
    static get listEndpoint() {
        return 'crm.enum.ownertype';
    }
}