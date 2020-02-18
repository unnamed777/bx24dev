<template>
<div>
    <select class="form-control form-control-sm" v-model="value">
        <option v-for="item of field.items" :value="item.ID">[{{ item.ID }}] {{ item.VALUE }}</option>
    </select>
</div>
</template>

<script>
export default {
    model: {
        prop: 'complexValue',
        event: 'change',
    },

    props: {
        complexValue: Object,
        field: Object,
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
        $(this.$el.querySelector('.dropdown-toggle')).dropdown();
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
