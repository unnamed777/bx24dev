<template>
<div>
    <GetListForm
        :fields="fields"
        @change="onFormChange"
        @submit="onSubmit"
    />

    <div v-if="items.length > 0">
        <TableColumns :items="fields" :selected="visibleColumns" v-on:change="setVisibleColumns" />
        <div style="max-width: 100%; overflow-x: scroll;">
            <TableList :columns="columns" :items="items" />
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { getFieldLabel } from 'lib/functions';
import Deal from 'lib/entities/Crm/Deal';
import GetListForm from 'components/ui/GetListForm.vue';
import TableList from 'components/TableList/TableList.vue';
import TableColumns from 'components/TableList/Columns.vue';

export default {
    components: {
        GetListForm,
        TableList,
        TableColumns,
    },

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
            fields: state => state.dealFields.items
        }),
    },

    async mounted() {
        this.loadFields();
        this.loadCrmStatuses();
        this.setBreadcrumb(['CRM', 'Сделки', 'Список']);
    },

    methods: {
        async onSubmit() {
            this.items = (await Deal.load({
                order: this.sort,
                filter: this.filter,
                _limit: 100
            })).getAll();
        },

        onFormChange({filter, sort}) {
            console.log('onFormChange', filter, sort);
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
            loadCrmStatuses: 'crmStatuses/load',
        })
    }
};
</script>