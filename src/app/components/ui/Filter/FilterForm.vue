<template>
    <form v-on:submit.prevent>
        <FilterItem
            v-for="(filterItem, index) of filter"
            v-model="filter[index]"
            :fields="fields"
            :key="index"
        />
    </form>
</template>

<script>
import FilterItem from "./Item.vue";
import isNil from "lodash-es/isNil";
import preloadFieldTypeValuesMixin from "mixins/preloadFieldTypeValuesMixin";

export default {
    components: {
        FilterItem
    },

    mixins: [preloadFieldTypeValuesMixin],

    props: {
        fields: Object
    },

    emits: ['change', 'submit'],

    data() {
        return {
            filter: [{code: null}],
            users: [],
        };
    },

    watch: {
        filter: {
            handler() {
                const lastItem = this.filter[this.filter.length - 1];

                if (!isNil(lastItem.code) || (!isNil(lastItem.value) && lastItem.value !== '')) {
                    this.addNewItem();
                }

                const resultFilter = this.buildFilter();

                this.$emit('change', {
                    filter: resultFilter,
                    preview: this.compileFilterPreview(resultFilter),
                });
            },
            deep: true,
        },

        fields() {
            this.preloadFieldTypeValues(this.fields);
        }
    },

    mounted() {
        this.preloadFieldTypeValues(this.fields);
    },

    methods: {
        addNewItem() {
            this.filter.push({code: null});
        },

        buildFilter() {
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

            return resultFilter;
        },

        // @todo Method seems to be unused, event `submit` as well
        send() {
            const resultFilter = this.buildFilter();
            this.$emit('submit', resultFilter);
        },

        // Dumb beautifier
        compileFilterPreview(filter) {
            let result = '';

            for (let [key, value] of Object.entries(filter)) {
                let strValue;
                let useFallback;

                if (Array.isArray(value)) {
                    // Has simple values only
                    if (value.filter(childItem => typeof childItem === 'object').length === 0) {
                        strValue = '[' + value.map(item => JSON.stringify(item)).join(', ') + ']';
                    } else {
                        useFallback = true;
                        break;
                    }
                } else {
                    strValue = JSON.stringify(value);
                }

                strValue = this.escapeHtml(strValue);

                if (/^[a-z0-9_]+$/i.test(key)) {
                    result += '    ' + `<span class="filter-preview-object__key">${this.escapeHtml(key)}</span>`;
                } else {
                    result += '    ' + `<span class="filter-preview-object__key">${this.escapeHtml(JSON.stringify(key))}</span>`;
                }

                result += ': ' + strValue + ",\n";
            }

            result = result.length > 0 ? `{\n${result.substr(0, result.length - 2)}\n}` : '{}';
            return `<div class="filter-preview-object">${result}</div>`;
        },

        escapeHtml(str) {
            return (str + '').replace(/[&<>"']/g, match => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[match]);
        },

        reset() {
            this.filter = [{code: null}];
        }
    }
};
</script>