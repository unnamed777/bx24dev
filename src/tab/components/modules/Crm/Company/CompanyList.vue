<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'companyFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'TITLE']"
        :breadcrumb="['CRM', 'Компании', 'Список']"
    />
</template>

<script>
import Company from 'lib/entities/Crm/Company';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
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
