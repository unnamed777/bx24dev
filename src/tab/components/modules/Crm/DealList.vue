<template>
<div>
    <div class="row" v-if="fieldsLoaded">
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
import {mapState, mapActions, mapMutations} from 'vuex';
import {prepareCrmEntityFields, getFieldLabel} from 'lib/functions';
import Deal from 'lib/entities/Crm/Deal';
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
            fieldsLoaded: false,
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
        this.fieldsLoaded = true;
        this.$parent.$data.breadcrumb = ['CRM', 'Сделки', 'Список'];
    },

    methods: {
        endpoint() {
            return 'crm.deal.list';
        },

        async onSubmit(filter) {
            console.log('Filter', filter);

            this.items = (await Deal.load({
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