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
        let result = await BX24.call('crm.status.entity.types');
        console.log(result);
        this.$parent.$data.breadcrumb = ['CRM', 'Справочники', 'Типы'];

        this.fields = [
            {code: 'ID', label: 'ID'},
            {code: 'NAME', label: 'Название'},
        ];

        this.items = result;
    }
};
</script>
