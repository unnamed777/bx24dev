<template>
<div class="filter-item-value input-group">
    <Operators v-model="operator" operators="not" />
    <BaseSelect :options="options" v-model="value" />
</div>
</template>

<script>
import {mapGetters} from 'vuex';
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
            return [{ value: 'NULL', label: '(пусто)'}].concat(this.extra && this.extra.entityId
                ? this.getCrmStatusByEntityId(this.extra.entityId).map(item => ({
                    value: item.STATUS_ID,
                    label: `[${item.STATUS_ID}] ${item.NAME}`,
                }))
                : []);
        },

        ...mapGetters({
            getCrmStatusByEntityId: 'crmStatuses/getByEntityId',
        }),
    }
}
</script>
