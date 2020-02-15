<template>
<div class="row">
    <div class="col-5">
        <FilterForm v-bind:fields="fields" />
    </div>
</div>
</template>

<script>
import BX24 from '../../../../lib/BX24';
import {prepareCrmEntityFields} from '../../../../lib/functions';
import FilterForm from '../../Filter/FilterForm.vue';

export default {
    data() {
        return {
            fields: {},
        };
    },
    components: {
        FilterForm
    },
    async mounted() {
        let rawFields = await BX24.call('crm.deal.fields');
        this.$parent.$data.breadcrumb = ['CRM', 'Сделки', 'Список'];
        let data = prepareCrmEntityFields(rawFields);

        const fields = {};

        for (let field of data.items) {
            fields[field.code] = field;
        }

        this.fields = fields;
    }
};
</script>