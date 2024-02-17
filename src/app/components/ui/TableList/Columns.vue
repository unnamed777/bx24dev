<template>
<div class="table-list-columns small mb-2">
    <div class="mr-2"><a href="#" v-on:click.prevent="expanded = !expanded">Колонки</a><span v-if="expanded">:</span></div>
    <div class="table-list-columns__list" v-if="expanded">
        <div v-for="column in itemsSorted" class="form-check">
            <input class="form-check-input" type="checkbox" :id="'tableListColumn_' + column.code" :value="column.code" v-model="selectedOwn">
            <label class="form-check-label d-inline" :for="'tableListColumn_' + column.code">{{ column.label }} ({{ column.code }})</label>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        items: [Array, Object],
        selected: {
            type: Array,
            default: [],
        }
    },

    data() {
        return {
            //selectedNow: [],
            currentlySelected: [],
            expanded: false,
        }
    },

    computed: {
        itemsSorted() {
            return Object.values(this.items).sort((a, b) => a.sort - b.sort);
        },

        selectedOwn: {
            get() {
                this.currentlySelected = [...this.selected];
                return this.currentlySelected;
            },

            set(newValue) {
                this.$emit('change', newValue);
            }
        }
    },

    mounted() {
        this.currentlySelected = [...this.selected];
    }
};
</script>

<style lang="scss" scoped>
.table-list-columns {
    &__list {
        column-count: 5;
    }

    .form-check {
        page-break-inside: avoid;
    }
}
</style>