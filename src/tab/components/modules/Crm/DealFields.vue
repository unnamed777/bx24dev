<template>
<TableList :columns="columns" :items="items"/>
</template>

<script>
import BX24 from '../../../../lib/BX24';
import TableList from '../../TableList.vue';
import Deal from 'lib/models/Crm/Deal';
import {prepareCrmEntityFields} from '../../../../lib/functions';

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
        let rawFields = await Deal.getFields();
        this.$parent.$data.breadcrumb = ['CRM', 'Сделка', 'Поля'];
        let data = prepareCrmEntityFields(rawFields);
        this.columns = data.columns;
        this.items = data.items;
    }
};
</script>