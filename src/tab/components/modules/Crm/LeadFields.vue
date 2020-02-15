<template>
<TableList v-bind:fields="fields" v-bind:items="items"/>
</template>

<script>
import BX24 from '../../../../lib/BX24';
import TableList from '../../TableList.vue';
import {prepareCrmEntityFields} from '../../../../lib/functions';

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
        let rawFields = await BX24.call('crm.lead.fields');
        this.$parent.$data.breadcrumb = ['CRM', 'Лиды', 'Поля'];
        let data = prepareCrmEntityFields(rawFields);
        this.fields = data.fields;
        this.items = data.items;
    }
};
</script>