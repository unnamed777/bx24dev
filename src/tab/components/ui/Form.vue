<template>
<div>
    <div class="filter-item form-group row" v-for="field of fields">
        <label :class="`col-${ui.labelCols}`">
            {{ field.label }}
        </label>
        <div class="position-relative" :class="`col-${ui.valueCols}`">
            <component
                :is="valueComponents[field.code].component"
                v-model="values[field.code]"
                :key="field.code"
                :field="field"
                :extra="valueComponents[field.code].extra"
                class="mb-2"
            />
        </div>
    </div>
    {{ values }}
</div>
</template>

<script>
import BaseInput from 'components/ui/BaseInput';
import BaseSelect from 'components/ui/BaseSelect';

export default {
    components: {
        BaseInput,
        BaseSelect,
    },

    model: {
        prop: 'model',
        event: 'change',
    },

    props: {
        model: Object,
        fields: Array,
        ui: {
            type: Object,
            default() {
                return {
                    labelCols: 3,
                    valueCols: 9,
                };
            }
        },
    },

    data() {
        return {
            values: { ...this.model },
        };
    },

    computed: {
        valueComponents() {
            let components = {};

            for (let field of this.fields) {
                let component;
                let extra = {};

                switch (field.type) {
                    case 'enumeration':
                        component = 'BaseSelect';
                        extra.options = field.items.map(item => ({value: item.ID, label: item.VALUE }));
                        break;

                    default:
                        component = 'BaseInput';
                        break;
                }

                components[field.code] = {
                    component: component,
                    extra: extra,
                };
            }

            return components;
        }
    },

    watch: {
        values(newValue) {
            this.$emit('change', newValue);
        }
    }
}
</script>
