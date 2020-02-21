<template>
<BaseSelect :options="options" v-model="value" class="mb-2" />
</template>

<script>
import BaseSelect from './BaseSelect.vue';

export default {
    model: {
        prop: 'complexValue',
        event: 'change',
    },

    components: {
        BaseSelect,
    },

    props: {
        complexValue: Object,
        field: Object,
        extra: Object,
    },

    data() {
        return {
            value: this.complexValue.value,
        };
    },

    computed: {
        options() {
            return this.extra && this.extra.users ? this.extra.users.map(user => ({
                value: user.ID,
                label: `[${user.ID}] ${user.FULL_NAME}`,
            })) : [];
        }
    },

    watch: {
        complexValue() {
            this.value = this.complexValue.value;
        },

        operator() {
            this.notify();
        },

        value() {
            this.notify();
        }
    },

    mounted() {
    },

    methods: {
        notify() {
            this.$emit('change', {
                value: this.value,
            });
        }
    }
}
</script>
