import { h } from "vue";
import AbstractFieldEdit from "@app/components/modules/Crm/Abstract/AbstractFieldEdit.vue";
import DealUserField from "@lib/entities/Crm/DealUserField";

export default {
    name: 'DealFieldEdit',

    render() {
        return h(AbstractFieldEdit, {
            breadcrumb: ['CRM', 'Сделки', 'Поля'],
            getEndpoint: DealUserField.endpoint,
            updateEndpoint: DealUserField.updateEndpoint,
            reloadFieldsAction: 'dealFields/forceLoad',
            listRoute: 'crmDealFields',
        });
    },
};