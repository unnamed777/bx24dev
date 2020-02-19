<template>
<div class="filter-item-value input-group">
    <!-- add disabled -->
    <div class="input-group-prepend">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown">{{ this.operator }}</button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="#" v-for="op of operators" v-on:click="operator = op">{{ op }}</a>
        </div>
    </div>
    <input type="text" class="form-control form-control-sm" v-model="value">
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
        extra: Object,
    },

    data() {
        return {
            operator: this.complexValue.operator,
            value: this.complexValue.value,
            operators: ['=', '<', '<=', '>', '>='],
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