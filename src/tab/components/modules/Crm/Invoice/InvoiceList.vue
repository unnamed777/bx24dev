<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'invoiceFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'ORDER_TOPIC', 'DATE_PAY_BEFORE', 'PRICE', 'STATUS_ID']"
        :breadcrumb="['CRM', 'Счета', 'Список']"
    />
</template>

<script>
import Invoice from 'lib/entities/Crm/Invoice';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Invoice.load({
                order: sort,
                filter: filter,
            }, {
                page: page,
            }));

            return {
                entries: collection.getAll(),
                total: collection.total,
            };
        },

        fieldsGetter($store) {
            return $store.state.invoiceFields.items;
        },
    }
};
</script>
