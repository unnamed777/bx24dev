<template>
<select class="form-control form-control-sm mb-2" v-model="currentValue">
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
        options: Object,
        value: [String, Number],
    },

    data() {
        return {
            currentValue: this.value,
        };
    },

    watch: {
        currentValue() {
            this.notify();
        }
    },

    methods: {
        notify() {
            this.$emit('change', this.currentValue);
        }
    }
}
</script>
