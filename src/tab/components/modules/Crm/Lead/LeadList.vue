<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'leadFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'TITLE', 'OPPORTUNITY', 'STATUS_ID']"
        :rowActions="rowActions"
        :breadcrumb="['CRM', 'Лиды', 'Список']"
    />
</template>

<script>
import Lead from 'lib/entities/Crm/Lead';
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

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/crm/lead/details/${row.ID}/`, '_blank');
        },
    }
};
</script>