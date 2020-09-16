<template>
<div>
    <div class="row">
        <div class="col-10">
            <GetListForm
                :fields="fields"
                @change="onFormChange"
                @submit="onSubmit"
            />
        </div>
        <div class="col-2 d-flex justify-content-end">
            <div>
                <!-- buttons -->
            </div>
        </div>
    </div>

    <div v-if="items.length > 0">
        <TableColumns
            :items="fields"
            :selected="visibleColumns"
            @change="setVisibleColumns"
        />

        <PageNavigation
            v-if="totalPages > 1"
            :total="totalPages"
            :current="currentPage"
            @change="onPageChange"
        />

        <div style="max-width: 100%; overflow-x: scroll;">
            <FormattedTableList
                :columns="columns"
                :items="items"
            />
        </div>

        <PageNavigation
            v-if="totalPages > 1"
            :total="totalPages"
            :current="currentPage"
            @change="onPageChange"
        />
    </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { getFieldLabel } from 'lib/functions';
import Invoice from 'lib/entities/Crm/Invoice';
import GetListForm from 'components/ui/GetListForm.vue';
import FormattedTableList from 'components/TableList/FormattedTableList.vue';
import TableColumns from 'components/TableList/Columns.vue';
import entriesPageNavMixin from 'mixins/entriesPageNavMixin';

export default {
    components: {
        GetListForm,
        FormattedTableList,
        TableColumns,
    },

    data() {
        return {
            items: [],
            visibleColumns: ['ID', 'ORDER_TOPIC', 'DATE_PAY_BEFORE', 'PRICE', 'STATUS_ID'],
            filter: {},
            sort: {},
        };
    },

    mixins: [entriesPageNavMixin],

    computed: {
        availableColumns() {
            return Object.values(this.fields).map(item => ({
                code: item.field,
                label: getFieldLabel(item)
            }));
        },

        columns() {
            let columns = [];

            for (let columnCode of this.visibleColumns) {
                columns.push(this.fields[columnCode]);
            }

            return columns;
        },

        ...mapState({
            fields: state => state.invoiceFields.items,
        }),
    },

    async mounted() {
        this.loadFields();
        this.setBreadcrumb(['CRM', 'Счета', 'Список']);
    },

    methods: {
        async onSubmit() {
            this.currentPage = 1;
            this.loadEntries();
        },

        async loadEntries() {
            let collection = (await Invoice.load({
                order: this.sort,
                filter: this.filter,
            }, {
                page: this.currentPage,
            }));

            this.items = collection.getAll();
            this.totalPages = Math.ceil(collection.total / Invoice.PAGE_SIZE);
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
        },

        onFormChange({filter, sort}) {
            this.filter = filter;
            this.sort = sort;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadFields: 'invoiceFields/load',
        }),
    }
};
</script>