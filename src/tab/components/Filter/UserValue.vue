<template>
<BaseSelect :options="options" v-model="value" class="mb-2" />
</template>

<script>
import BaseSelect from 'components/ui/BaseSelect.vue';
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
            return this.extra && this.extra.users ? this.extra.users.map(user => ({
                value: user.ID,
                label: `[${user.ID}] ${user.FULL_NAME}`,
            })) : [];
        }
    },
}
</script>
