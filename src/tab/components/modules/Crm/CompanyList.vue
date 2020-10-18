<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'companyFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'TITLE']"
        :breadcrumb="['CRM', 'Компании', 'Список']"
    />
</template>

<script>
import Company from 'lib/entities/Crm/Company';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Company.load({
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
            return $store.state.companyFields.items;
        },
    }
};
</script>
