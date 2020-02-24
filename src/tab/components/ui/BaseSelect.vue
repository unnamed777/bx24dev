<template>
<select class="form-control form-control-sm" v-model="currentValue">
    <option v-for="option of options" :value="option.value">{{ option.label }}</option>
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
    },

    computed: {
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
