<template>
<input
    type="text"
    class="form-control form-control-sm"
    :readonly="readOnly"
    v-model="currentValue"
/>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'change',
    },

    props: {
        value: [String, Number],
        field: Object,
    },

    computed: {
        readOnly() {
            return this.field && this.field.readOnly === true;
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
