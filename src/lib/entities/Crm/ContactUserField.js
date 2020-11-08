import AbstractUserField from 'lib/entities/Crm/AbstractUserField';

export default class ContactUserField extends AbstractUserField  {
    static get entity() {
        return 'contact';
    }
}