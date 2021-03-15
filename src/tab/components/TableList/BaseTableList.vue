<template>
    <div class="mb-3">
        <table class="table table-sm table-hover">
            <thead>
                <tr>
                    <th v-if="rowActions" class="header-column"></th>
                    <th
                        v-for="column in columns" v-bind:title="column.code"
                        class="header-column"
                        :class="{ 'cursor-pointer': sortOnClick, }"
                        @click="changeSort(column.code)"
                    >
                        <slot name="header-column" :column="column">
                            {{ column.label }}
                            <div class="header-column-code text-muted">{{ column.code }}</div>
                        </slot>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in itemsSorted" :key="index">
                    <th v-if="rowActions" class="action-cell">
                        <div class="position-relative">
                            <span
                                v-if="showActionsForRow === undefined || showActionsForRow({row: item, index}) === true"
                                class="table-row-action-trigger"
                                data-toggle="dropdown"
                                @click="toggleRowMenu(index)"
                            >
                                <MenuIcon class="table-row-action-trigger__icon" />
                            </span>
                            <span v-else class="table-row-action-trigger table-row-action-trigger--disabled">
                                <MenuIcon class="table-row-action-trigger__icon" />
                            </span>

                            <div v-if="activeRowMenuIndex === index" class="dropdown-menu">
                                <button
                                    v-for="action of rowActions"
                                    class="dropdown-item"
                                    type="button"
                                    @click="action.onClick({ index: index, row: item })"
                                >
                                    {{ action.label }}
                                </button>
                            </div>
                        </div>
                    </th>
                    <td v-for="column in columns">
                        <slot
                            :name="column.code"
                            :item="item"
                            :column="column"
                        >
                            {{ item[column.code] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { MenuIcon, EditIcon, CloseIcon, SettingsIcon } from 'vue-bytesize-icons';
import ColumnsSlider from './ColumnsSlider';
import ModalSlider from 'components/ui/ModalSlider';

export default {
    components: {
        MenuIcon,
        EditIcon,
        CloseIcon,
        SettingsIcon,
        ColumnsSlider,
        ModalSlider,
    },

    props: {
        columns: {
            type: Array,
            required: true,

            validator(value) {
                return value.filter(item => !item).length === 0;
            }
        },

        items: Array,

        // Example: { label: 'Удалить', onClick: this.onDeleteClick },
        rowActions: Array,

        showActionsForRow: Function,

        sortOnClick: {
            type: Boolean,
            default: true,
        }
    },

    data() {
        return {
            sort: null,
            order: null,
            activeRowMenuIndex: null,
        };
    },

    computed: {
        itemsSorted() {
            if (!this.sort) {
                return this.items;
            }

            const column = this.columns.find((item) => item.code === this.sort);
            const items = [...this.items];

            return items.sort(column.type === 'double' || column.type === 'integer' ? this.sortDouble : this.sortString);
        },
    },

    methods: {
        toggleRowMenu(index) {
            this.activeRowMenuIndex = index;
        },

        changeSort(newSort) {
            if (this.sortOnClick === false) {
                return;
            }

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
    },
}
</script>

<style lang="scss" scoped="">
table {
    white-space: nowrap;
}

.cursor-pointer {
    cursor: pointer;
}

.action-cell {
    width: 40px;

    .dropdown-item {
        font-size: 14px;
    }
}

.table-row-action-trigger {
    display: flex;
    width: 24px;
    height: 24px;

    justify-content: space-around;
    align-items: center;

    cursor: pointer;

    &__icon {
        width: 16px;
    }

    &--disabled {
        opacity: 0.2;
        cursor: default;
    }
}

.header-column-code {
    margin-bottom: 2px;
    font-size: 60%;
    font-weight: normal;
    line-height: 1em;
}
</style>