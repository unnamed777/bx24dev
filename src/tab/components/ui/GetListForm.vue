<template>
<div>
    <div class="row" v-if="fieldsLoaded">
        <div class="col-5">
            <div class="mb-2 font-weight-bold">Фильтр</div>
            <FilterForm
                :fields="fields"
                @change="onFilterChange"
            />
        </div>
        <div class="col-7">
            <div class="mb-2 font-weight-bold">Объект</div>
            <div class="filter-preview-object" v-html="compiledFilterPreview"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-5 d-flex justify-content-end">
            <button type="button" class="btn btn-primary" v-on:click="$emit('submit')">Показать</button>
        </div>
    </div>
</div>
</template>

<script>
import FilterForm from 'components/Filter/FilterForm.vue';

export default {
    components: {
        FilterForm,
    },

    props: {
        fields: Object,
    },

    data() {
        return {
            compiledFilter: {},
            compiledFilterPreview: '<div class="filter-preview-object">{}</div>',
        };
    },

    computed: {
        fieldsLoaded() {
            return Object.values(this.fields).length > 0;
        },
    },

    methods: {
        onFilterChange({filter, preview}) {
            this.compiledFilter = filter;
            this.compiledFilterPreview = preview;
            this.$emit('change', {filter, preview});
        },
    },
}
</script>
