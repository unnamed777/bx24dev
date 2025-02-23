<template>
<div>
    <div class="filter-item form-group row" v-for="field of fields">
        <label :class="`col-${ui.labelCols}`">
            {{ field.label }} <span v-if="field.isRequired" class="text-danger small">*</span>
        </label>
        <div class="position-relative" :class="`col-${ui.valueCols}`">
            <component
                :is="valueComponents[field.code].component"
                v-model="local[field.code]"
                :key="field.code"
                :field="field"
                :extra="valueComponents[field.code].extra"
                class="mb-2"
            />
        </div>
    </div>
    <div v-if="buttons" class="form-group row">
        <div class="col-12 d-flex justify-content-end">
            <button
                v-for="(button, index) of buttons"
                type="button"
                class="btn"
                :class="buttonsClasses[index]"
                @click="button.action"
            >{{ button.label }}</button>
        </div>
    </div>
</div>
</template>

<script>
import BaseInput from "components/ui/BaseInput";
import BaseSelect from "components/ui/BaseSelect";

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
        modelValue: Object,
        fields: Array,
        ui: {
            type: Object,
            default() {
                return {
                    labelCols: 3,
                    valueCols: 9,
                    buttonClasses: {
                        submit: ['btn-primary'],
                        cancel: ['btn-link', 'mr-3'],
                    },
                };
            }
        },
        buttons: {
            type: Array,

            /**
             * [{ label: String, action: Function, classes: String[], type: 'submit'|'cancel'|null }]
             */
            validator(value) {
                if (value === undefined) {
                    return true;
                }

                for (let index in value) {
                    const button = value[index];

                    if (!button.label) {
                        console.error(`No label for button #${index}`);
                        return false;
                    }

                    if (!button.action) {
                        console.error(`No action for button #${index}`);
                        return false;
                    }

                    if (button.type && ['submit', 'cancel'].indexOf(button.type) === -1) {
                        console.error(`Unknown type for button #${index}`);
                        return false;
                    }
                }

                return true;
            },
        },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            values: { ...this.modelValue },
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
        },

        local: {
            get() {
                return this.modelValue;
            }
        },

        buttonsClasses() {
            if (!Array.isArray(this.buttons)) {
                return [];
            }

            const result = [];

            for (let index in this.buttons) {
                const button = this.buttons[index];
                result[index] = [];

                if (button.classes) {
                    result[index] = result[index].concat(button.classes);
                } else if (button.type) {
                    result[index] = result[index].concat(this.ui.buttonClasses[button.type]);
                }
            }

            return result;
        },
    },

    watch: {
        values(newValue) {
            this.$emit('update:modelValue', newValue);
        }
    },
}
</script>
