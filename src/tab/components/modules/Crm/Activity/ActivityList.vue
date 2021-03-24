<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'activityFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'PROVIDER_ID', 'OWNER_TYPE_ID', 'OWNER_ID', 'SUBJECT', 'AUTHOR_ID', 'RESPONSIBLE_ID']"
        :breadcrumb="['CRM', 'Дела', 'Список']"
    />
</template>

<script>
import Activity from 'lib/entities/Crm/Activity';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Activity.load({
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
            return $store.state.activityFields.items;
        },
    }
};
</script>
