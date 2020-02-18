<template>
<div class="filter-item form-group row">
    <label class="col-6">
        <template>
            <select class="form-control form-control-sm" v-model="code">
                <option></option>
                <option v-for="field in fieldsSorted" v-bind:value="field.code">{{ field.label }} ({{ field.code }})</option>
            </select>
        </template>
        <!--<template v-else>
            <a href="#" v-on:click.prevent="editMode = true">{{ fields[code].label }}</a>
        </template>-->
    </label>
    <div class="col-6 position-relative">
        <template v-if="code">
            <component :is="valueComponent" v-model="complexValue" :field="fields[code]" :disabled="!code" />
        </template>
        <div class="filter-item__add-value-wrapper"><a href="#" class="btn btn-sm btn-light">+</a></div>
    </div>
</div>
</template>

<script>
import DefaultValue from './DefaultValue.vue';
import EnumValue from './EnumValue.vue';

export default {
    components: {
        DefaultValue,
        EnumValue,
    },
    model: {
        prop: 'item',
        event: 'change',
    },

    props: {
        fields: {
            type: Object,
            default: () => { return {}; },
        },
        item: Object,
    },

    data() {
        return {
            code: null,
            value: null,
            operator: '=',
        };
    },

    computed: {
        fieldsSorted() {
            return Object.values(this.fields).sort((a, b) => a.sort - b.sort);
        },

        complexValue: {
            get() {
                return {
                    value: this.value,
                    operator: this.operator,
                };
            },

            set(newValue) {
                this.value = newValue.value;
                this.operator = newValue.operator;
            }
        },

        valueComponent() {
            let result;

            if (!this.fields[this.code]) {
                return null;
            }

            if (this.fields[this.code].type === 'enumeration') {
                result = 'EnumValue';
            } else {
                result = 'DefaultValue';
            }

            return result;
        }
    },

    watch: {
        code() {
            this.notify();
        },
        value() {
            this.notify();
        },
        operator() {
            this.notify();
        }
    },

    mounted() {
    },

    methods: {
        notify() {
            this.$emit('change', {
                code: this.code,
                value: this.value,
                operator: this.operator,
            });
        }
    }
};
</script>