import { h } from "vue";
import AbstractFields from "@app/components/modules/Crm/Abstract/AbstractFields.vue";
import DealUserField from "@lib/entities/Crm/DealUserField";

export default {
    name: 'DealFields',

    render() {
        return h(AbstractFields, {
            load: () => this.$store.dispatch('dealFields/load'),
            breadcrumb: ['CRM', 'Сделки', 'Поля'],
            b24EditEntity: 'CRM_DEAL',
            rawFields: this.$store.state.dealFields.items,
            addFieldRoute: 'crmDealFieldAdd',
            editFieldRoute: 'crmDealFieldEdit',
            listEndpoint: DealUserField.listEndpoint,
            deleteEndpoint: DealUserField.deleteEndpoint,
            reloadFieldsAction: 'dealFields/reload',
        });
    },
};