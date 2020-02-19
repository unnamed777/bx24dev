import BX24 from 'lib/BX24';
import AbstractEntity from 'lib/models/AbstractEntity';
import {getFieldLabel} from 'lib/functions';

export default class Deal extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'crm.deal.fields';
    }

    static get listEndpoint() {
        return 'crm.deal.list';
    }
}