<template>
<div class="table-list-columns small mb-2">
    <h5>Колонки</h5>
    <div class="table-list-columns__list">
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

    emits: ['change'],

    data() {
        return {
            //selectedNow: [],
            currentlySelected: [],
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

<style lang="scss">
.table-list-columns {
    padding: 20px;
    width: 350px;

    .form-check {
        page-break-inside: avoid;
    }
}
</style>