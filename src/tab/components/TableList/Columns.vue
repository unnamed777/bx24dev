<template>
<div class="d-flex flex-wrap small mb-2">
    <span class="mr-2"><a href="#" v-on:click.prevent="expanded = !expanded">Колонки</a><span v-if="expanded">:</span></span>
    <template v-if="expanded">
        <div v-for="column in items" class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" :id="'tableListColumn_' + column.code" :value="column.code" v-model="selectedOwn">
            <label class="form-check-label" :for="'tableListColumn_' + column.code">{{ column.label }}</label>
        </div>
    </template>
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