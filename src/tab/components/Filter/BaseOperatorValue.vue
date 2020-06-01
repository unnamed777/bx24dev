<template>
<div class="filter-item-value input-group">
    <!-- add disabled -->
    <div class="input-group-prepend">
        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" style="width: 50px;">{{ localOperators[operator] }}</button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="#" v-for="(label, op) of localOperators" v-on:click="operator = op">{{ label }}</a>
        </div>
    </div>
    <slot :value="value"></slot>
    <!--<input type="text" class="form-control form-control-sm" v-model="value">-->
</div>
</template>

<script>
import modelMixin from './modelMixin';

export default {
    mixins: [
        modelMixin
    ],

    props: {
        operators: {
            type: [String, Object],
            default: '',
        },
    },

    computed: {
        localOperators() {
            if (this.operators instanceof Object) {
                return this.operators;
            }

            switch (this.operators) {
                case 'not':
                    return {
                        '': '=',
                        '!': '!',
                    };
                    break;

                default:
                    return {
                        '': '=',
                        '!': '!',
                        '<': '<',
                        '<=': '<=',
                        '>': '>',
                        '>=': '>='
                    };
                    break;
            }
        }
    },

    mounted() {
        $(this.$el.querySelector('.dropdown-toggle')).dropdown();
    },
}
</script>