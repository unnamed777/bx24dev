<template>
<TableList :columns="columns" :items="items"/>
</template>

<script>
import {mapMutations} from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            columns: [
                {code: 'ID', label: 'ID'},
                {code: 'NAME', label: 'Название'},
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
            this.items = await BX24.call('crm.persontype.list', {
                order: {'ID': 'ASC'},
            });

            this.setBreadcrumb(['Crm', 'Счета', 'Типы плательщиков']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
