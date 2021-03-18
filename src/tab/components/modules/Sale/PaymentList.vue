<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'salePaymentFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'orderId', 'dateBill', 'paid', 'sum']"
        :breadcrumb="['Интернет-магазин', 'Оплаты']"
    />
</template>

<script>
import Payment from 'lib/entities/Sale/Payment';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
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
