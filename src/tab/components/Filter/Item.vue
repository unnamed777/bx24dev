<template>
<div class="filter-item form-group row">
    <!-- Don't use <label>, it has an issue with focus on select2 search input -->
    <div class="col-6 mb-2">
        <template>
            <BaseSelect
                :options="fieldsSorted"
                :search="true"
                :optionTemplate="optionFieldSelect2Template"
                v-model="code"
            />
        </template>
        <!--<template v-else>
            <a href="#" v-on:click.prevent="editMode = true">{{ fields[code].label }}</a>
        </template>-->
    </div>
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
        <template v-else>
            <input type="text" class="form-control form-control-sm" tabindex="-1" style="opacity: 0.3; pointer-events: none; "/>
        </template>
    </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import BaseSelect from 'components/ui/BaseSelect';
import DefaultValue from './DefaultValue.vue';
import EnumValue from './EnumValue.vue';
import UserValue from './UserValue.vue';
import CrmStatusValue from './CrmStatusValue.vue';
import optionFieldSelect2TemplateMixin from 'mixins/optionFieldSelect2TemplateMixin';

export default {
    components: {
        DefaultValue,
        EnumValue,
        UserValue,
        CrmStatusValue,
        BaseSelect,
    },

    mixins: [
        optionFieldSelect2TemplateMixin
    ],

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
    },

    data() {
        return {
            code: null,
            values: [{operator: '', value: null}],
        };
    },

    computed: {
        fieldsSorted() {
            return Object.values(this.fields).
                sort((a, b) => a.sort - b.sort)
                .map((item) => ({
                    value: item.code,
                    name: item.label,
                    label: `${item.label} (${item.code})`,
                }));
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
                    if (this.$store.state.users.items.length > 0) {
                        component = 'UserValue';
                        extra = {
                            users: this.$store.state.users.items,
                        };
                    } else {
                        // No privileges
                        component = 'DefaultValue';
                    }
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

        jQuery() {
            return window.jQuery.apply(window.jQuery, arguments);
        },

        /*...mapGetters({
            getCrmStatusByEntityId: 'crmStatus/getByEntityId',
        }),*/
    }
};
</script>

<style lang="scss">
.option-field {
    &__name {
        margin-top: -1px;
    }

    &__code {
        font-size: 80%;
        line-height: 1em;
        opacity: 0.7;
    }
}
</style>