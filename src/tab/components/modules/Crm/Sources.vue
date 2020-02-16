<template>
<TableList :columns="columns" :items="items"/>
</template>

<script>
import BX24 from '../../../../lib/BX24';
import TableList from '../../TableList.vue';

export default {
    data() {
        return {
            columns: [],
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
                'ENTITY_ID': 'SOURCE'
            }
        });

        console.log(result);
        this.$parent.$data.breadcrumb = ['CRM', 'Справочники', 'Типы'];

        this.columns = [
            {code: 'ID', label: 'ID'},
            {code: 'NAME', label: 'Сущность'},
            {code: 'SORT', label: 'Сортировка'},
        ];

        this.items = result;
    }
};
</script>
