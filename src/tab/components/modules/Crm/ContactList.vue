<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'contactFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'LAST_NAME', 'EMAIL', 'PHONE']"
        :breadcrumb="['CRM', 'Контакты', 'Список']"
    />
</template>

<script>
import Contact from 'lib/entities/Crm/Contact';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Contact.load({
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
            return $store.state.contactFields.items;
        },
    }
};
</script>