<template>
<div class="filter-item form-group row">
    <label class="col-6">
        <BaseSelect
            :options="availableFields"
            :search="true"
            :optionTemplate="optionFieldSelect2Template"
            v-model="field"
        />
    </label>
    <div class="col-6">
        <BaseSelect
            :options="availableOrder"
            v-model="order"
        />
    </div>
</div>
</template>

<script>
import BaseSelect from 'components/ui/BaseSelect.vue';
import optionFieldSelect2TemplateMixin from "mixins/optionFieldSelect2TemplateMixin";

export default {
    components: {
        BaseSelect,
    },

    mixins: [
        optionFieldSelect2TemplateMixin
    ],

    props: {
        fields: {
            type: [Object],
            default: () => { return {}; },
        },
    },

    data() {
        return {
            field: 'ID',
            order: 'DESC',
            availableOrder: {
                'ASC': {
                    value: 'ASC',
                    label: 'По возрастанию',
                },
                'DESC': {
                    value: 'DESC',
                    label: 'По убыванию',
                },
            },
        };
    },

    computed: {
        availableFields() {
            return Object.values(this.fields).sort((a, b) => a.sort - b.sort).map(item => ({
                value: item.code,
                label: `${item.label} (${item.code})`
            }));
        }
    },

    watch: {
        field() {
            this.notify();
        },

        order() {
            this.notify();
        },
    },

    mounted() {
        // Pass default sort
        this.notify();
    },

    methods: {
        notify() {
            this.$emit('change', {
                [this.field]: this.order,
            });
        }
    },
}
</script>
