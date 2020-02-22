<template>
<TableList v-if="tableData.columns.length > 0" :columns="tableData.columns" :items="tableData.items"/>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import TableList from 'components/TableList.vue';
import {prepareCrmEntityFields} from 'lib/functions';

export default {
    components: {
        TableList,
    },

    computed: {
        tableData() {
            return prepareCrmEntityFields(this.rawFields);
        },
        ...mapState('leadFields', {
            rawFields: state => state.items
        }),
    },

    async mounted() {
        await this.load();
        this.$parent.$data.breadcrumb = ['CRM', 'Лиды', 'Поля'];
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
        ...mapActions({
            load: 'leadFields/load',
        })
    }
};
</script>