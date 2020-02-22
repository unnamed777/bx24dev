<template>
<div>
    <div class="row">
        <div class="col-5">
            <FilterForm :fields="fields" v-on:submit="onSubmit" />
        </div>
    </div>
    <div v-if="items.length > 0">
        <TableColumns :items="fields" :selected="visibleColumns" v-on:change="setVisibleColumns" />
        <div style="max-width: 100%; overflow-x: scroll;">
            <TableList :columns="columns" :items="items" />
        </div>
    </div>
</div>
</template>

<script>
import {getFieldLabel} from 'lib/functions';
import Lead from 'lib/entities/Crm/Lead';
import FilterForm from 'components/Filter/FilterForm.vue';
import TableList from 'components/TableList.vue';
import TableColumns from 'components/TableList/Columns.vue';

export default {
    components: {
        FilterForm,
        TableList,
        TableColumns,
    },

    data() {
        return {
            fields: {},
            items: [],
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STATUS_ID'],
            //columns: [],
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
        }
    },

    async mounted() {
        this.fields = await Lead.getFields();
        this.$parent.$data.breadcrumb = ['CRM', 'Лиды', 'Список'];
    },

    methods: {
        async onSubmit(filter) {
            console.log('Filter', filter);

            this.items = (await Lead.load({
                order: {'ID': 'ASC'},
                filter,
                _limit: 100
            })).getAll();
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
        }
    }
};
</script>