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
import {mapState, mapMutations, mapActions} from 'vuex';
import {getFieldLabel} from 'lib/functions';
import Lead from 'lib/entities/Crm/Lead';
import FilterForm from 'components/Filter/FilterForm.vue';
import TableList from 'components/TableList/TableList.vue';
import TableColumns from 'components/TableList/Columns.vue';

export default {
    components: {
        FilterForm,
        TableList,
        TableColumns,
    },

    data() {
        return {
            items: [],
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STATUS_ID'],
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