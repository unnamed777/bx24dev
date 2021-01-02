import AbstractUserField from 'lib/entities/Crm/AbstractUserField';

export default class DealUserField extends AbstractUserField {
    static get entity() {
        return 'deal';
    }
}