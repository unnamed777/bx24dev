<template>
    <select ref="select" class="form-control form-control-sm" v-model="currentValue">
        <option v-for="option of currentOptions" :value="option.value">{{ option.label }}</option>
    </select>
    <!--<v-select :options="currentOptions" v-model="currentValue"/>-->
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'change',
    },

    props: {
        options: [Object, Array],
        value: [String, Number],
        extra: Object,
        search: {
            type: Boolean,
            default: false,
        },
        optionTemplate: Function,
    },

    computed: {
        currentOptions() {
            if (this.options) {
                return this.options;
            } else if (this.extra && this.extra.options) {
                return this.extra.options;
            }
        },

        currentValue: {
            get() {
                return this.value;
            },

            set(newValue) {
                this.$emit('change', newValue);
            }
        }
    },

    mounted() {
        $(this.$refs['select'])
            .select2({
                dropdownAutoWidth: true,
                minimumResultsForSearch: this.search ? 0 : Infinity,
                templateResult: this.optionTemplate || undefined,
                //width: 'auto',
            })
            .on('change', (e) => this.$emit('change', $(e.currentTarget).val()));
    },

    methods: {
    },
}
</script>
