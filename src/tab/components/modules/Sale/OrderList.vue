<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'orderFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'lid', 'dateInsert', 'statusId', 'price']"
        :breadcrumb="['Интернет-магазин', 'Заказы']"
    />
</template>

<script>
import Order from 'lib/entities/Sale/Order';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Order.load({
                order: sort,
                select: ['*'],
                filter: filter,
            }, {
                page: page,
                getter(result) {
                    console.log(result.result.orders);
                    return result.result.orders;
                }
            }));

            return {
                entries: collection.getAll(),
                total: collection.total,
            };
        },

        fieldsGetter($store) {
            return $store.state.orderFields.items;
        },
    }
};
</script>
