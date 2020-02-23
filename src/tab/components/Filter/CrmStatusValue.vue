<template>
<BaseSelect :options="options" v-model="value" class="mb-2" />
</template>

<script>
import {mapGetters} from 'vuex';
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
            return this.extra && this.extra.entityId
                ? this.getCrmStatusByEntityId()(this.extra.entityId).map(item => ({
                    value: item.STATUS_ID,
                    label: item.NAME,
                }))
                : [];
        }
    },

    methods: {
        ...mapGetters({
            getCrmStatusByEntityId: 'crmStatuses/getByEntityId',
        }),
    }
}
</script>
