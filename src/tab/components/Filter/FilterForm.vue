<template>
<form>
    <FilterItem
        v-for="(filterItem, index) of filter"
        v-model="filter[index]"
        v-bind:fields="fields"
        v-bind:key="index"
    />
    <div>{{ filter }}</div>
</form>
</template>

<script>
import FilterItem from './FilterItem.vue';

export default {
    components: {
        FilterItem
    },

    props: {
        fields: Object
    },

    data() {
        return {
            filter: [{code: null, value: null}],
        };
    },

    watch: {
        filter() {
            const lastItem = this.filter[this.filter.length - 1];

            if (lastItem.code !== null || (lastItem.value !== null && lastItem.value !== '')) {
                this.addNewItem();
            }
        }
    },

    async mounted() {
    },

    methods: {
        addNewItem() {
            this.filter.push({code: null, value: null});
        }
    }
};
</script>
