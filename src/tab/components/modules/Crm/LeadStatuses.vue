<template>
<TableList v-bind:fields="fields" v-bind:items="items"/>
</template>

<script>
import BX24 from '../../../../lib/BX24';
import TableList from '../../TableList.vue';

export default {
    data() {
        return {
            fields: {},
            items: [],
        };
    },

    components: {
        TableList,
    },

    async mounted() {
        let result = await BX24.call('crm.status.list', {
            order: {'SORT': 'ASC'},
            filter: {
                'ENTITY_ID': 'DEAL_STAGE'
            }
        });

        console.log(result);

        this.$parent.$data.breadcrumb = ['CRM', 'Справочники', 'Стадии сделки'];

        this.fields = [
            {code: 'ID', label: 'ID'},
            {code: 'STATUS_ID', label: 'STATUS_ID'},
            {code: 'NAME', label: 'Название'},
            {code: 'SORT', label: 'Сортировка'},
        ];

        this.items = result;
    }
};
</script>