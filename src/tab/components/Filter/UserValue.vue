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
        modelMixin,
    ],

    computed: {
        options() {
            return [{ value: 'NULL', label: '(пусто)'}].concat(this.extra && this.extra.users ? this.extra.users.map(user => ({
                value: user.ID,
                label: `[${user.ID}] ${user.FULL_NAME}`,
            })) : []);
        }
    },
}
</script>
