<template>
<div class="filter-item-value input-group">
    <Operators v-model="operator" operators="not" />
    <BaseSelect :options="options" v-model="value" />
</div>
</template>

<script>
import BaseSelect from 'components/ui/BaseSelect.vue';
import Operators from './Operators';
import modelMixin from './modelMixin';

export default {
    components: {
        BaseSelect,
        Operators,
    },

    mixins: [
        modelMixin
    ],

    computed: {
        options() {
            return [{ value: 'NULL', label: '(пусто)'}].concat(this.field && this.field.items ? this.field.items.map(item => ({
                value: item.ID,
                label: `[${item.ID}] ${item.VALUE}`,
            })) : []);
        },

    },
}
</script>
