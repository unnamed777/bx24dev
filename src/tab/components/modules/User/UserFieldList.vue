<template>
    <div>
        <div class="row mb-3 d-none">
            <div class="col-12 d-flex">
                <div>
                    <button class="btn btn-light">Создать поле</button>
                </div>
            </div>
        </div>

        <TableList
            v-if="tableData.columns.length > 0"
            :columns="tableData.columns"
            :items="tableData.items"
            :rowActions="tableRowActions"
        >
            <template v-slot:label="{ item, column }">
                {{ item.label }}

                <FieldEnumTableList
                    v-if="item.type === 'enumeration'"
                    :enums="rawFields[item.code].LIST"
                />
            </template>

            <template v-slot:b24Edit="{ item, column }">
                <template v-if="item.b24Edit">
                    <a :href="item.b24Edit" target="_blank">⬀</a>
                </template>
            </template>
        </TableList>

        <ModalSlider
            v-if="isItemCardOpened"
            :width="800"
            @close="onItemCardClose"
        >
            <div class="p-3">
                <h3>Запись детально</h3>
                <table class="table table-hover">
                    <tbody>
                        <tr v-for="[key, value] of Object.entries(cardItem)">
                            <td class="mr-2 align-top" style="width: 30%;">
                                <div style="line-height: 1em;">{{ key }}</div>
                            </td>
                            <td class="align-middle" style="line-height: 1em;">
                                <span v-if="value !== null">{{ value }}</span>
                                <span v-else class="text-muted">null</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ModalSlider>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import TableList from 'components/ui/TableList/BaseTableList.vue';
import FieldEnumTableList from 'components/FieldEnumTableList.vue';
import BX24 from "lib/BX24";
import ModalSlider from 'components/ui/ModalSlider';

export default {
    components: {
        TableList,
        FieldEnumTableList,
        ModalSlider,
    },

    props: {
    },

    data() {
        return {
            tableRowActions: [
                /*{
                    label: 'Изменить',
                    onClick: this.onChangeClick,
                },*/
                {
                    label: 'Посмотреть',
                    onClick: this.onShowDetailClick,
                },
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },
            ],
            userFields: {},
            isItemCardOpened: false,
            cardItem: null,
        };
    },

    computed: {
        tableData() {
            return this.prepareFields(this.userFields);
        },

        ...mapState({
            appData: state => state.appData,
        }),
    },

    async mounted() {
        await this.load();
        this.setBreadcrumb(['Пользователи', 'Поля']);
    },

    methods: {
        async load() {
            let result = await BX24.fetch('user.userfield.list', {
                filter: {
                    LANG: 'ru',
                }
            });
            const userFields = {};

            for (let field of result) {
                userFields[field.FIELD_NAME] = field;
            }

            this.userFields = userFields;
            this.rawFields = userFields;
        },

        onChangeClick({row, index}) {
            const userField = this.userFields[row.code];

            this.$root.goToRoute({
                name: this.editFieldRoute,
                params: {
                    fieldId: userField.ID,
                },
            });
        },

        async onDeleteClick({row, index}) {
            const userField = this.userFields[row.code];

            if (!confirm(`Удалить поле ${userField.FIELD_NAME}?`)) {
                return;
            }

            let result;

            try {
                result = await BX24.call('user.userfield.delete', {
                    id: userField.ID,
                });
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

            if (!result) {
                return;
            }

            await this.load();
        },

        prepareFields(fields) {
            const items = [];

            for (let key in fields) {
                let field = fields[key];

                items.push({
                    code: key,
                    label: field.EDIT_FORM_LABEL || field.LIST_COLUMN_LABEL,
                    type: field.USER_TYPE_ID,
                    sort: field.SORT,
                    multiple: field.MULTIPLE === 'Y' ? '●' : '',
                    required: field.MANDATORY === 'Y' ? '●' : '',
                });
            }

            return {
                columns: [
                    {code: 'code', label: 'Код'},
                    {code: 'label', label: 'Название'},
                    {code: 'sort', label: 'Сорт'},
                    {code: 'type', label: 'Тип'},
                    {code: 'multiple', label: 'Множ'},
                    {code: 'required', label: 'Обяз'},
                ],
                items
            };
        },

        onShowDetailClick({row, index}) {
            this.cardItem = this.userFields[row.code];
            this.isItemCardOpened = true;
        },

        onItemCardClose() {
            this.isItemCardOpened = false;
            this.cardItem = null;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
