<template>
<TableList v-if="tableData.columns.length > 0" :columns="tableData.columns" :items="tableData.items"/>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import TableList from 'components/TableList/BaseTableList.vue';
import {prepareCrmEntityFields} from 'lib/functions';

export default {
    components: {
        TableList,
    },

    computed: {
        tableData() {
            return prepareCrmEntityFields(this.rawFields);
        },
        ...mapState('dealFields', {
            rawFields: state => state.items
        }),
    },

    async mounted() {
        await this.load();
        this.setBreadcrumb(['CRM', 'Сделка', 'Поля']);
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
        ...mapActions({
            load: 'dealFields/load',
        })
    }
};
</script>