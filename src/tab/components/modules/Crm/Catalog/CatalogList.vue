<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'catalogFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'ORIGINATOR_ID', 'ORIGIN_ID', 'XML_ID']"
        :breadcrumb="['CRM', 'Каталоги']"
    />
</template>

<script>
import Catalog from 'lib/entities/Crm/Catalog';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Catalog.load({
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
            return $store.state.catalogFields.items;
        },
    }
};
</script>
