<template>
<form v-on:submit.prevent>
    <FilterItem
        v-for="(filterItem, index) of filter"
        v-model="filter[index]"
        v-bind:fields="fields"
        v-bind:key="index"
        v-bind:users="users"
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
import User from 'lib/entities/User';

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
            users: [],
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
        console.log('mounted');
        let hasUserFieldType = false;
        console.log(this.fields);

        // Put loading of CrmStatuses and etc here...

        for (let field of Object.values(this.fields)) {
            if (field.type === 'user') {
                hasUserFieldType = true;
            }
        }

        if (hasUserFieldType) {
            // I need a store:-(
            this.users = (await User.load({select: ['ID', 'EMAIL', 'NAME', 'LAST_NAME']})).getAll();
        }
    },

    methods: {
        addNewItem() {
            this.filter.push({code: null});
        },

        send() {
            const resultFilter = {};

            for (let item of this.filter) {
                if (isNil(item.code) || item.code === '' || Array.isArray(item.values) === false || item.values.length === 0) {
                    continue;
                }

                for (let complexValue of item.values) {
                    if (!complexValue.value) {
                        continue;
                    }

                    let value = complexValue.value;

                    if (value === 'NULL') {
                        value = '';
                    }

                    let operator = '';

                    if (complexValue.operator && complexValue.operator !== '=') {
                        operator = complexValue.operator;
                    }

                    if (operator === '') {
                        let key = operator + item.code;

                        if (resultFilter.hasOwnProperty(key)) {
                            if (!Array.isArray(resultFilter[key])) {
                                resultFilter[key] = [resultFilter[key]];
                            }

                            resultFilter[key].push(value);
                        } else {
                            resultFilter[operator + item.code] = value;
                        }
                    } else {
                        resultFilter[operator + item.code] = value;
                    }
                }
            }

            console.log(resultFilter);

            this.$emit('submit', resultFilter);
        }
    }
};
</script>
