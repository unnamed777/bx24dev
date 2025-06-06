<template>
    <div>
        <select ref="select" class="form-control form-control-sm" v-model="currentValue">
            <option
                v-for="option of currentNoGroupOptions"
                :key="option.value || option.label"
                :value="option.value"
            >{{ option.label }}</option>

            <template v-for="group of groups">
                <optgroup v-if="currentGroupOptions[group.code]" :label="group.label">
                    <option
                        v-for="option of currentGroupOptions[group.code]"
                        :key="option.value || option.label"
                        :value="option.value"
                    >{{ option.label }}</option>
                </optgroup>
            </template>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        options: [Object, Array],
        groups: {
            type: Array,
            default() {
                return [];
            }
        },
        modelValue: [String, Number],
        extra: Object,
        search: {
            type: Boolean,
            default: false,
        },
        optionTemplate: Function,
        select2Options: {
            type: Object,
            default() {
                return {};
            },
        }
    },

    emits: ['update:modelValue'],

    computed: {
        currentOptions() {
            let srcOptions;

            if (this.options) {
                srcOptions = this.options;
            } else if (this.extra && this.extra.options) {
                srcOptions = this.extra.options;
            }

            return srcOptions;
        },

        currentNoGroupOptions() {
            const useGroups = this.groups.length > 0;
            return this.currentOptions.filter(item => !useGroups || !item.group);
        },

        currentGroupOptions() {
            if (this.groups.length === 0) {
                return {};
            }

            let result = {};

            for (let group of this.groups) {
                result[group.code] = this.currentOptions.filter(item => item.group === group.code);

            }

            return result;
        },

        currentValue: {
            get() {
                return this.modelValue;
            },

            set(newValue) {
                console.log('emit');
                this.$emit('update:modelValue', newValue);
            }
        }
    },

    watch: {
        modelValue() {
            // To update select2 when model is changed from outside
            if ($(this.$refs['select']).hasClass("select2-hidden-accessible")) {
                setTimeout(() => $(this.$refs['select']).select2(this.finalSelect2Options), 10);
            }
        }
    },

    mounted() {
        this.finalSelect2Options = {
            dropdownAutoWidth: true,
            minimumResultsForSearch: this.search ? 0 : Infinity,
            templateResult: this.optionTemplate || undefined,
            //width: 'auto',
            ...this.select2Options
        };

        $(this.$refs['select'])
            .select2(this.finalSelect2Options)
            .on('change', (e) => this.$emit('update:modelValue', $(e.currentTarget).val()));
    },

    beforeUnmount() {
        $(this.$refs['select']).select2('destroy').off('change');
    },

    methods: {
    },
}
</script>
