<template>
    <TableList
        v-if="tableData.columns.length > 0"
        :columns="tableData.columns"
        :items="tableData.items"
    >
        <template v-slot:label="{ item, column }">
            {{ item.label }}

            <FieldEnumTableList
                v-if="item.type === 'enumeration'"
                :enums="rawFields[item.code].items"
            />
        </template>

        <template v-slot:b24Edit="{ item, column }">
            <template v-if="item.b24Edit">
                <a :href="item.b24Edit" target="_blank">⬀</a>
            </template>
        </template>
    </TableList>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import TableList from 'components/TableList/BaseTableList.vue';
import FieldEnumTableList from 'components/FieldEnumTableList.vue';
import {prepareCrmEntityFields} from 'lib/functions';

export default {
    components: {
        TableList,
        FieldEnumTableList,
    },

    computed: {
        tableData() {
            let tableData = prepareCrmEntityFields(this.rawFields);

            tableData.columns.push({
                code: 'b24Edit',
                label: 'B Б24',
            });

            tableData.items.forEach(item => item.b24Edit = item.code.substr(0, 3) === 'UF_' ? `https://${this.appData.portal}/crm/configs/fields/CRM_DEAL/edit/${item.code}/` : null);

            return tableData;
        },

        ...mapState('dealFields', {
            rawFields: state => state.items
        }),
        ...mapState({
            appData: state => state.appData,
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
