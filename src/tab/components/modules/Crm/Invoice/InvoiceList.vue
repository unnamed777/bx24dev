<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'invoiceFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'ORDER_TOPIC', 'DATE_PAY_BEFORE', 'PRICE', 'STATUS_ID']"
        :rowActions="rowActions"
        :breadcrumb="['CRM', 'Счета', 'Список']"
    />
</template>

<script>
import Invoice from 'lib/entities/Crm/Invoice';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapState } from 'vuex';

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
            let collection = (await Invoice.load({
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
            return $store.state.invoiceFields.items;
        },

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/crm/invoice/show/${row.ID}/`, '_blank');
        },
    }
};
</script>
