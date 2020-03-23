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
import { mapState, mapActions, mapMutations } from 'vuex';
import { getFieldLabel } from 'lib/functions';
import Deal from 'lib/entities/Crm/Deal';
import GetListForm from 'components/ui/GetListForm.vue';
import FormattedTableList from 'components/TableList/FormattedTableList.vue';
import TableColumns from 'components/TableList/Columns.vue';
import PageNavigation from 'components/ui/PageNavigation.vue';
import entriesPageNavMixin from 'mixins/entriesPageNavMixin';

export default {
    components: {
        GetListForm,
        FormattedTableList,
        TableColumns,
        PageNavigation,
    },

    mixins: [entriesPageNavMixin],

    data() {
        return {
            items: [],
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STAGE_ID'],
            filter: {},
            sort: {},
        };
    },

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

        fieldsLoaded() {
            return Object.entries(this.fields).length > 0;
        },

        ...mapState({
            fields: state => state.dealFields.items,
            users: state => state.users.items,
        }),
    },

    async mounted() {
        await this.loadFields();
       this.setBreadcrumb(['CRM', 'Сделки', 'Список']);
    },

    methods: {
        async onSubmit() {
            this.currentPage = 1;
            this.loadEntries();
        },

        async loadEntries() {
            let collection = (await Deal.load({
                order: this.sort,
                filter: this.filter,
            }, {
                page: this.currentPage,
            }));

            this.items = collection.getAll();
            this.totalPages = Math.ceil(collection.total / Deal.PAGE_SIZE);
        },

        onFormChange({filter, sort}) {
            this.filter = filter;
            this.sort = sort;
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadFields: 'dealFields/load',
        })
    }
};
</script>