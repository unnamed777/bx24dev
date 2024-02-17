<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'salePaymentFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'orderId', 'dateBill', 'paid', 'sum']"
        :sortDefaultField="'id'"
        :breadcrumb="['Интернет-магазин', 'Оплаты', 'Список']"
    />
</template>

<script>
import Payment from 'lib/entities/Sale/Payment';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Payment.load({
                order: sort,
                select: ['*'],
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
            return $store.state.salePaymentFields.items;
        },
    }
};
</script>
