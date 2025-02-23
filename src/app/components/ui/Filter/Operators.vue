<template>
<!-- add disabled -->
<div class="input-group-prepend">
    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" style="width: 50px;">{{ localOperators[modelValue] }}</button>
    <div class="dropdown-menu">
        <a
            v-for="(label, op) of localOperators"
            class="dropdown-item"
            href="#"
            @click.prevent="localOperator = op"
        >{{ label }}</a>
    </div>
</div>
</template>

<script>

export default {
    props: {
        operators: {
            type: [String, Object],
            default: '',
        },
        modelValue: String,
    },

    emits: ['update:modelValue'],

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
                return this.modelValue;
            },

            set(newValue) {
                this.$emit('update:modelValue', newValue);
            }
        },
    },

    mounted() {
        $(this.$el.querySelector('.dropdown-toggle')).dropdown();
    },
}
</script>