<template>
<div>
    <div class="filter-item form-group row" v-for="field of fields">
        <label :class="`col-${ui.labelCols}`">
            {{ field.label }}
        </label>
        <div class="position-relative" :class="`col-${ui.valueCols}`">
            <component
                :is="valueComponents[field.code]"
                v-model="values[field.code]"
                :key="field.code"
                :field="field"
                class="mb-2"
            />
        </div>
    </div>
    {{ values }}
</div>
</template>

<script>
import BaseInput from 'components/ui/BaseInput';

export default {
    components: {
        BaseInput
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
            values: {},
        };
    },

    computed: {
        valueComponents() {
            let components = {};

            for (let field of this.fields) {
                let component;

                switch (field.type) {
                    default:
                        component = 'BaseInput';
                        break;
                }

                components[field.code] = component;
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
