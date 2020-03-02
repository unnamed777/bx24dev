<template>
<select class="form-control form-control-sm" v-model="currentValue">
    <option v-for="option of currentOptions" :value="option.value">{{ option.label }}</option>
</select>
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
}
</script>
