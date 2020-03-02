<template>
<TableList :columns="columns" :items="items"/>
</template>

<script>
import {mapMutations} from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/TableList/TableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            columns: [
                {code: 'ID', label: 'ID'},
                {code: 'STATUS_ID', label: 'ID статуса'},
                {code: 'NAME', label: 'Название'},
                {code: 'SORT', label: 'Сортировка'},
            ],
            items: [],
        };
    },

    computed: {
        tableItems() {
            return this.items;
        },
    },

    mounted() {
        this.prepareData();
    },

    methods: {
        async prepareData() {
            this.items = await BX24.call('crm.status.list', {
                order: {'SORT': 'ASC'},
                filter: {
                    'ENTITY_ID': 'SOURCE'
                }
            });

            this.setBreadcrumb(['Crm', 'Справочники', 'Источники']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
