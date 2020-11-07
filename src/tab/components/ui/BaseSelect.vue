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
                //width: 'auto',
            })
            .on('change', (e) => this.$emit('change', $(e.currentTarget).val()));

        // Fix: when click on select to open dropdown, search input loses focus after mouseup event
        if (this.search) {
            $(this.$refs['select']).on('select2:open', (e) => {
                setTimeout(() => $(e.currentTarget).data('select2').$dropdown.find('.select2-search__field').focus(), 500);
            });
        }
    },

    methods: {
    },
}
</script>
