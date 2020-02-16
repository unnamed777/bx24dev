<template>
<TableList :columns="columns" v-bind:items="items"/>
</template>

<script>
import BX24 from '../../../../lib/BX24';
import TableList from '../../TableList.vue';
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
        let rawFields = await BX24.call('crm.lead.fields');
        this.$parent.$data.breadcrumb = ['CRM', 'Лиды', 'Поля'];
        let data = prepareCrmEntityFields(rawFields);
        this.columns = data.columns;
        this.items = data.items;
    }
};
</script>