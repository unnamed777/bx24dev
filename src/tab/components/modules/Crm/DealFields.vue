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

    data() {
        return {aaa: 1};
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
