<template>
<div class="filter-item-value input-group">
    <!-- add disabled -->
    <div class="input-group-prepend">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" style="width: 50px;">{{ operators[operator] }}</button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="#" v-for="(label, op) of operators" v-on:click="operator = op">{{ label }}</a>
        </div>
    </div>
    <input type="text" class="form-control form-control-sm" v-model="value">
</div>
</template>

<script>
import modelMixin from './modelMixin';

export default {
    mixins: [
        modelMixin
    ],

    data() {
        return {
            operators: {
                '': '=',
                '!': '!=',
                '<': '<',
                '<=': '<=',
                '>': '>',
                '>=': '>='
            },
        };
    },

    mounted() {
        $(this.$el.querySelector('.dropdown-toggle')).dropdown();
    },
}
</script>