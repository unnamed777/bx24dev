import AbstractUserField from 'lib/entities/Crm/AbstractUserField';

export default class CompanyUserField extends AbstractUserField  {
    static get entity() {
        return 'company';
    }
}