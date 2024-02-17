<template>
<!-- add disabled -->
<div class="input-group-prepend">
    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" style="width: 50px;">{{ localOperators[operator] }}</button>
    <div class="dropdown-menu">
        <a class="dropdown-item" href="#" v-for="(label, op) of localOperators" v-on:click="localOperator = op">{{ label }}</a>
    </div>
</div>
</template>

<script>

export default {
    model: {
        prop: 'operator',
        event: 'change',
    },

    props: {
        operators: {
            type: [String, Object],
            default: '',
        },
        operator: String,
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
        },

        localOperator: {
            get() {
                return this.operator;
            },

            set(newValue) {
                this.$emit('change', newValue);
            }
        },
    },

    mounted() {
        $(this.$el.querySelector('.dropdown-toggle')).dropdown();
    },
}
</script>