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
import Lead from 'lib/entities/Crm/Lead';
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
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STATUS_ID'],
            filter: {},
        };
    },

    mixins: [entriesPageNavMixin],

    computed: {
        availableColumns() {
            let result = Object.values(this.fields).map(item => ({
                code: item.field,
                label: getFieldLabel(item)
            }));
            console.log(result);
            return result;
        },

        columns() {
            let columns = [];

            for (let columnCode of this.visibleColumns) {
                columns.push(this.fields[columnCode]);
            }

            return columns;
        },

        ...mapState({
            fields: state => state.leadFields.items,
        }),
    },

    async mounted() {
        this.loadFields();
        this.setBreadcrumb(['CRM', 'Лиды', 'Список']);
    },

    methods: {
        async onSubmit() {
            this.currentPage = 1;
            this.loadEntries();
        },

        async loadEntries() {
            let collection = (await Lead.load({
                order: this.sort,
                filter: this.filter,
            }, {
                page: this.currentPage,
            }));

            this.items = collection.getAll();
            this.totalPages = Math.ceil(collection.total / Lead.PAGE_SIZE);
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
        },

        onFormChange({filter}) {
            this.filter = filter;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadFields: 'leadFields/load',
        }),
    }
};
</script>