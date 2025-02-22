<template>
    <div class="mb-3">
        <FormattedTableList
            :columns="columns"
            :items="items"
            :rowActions="rowActionsLocal"
        >
            <template v-slot:header-column="slotProps">
                <div class="header-column__container">
                    <div class="header-column__content">
                        {{ slotProps.column.label }}
                        <div class="header-column-code text-muted">{{ slotProps.column.code }}</div>
                    </div>
                    <div v-if="slotProps.column.code === lastColumnCode" class="header-column__right">
                        <SettingsIcon class="header-column__table-settings" title="Настройки" @click.stop="showSettings" />
                    </div>
                </div>
            </template>
        </FormattedTableList>

        <ModalSlider v-if="isSettingsOpened" :width="350" @close="onSettingsClose">
            <ColumnsSlider
                :items="availableColumns"
                :selected="currentVisibleColumns"
                @change="setVisibleColumns"
            />
        </ModalSlider>

        <ModalSlider
            v-if="isItemCardOpened"
            :width="800"
            @close="onItemCardClose"
        >
            <div class="p-3">
                <h3>Запись детально</h3>
                <table class="table table-sm table-hover">
                    <tbody>
                        <tr v-for="field of Object.keys(cardItem)">
                            <td class="mr-2 align-top" style="width: 30%;">
                                <div style="line-height: 1em;">{{ fieldsByCode[field]?.label || field }}</div>
                                <div class="text-muted" style="font-size: 60%">{{ fieldsByCode[field]?.code || null }}</div>
                            </td>
                            <td class="align-middle" style="line-height: 1em; word-break: break-all;">
                                <span v-if="cardItem[field]">{{ cardItem[field] }}</span>
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
import FormattedTableList from 'components/ui/TableList/FormattedTableList';
import ColumnsSlider from './ColumnsSlider';
import ModalSlider from 'components/ui/ModalSlider';
import { SettingsIcon } from '@zhuowenli/vue-feather-icons';

export default {
    components: {
        FormattedTableList,
        SettingsIcon,
        ColumnsSlider,
        ModalSlider,
    },

    props: {
        availableColumns: {
            type: Array,
            required: true,

            validator(value) {
                return value.filter(item => !item).length === 0;
            }
        },

        visibleColumns: {
            type: Array,
            required: true,
        },

        items: Array,

        // Example: { label: 'Удалить', onClick: this.onDeleteClick },
        rowActions: Array,

        hasSettings: {
            type: Boolean,
            default: false,
        }
    },

    data() {
        return {
            sort: null,
            order: null,
            activeRowMenuIndex: null,
            isSettingsOpened: false,
            currentVisibleColumns: [],
            isItemCardOpened: false,
            cardItem: null,
        };
    },

    computed: {
        availableColumnsMap() {
            const map = {};

            for (let [index, column] of Object.entries(this.availableColumns)) {
                map[column.code] = index;
            }

            return map;
        },

        columns() {
            let columns = [];

            for (let columnCode of this.currentVisibleColumns) {
                columns.push(this.availableColumns[this.availableColumnsMap[columnCode]]);
            }

            return columns;
        },

        itemsSorted() {
            if (!this.sort) {
                return this.items;
            }

            const column = this.columns.find((item) => item.code === this.sort);
            const items = [...this.items];

            return items.sort(column.type === 'double' || column.type === 'integer' ? this.sortDouble : this.sortString);
        },

        lastColumnCode() {
            return this.columns[this.columns.length - 1].code;
        },

        rowActionsLocal() {
            const result = [];

            for (let action of this.rowActions) {
                if (action.code === 'showCard' && action.onClick === undefined) {
                    result.push({
                        code: 'showCard',
                        label: action.label || 'Посмотреть',
                        onClick: this.onShowItemClick,
                    });
                } else {
                    result.push(action);
                }
            }

            return result;
        },

        fieldsByCode() {
            const result = {};

            for (let column of this.availableColumns) {
                result[column.code] = {
                    code: column.code,
                    label: column.label || column.code,
                };
            }

            return result;
        }
    },

    watch: {
        visibleColumns() {
            this.currentVisibleColumns = [...this.visibleColumns];
        }
    },

    mounted() {
        this.currentVisibleColumns = [...this.visibleColumns];
    },

    methods: {
        toggleRowMenu(index) {
            this.activeRowMenuIndex = index;
        },

        changeSort(newSort) {
            if (this.sort === newSort) {
                this.order = this.order === 1 ? -1 : 1;
            } else {
                this.sort = newSort;
                this.order = 1;
            }
        },

        sortString(a, b) {
            return (a[this.sort] < b[this.sort] ? -1 : 1) * this.order;
        },

        sortDouble(a, b) {
            const valueA = parseFloat(a[this.sort]);
            const valueB = parseFloat(b[this.sort]);

            return (valueA - valueB) * this.order;
        },

        showSettings() {
            this.isSettingsOpened = true;
        },

        onSettingsClose() {
            this.isSettingsOpened = false;
        },

        setVisibleColumns(columns) {
            this.currentVisibleColumns = columns;
        },

        onShowItemClick({row, index}) {
            this.cardItem = this.items[index];
            this.isItemCardOpened = true;
        },

        onItemCardClose() {
            this.isItemCardOpened = false;
        },
    },
}
</script>

<style lang="scss">
.header-column {
    &__container {
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;
        justify-content: space-between;
    }

    &__right {
        margin-left: auto;
        padding-left: 10px;
        cursor: default;
    }

    &__table-settings {
        width: 32px;
        height: 32px;
        padding: 8px;
        margin-top: 2px;

        cursor: pointer;
        opacity: 0.7;
        transition: all ease 0.1s;

        &:hover {
            opacity: 1;
        }
    }
}
</style>
