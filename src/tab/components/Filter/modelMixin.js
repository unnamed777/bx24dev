export default {
    model: {
        prop: 'complexValue',
        event: 'change',
    },

    props: {
        complexValue: Object,
        field: Object,
        extra: Object,
    },

    data() {
        return {
            operator: this.complexValue.operator,
            value: this.complexValue.value,
        };
    },

    watch: {
        complexValue() {
            this.value = this.complexValue.value;
            this.operator = this.complexValue.operator;
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
            this.$emit('change', {
                value: this.value,
                operator: this.operator,
            });
        }
    }
}
