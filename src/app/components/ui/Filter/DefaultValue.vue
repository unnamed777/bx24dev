<template>
    <div class="filter-item-value input-group">
        <Operators v-model="operator" />
        <input type="text" class="form-control form-control-sm" v-model="value"/>
    </div>
</template>

<script>
import modelMixin from "./modelMixin";
import Operators from "./Operators";

export default {
    components: {
        Operators,
    },

    mixins: [
        modelMixin
    ],

    props: {
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
        //$(this.$refs['el'].querySelector('.dropdown-toggle'))?.dropdown();
    },
}
</script>