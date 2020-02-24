<template>
<input type="text" class="form-control form-control-sm" v-model="currentValue">
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'change',
    },

    props: {
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
