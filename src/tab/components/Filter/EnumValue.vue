<template>
<BaseSelect :options="options" v-model="value" class="mb-2" />
</template>

<script>
import BaseSelect from './BaseSelect.vue';

export default {
    model: {
        prop: 'complexValue',
        event: 'change',
    },

    components: {
        BaseSelect,
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

    computed: {
        options() {
            return this.field && this.field.items ? this.field.items.map(item => ({
                value: item.ID,
                label: `[${item.ID}] ${item.VALUE}`,
            })) : [];
        },

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
</script>
