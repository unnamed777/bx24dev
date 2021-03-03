<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'productSectionFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'SECTION_ID', 'XML_ID']"
        :breadcrumb="['CRM', 'Разделы товаров', 'Список']"
    />
</template>

<script>
import ProductSection from 'lib/entities/Crm/ProductSection';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await ProductSection.load({
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
            return $store.state.productSectionFields.items;
        },
    }
};
</script>
