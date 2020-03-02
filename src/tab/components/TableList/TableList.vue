<template>
    <div class="mb-3">
        <table class="table table-sm table-hover">
            <thead>
                <tr>
                    <th v-if="rowActions" class="action-cell"></th>
                    <th v-for="field in columns" v-bind:title="field.code" @click="sort = field.code">{{ field.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemsSorted">
                    <th v-if="rowActions" class="action-cell">
                        <div class="position-relative">
                            <span class="table-row-action-trigger" data-toggle="dropdown" @click="toggleRowMenu(index)"><MenuIcon class="table-row-action-trigger__icon" /></span>
                            <div v-if="activeRowMenuIndex === index" class="dropdown-menu">
                                <button v-for="action of rowActions" class="dropdown-item" type="button" @click="action.onClick(item)">{{ action.label }}</button>
                            </div>
                        </div>
                    </th>
                    <td v-for="field in columns">{{ item[field.code] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { MenuIcon, EditIcon, CloseIcon } from 'vue-bytesize-icons';

export default {
    components: {
        MenuIcon,
        EditIcon,
        CloseIcon,
    },

    props: {
        columns: {
            type: Array,

            validator(value) {
                return value.filter(item => !item).length === 0;
            }
        },

        items: Array,

        // Example: { label: 'Удалить', onClick: this.onDeleteClick },
        rowActions: Array,
    },

    data() {
        return {
            sort: null,
            activeRowMenuIndex: null,
        };
    },

    computed: {
        itemsSorted() {
            if (!this.sort) {
                return this.items;
            }

            const items = [...this.items];

            return items.sort((a, b) => {
                return a[this.sort] < b[this.sort] ? -1 : 1;
            });
        }
    },

    methods: {
        toggleRowMenu(index) {
            this.activeRowMenuIndex = index;
        }
    },
}
</script>

<style lang="scss" scoped="">
table thead th {
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
}
</style>