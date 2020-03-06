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
import {mapState, mapMutations, mapActions} from 'vuex';
import {getFieldLabel} from 'lib/functions';
import Lead from 'lib/entities/Crm/Lead';
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
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STATUS_ID'],
            filter: {},
        };
    },

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
            this.items = (await Lead.load({
                order: {'ID': 'ASC'},
                filter: this.filter,
                _limit: 100
            })).getAll();
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