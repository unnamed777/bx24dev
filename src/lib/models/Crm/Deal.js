import BX24 from "lib/BX24";

export default class Deal {
    static get fieldsEndpoint() {
        return 'crm.deal.fields';
    }

    static get listEndpoint() {
        return 'crm.deal.list';
    }

    static async getFields() {
        if (this.rawFields) {
            return this.rawFields;
        }

        this.rawFields = await BX24.fetch(this.fieldsEndpoint);

        for (let fieldCode of Object.keys(this.rawFields)) {
            this.rawFields[fieldCode].field = fieldCode;
        }

        return this.rawFields;
    }
}