<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'leadFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'TITLE', 'OPPORTUNITY', 'STATUS_ID']"
        :breadcrumb="['CRM', 'Лиды', 'Список']"
    />
</template>

<script>
import Lead from 'lib/entities/Crm/Lead';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Lead.load({
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
            return $store.state.leadFields.items;
        },
    }
};
</script>