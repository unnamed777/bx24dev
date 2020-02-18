<template>
<form v-on:submit.prevent>
    <FilterItem
        v-for="(filterItem, index) of filter"
        v-model="filter[index]"
        v-bind:fields="fields"
        v-bind:key="index"
    />
    <div class="form-group row">
        <div class="col-12 d-flex justify-content-end">
            <button type="button" class="btn btn-primary" v-on:click="send">Показать</button>
        </div>
  </div>
    <div class="mb-4">{{ filter }}</div>
</form>
</template>

<script>
import FilterItem from './Item.vue';
import isNil from 'lodash/isnil';

export default {
    components: {
        FilterItem
    },

    props: {
        fields: Object
    },

    data() {
        return {
            filter: [{code: null}],
        };
    },

    watch: {
        filter() {
            const lastItem = this.filter[this.filter.length - 1];

            if (!isNil(lastItem.code) || (!isNil(lastItem.value) && lastItem.value !== '')) {
                this.addNewItem();
            }
        },

        fields() {
            console.log(this.fields);
        }
    },

    async mounted() {
    },

    methods: {
        addNewItem() {
            this.filter.push({code: null});
        },

        send() {
            const resultFilter = {};

            for (let item of this.filter) {
                if (isNil(item.code) || item.code === '' || isNil(item.value) || item.value === '') {
                    continue;
                }

                let operator = '';

                if (item.operator !== '=') {
                    operator = item.operator;
                }

                resultFilter[operator + item.code] = item.value;
            }

            this.$emit('submit', resultFilter);
        }
    }
};
</script>
