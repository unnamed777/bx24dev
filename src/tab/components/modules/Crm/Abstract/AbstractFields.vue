<template>
    <div>
        <div class="row mb-4">
            <div class="col-10">
            </div>
            <div class="col-2 d-flex justify-content-end">
                <div>
                    <button class="btn btn-light" @click="$router.push({ name: addFieldRoute })">Создать поле</button>
                </div>
            </div>
        </div>

        <TableList
            v-if="tableData.columns.length > 0"
            :columns="tableData.columns"
            :items="tableData.items"
            :rowActions="tableRowActions"
            :showActionsForRow="showActionsForRow"
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
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import TableList from 'components/TableList/BaseTableList.vue';
import FieldEnumTableList from 'components/FieldEnumTableList.vue';
import {prepareCrmEntityFields} from 'lib/functions';
import EntityProperty from "lib/entities/Entity/Property";

export default {
    components: {
        TableList,
        FieldEnumTableList,
    },

    props: {
        load: Function,
        breadcrumb: Array,
        b24EditEntity: String,
        rawFields: Object,
        addFieldRoute: String,
        editFieldRoute: String,
    },

    data() {
        return {
            tableRowActions: [
                {
                    label: 'Изменить',
                    onClick: this.onChangeClick,
                },
                {
                    label: 'Открыть в Б24',
                    onClick: this.onB24EditClick,
                },
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },
            ],
        };
    },

    computed: {
        tableData() {
            return prepareCrmEntityFields(this.rawFields);
        },

        ...mapState({
            appData: state => state.appData,
        }),
    },

    async mounted() {
        await this.load();
        this.setBreadcrumb(this.breadcrumb);
    },

    methods: {
        showActionsForRow({row, index}) {
            return row.code.substr(0, 3) === 'UF_';
        },

        onChangeClick({row, index}) {
            this.$router.push({
                name: this.editFieldRoute,
                params: {
                    code: row.CODE,
                },
            });
        },

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/crm/configs/fields/${this.b24EditEntity}/edit/${row.code}/`, '_blank');
        },

        async onDeleteClick({row, index}) {
            if (!confirm(`Удалить поле ${row.PROPERTY}?`)) {
                return;
            }

            /*await EntityProperty.delete({
                ENTITY: this.entity.ENTITY,
                PROPERTY: row.PROPERTY,
            });

            this.fillProperties();*/
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>