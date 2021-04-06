<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'companyFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'TITLE']"
        :rowActions="rowActions"
        :breadcrumb="['CRM', 'Компании', 'Список']"
    />
</template>

<script>
import Company from 'lib/entities/Crm/Company';
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

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/crm/company/details/${row.ID}/`, '_blank');
        },
    }
};
</script>