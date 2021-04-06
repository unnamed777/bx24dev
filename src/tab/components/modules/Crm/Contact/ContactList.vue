<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'contactFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'LAST_NAME', 'EMAIL', 'PHONE']"
        :rowActions="rowActions"
        :breadcrumb="['CRM', 'Контакты', 'Список']"
    />
</template>

<script>
import Contact from 'lib/entities/Crm/Contact';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapState } from "vuex";

export default {
    components: {
        AbstractEntryListPage,
    },

    data() {
        return {
            rowActions: [
                {
                    label: 'Открыть в Б24',
                    onClick: this.onB24EditClick,
                },
            ],
        };
    },

    computed: {
        ...mapState({
            appData: state => state.appData,
        }),
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

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/crm/contact/details/${row.ID}/`, '_blank');
        },
    }
};
</script>