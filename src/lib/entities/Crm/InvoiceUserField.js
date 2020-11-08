import AbstractUserField from 'lib/entities/Crm/AbstractUserField';

export default class InvoiceUserField extends AbstractUserField  {
    static get entity() {
        return 'invoice';
    }
}