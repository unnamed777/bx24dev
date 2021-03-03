<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'productFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'PRICE', 'ACTIVE', 'TIMESTAMP_X']"
        :breadcrumb="['CRM', 'Товары', 'Список']"
    />
</template>

<script>
import Product from 'lib/entities/Crm/Product';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Product.load({
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
            return $store.state.productFields.items;
        },
    }
};
</script>
