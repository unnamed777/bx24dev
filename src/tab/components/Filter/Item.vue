<template>
<div class="filter-item form-group row">
    <label class="col-6">
        <template>
            <select class="form-control form-control-sm" v-model="code">
                <option></option>
                <option v-for="field in fieldsSorted" v-bind:value="field.code" :key="field.code">{{ field.label }} ({{ field.code }})</option>
            </select>
        </template>
        <!--<template v-else>
            <a href="#" v-on:click.prevent="editMode = true">{{ fields[code].label }}</a>
        </template>-->
    </label>
    <div class="col-6 position-relative">
        <template v-if="code">
            <component
                :is="valueComponent.name"
                v-for="(complexValue, index) of values"
                v-model="values[index]"
                :key="index"
                :field="fields[code]"
                :extra="valueComponent.extra"
                :disabled="!code"
                class="mb-2"
            />
            <div class="filter-item__add-value-wrapper"><a href="#" @click.prevent="addValue">добавить</a></div>
        </template>
    </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import DefaultValue from './DefaultValue.vue';
import EnumValue from './EnumValue.vue';
import UserValue from './UserValue.vue';
import CrmStatusValue from './CrmStatusValue.vue';

export default {
    components: {
        DefaultValue,
        EnumValue,
        UserValue,
        CrmStatusValue,
    },
    model: {
        prop: 'item',
        event: 'change',
    },

    props: {
        fields: {
            type: [Object],
            default: () => { return {}; },
        },
        item: Object,
        // @todo Move to a Store
        users: Array,
    },

    data() {
        return {
            code: null,
            values: [{operator: '', value: null}]
        };
    },

    computed: {
        fieldsSorted() {
            return Object.values(this.fields).sort((a, b) => a.sort - b.sort);
        },

        valueComponent() {
            let component;
            let extra = {};

            if (!this.fields[this.code]) {
                return null;
            }

            switch (this.fields[this.code].type) {
                case 'enumeration':
                    component = 'EnumValue';
                    break;

                case 'user':
                    component = 'UserValue';
                    extra = {
                        users: this.users
                    };
                    break;

                case 'crm_status':
                    component = 'CrmStatusValue';

                    extra = {
                        entityId: this.fields[this.code].statusType,
                        /*items: this.getCrmStatusByEntityId(this.fields[this.code].statusType).map(item => ({
                            value: item.STATUS_ID,
                            label: item.NAME,
                        })),*/
                    };

                    break;

                default:
                    component = 'DefaultValue';
                    break;
            }

            return {
                name: component,
                extra: extra,
            };
        }
    },

    watch: {
        code() {
            this.notify();
        },

        values(newValue) {
            this.notify();
        }
    },

    mounted() {
    },

    methods: {
        notify() {
            this.$emit('change', {
                code: this.code,
                // Maybe I need to make a deep copy
                values: this.values,
            });
        },

        addValue() {
            this.values.push({operator: '', value: null});
        },

        /*...mapGetters({
            getCrmStatusByEntityId: 'crmStatus/getByEntityId',
        }),*/
    }
};
</script>