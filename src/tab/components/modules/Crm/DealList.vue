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
import BX24 from 'lib/BX24';
import {prepareCrmEntityFields, getFieldLabel} from 'lib/functions';
import Deal from 'lib/models/Crm/Deal';
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
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STAGE_ID'],
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
        this.fields = await Deal.getFields();
        /*this.$parent.$data.breadcrumb = ['CRM', 'Сделки', 'Список'];
        let data = prepareCrmEntityFields(this.rawFields);

        const fields = {};

        for (let field of data.items) {
            fields[field.code] = field;
        }*/
        //this.fields = fields;
    },

    methods: {
        endpoint() {
            return 'crm.deal.list';
        },

        async onSubmit(filter) {
            console.log('Filter', filter);

            this.items = await BX24.fetch(this.endpoint(), {
                order: {'ID': 'ASC'},
                filter
            });
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
        }
    }
};
</script>