export default {
    props: {
        modelValue: Object,
        field: Object,
        extra: Object,
    },

    emits: ['update:modelValue'],

    data() {
        return {
            operator: this.modelValue.operator,
            value: this.modelValue.value,
        };
    },

    watch: {
        modelValue() {
            this.value = this.modelValue.value;
            this.operator = this.modelValue.operator;
        },

        operator() {
            this.notify();
        },

        value() {
            this.notify();
        }
    },

    mounted() {
    },

    methods: {
        notify() {
            this.$emit('update:modelValue', {
                value: this.value,
                operator: this.operator,
            });
        }
    }
}
