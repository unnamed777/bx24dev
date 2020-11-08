import AbstractUserField from 'lib/entities/Crm/AbstractUserField';

export default class LeadUserField extends AbstractUserField  {
    static get entity() {
        return 'lead';
    }
}