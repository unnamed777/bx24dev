<template>
    <div class="filter-item-value input-group">
        <Operators v-model="operator" />
        <input type="text" class="form-control form-control-sm" v-model="value">
    </div>
    <!--<BaseOperatorValue v-model="complexValue">
        <template v-slot:default="slotProps">
            {{ slotProps }}
            <input type="text" class="form-control form-control-sm" v-model="slotProps.value">
        </template>
    </BaseOperatorValue>-->
</template>

<script>
import modelMixin from './modelMixin';
import Operators from './Operators';
//import BaseOperatorValue from './BaseOperatorValue';

export default {
    components: {
        Operators,
    },

    mixins: [
        modelMixin
    ],

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
            operators: {
                '': '=',
                '!': '!',
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