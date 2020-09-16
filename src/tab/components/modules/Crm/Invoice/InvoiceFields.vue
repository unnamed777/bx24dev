<template>
<div>
    <div class="row mb-4">
        <div class="col-10">
        </div>
        <div class="col-2 d-flex justify-content-end">
            <div>
                <button class="btn btn-light" @click="$router.push({ name: 'crmInvoiceFieldAdd' })">Создать поле</button>
            </div>
        </div>
    </div>

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
</div>
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
            return prepareCrmEntityFields(this.rawFields);
        },
        ...mapState('invoiceFields', {
            rawFields: state => state.items
        }),
    },

    async mounted() {
        await this.load();
        this.$parent.$data.breadcrumb = ['CRM', 'Счета', 'Поля'];
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
        ...mapActions({
            load: 'invoiceFields/load',
        })
    }
};
</script>