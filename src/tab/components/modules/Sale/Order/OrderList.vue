<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'saleOrderFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'lid', 'dateInsert', 'statusId', 'price']"
        :sortDefaultField="'id'"
        :breadcrumb="['Интернет-магазин', 'Заказы', 'Список']"
    />
</template>

<script>
import Order from 'lib/entities/Sale/Order';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Order.load({
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
            return $store.state.saleOrderFields.items;
        },
    }
};
</script>
