<template>
<div>
    <div class="row mb-4">
        <div class="col-10">
        </div>
        <div class="col-2 d-flex justify-content-end">
            <div>
                <button class="btn btn-light" @click="$router.push({ name: 'crmLeadFieldAdd' })">Создать поле</button>
            </div>
        </div>
    </div>
    <TableList v-if="tableData.columns.length > 0" :columns="tableData.columns" :items="tableData.items"/>
</div>
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