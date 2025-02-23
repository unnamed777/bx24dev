<template>
    <input
        type="text"
        class="form-control form-control-sm"
        :readonly="readOnly"
        v-model="currentValue"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
        @keypress="$emit('keypress', $event)"
    />
</template>

<script>
export default {
    props: {
        modelValue: [String, Number],
        field: Object,
    },

    emits: ['update:modelValue', 'keydown', 'keyup', 'keypress'],

    computed: {
        readOnly() {
            return this.field && this.field.readOnly === true;
        },

        currentValue: {
            get() {
                return this.modelValue;
            },

            set(newValue) {
                this.$emit('update:modelValue', newValue);
            }
        }
    },
}
</script>
