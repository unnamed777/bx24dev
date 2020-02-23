<template>
<BaseSelect :options="options" v-model="value" class="mb-2" />
</template>

<script>
import BaseSelect from './BaseSelect.vue';
import modelMixin from './modelMixin';

export default {
    components: {
        BaseSelect,
    },

    mixins: [
        modelMixin
    ],

    computed: {
        options() {
            return this.field && this.field.items ? this.field.items.map(item => ({
                value: item.ID,
                label: `[${item.ID}] ${item.VALUE}`,
            })) : [];
        },

    },
}
</script>
