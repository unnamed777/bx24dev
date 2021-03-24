<template>
<div v-if="fieldsLoaded" class="mb-4">
    <div class="row">
        <div class="col-6">
            <div class="mb-2 font-weight-bold">Фильтр</div>
            <FilterForm
                ref="filter"
                :fields="fields"
                @change="onFilterChange"
            />
        </div>
        <div class="col-6">
            <div class="mb-2 font-weight-bold">Объект</div>
            <div class="filter-preview-object" v-html="filterPreview"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-6">
            <div class="mb-2 font-weight-bold">Сортировка</div>
            <SortForm
                :fields="fields"
                @change="onSortChange"
            />
        </div>
    </div>
    <div class="row">
        <div class="col-6 d-flex justify-content-end">
            <button v-show="Object.entries(filter).length > 0" type="button" class="btn btn-link mr-3" v-on:click="reset()">Сброс</button>
            <button type="button" class="btn btn-primary" v-on:click="$emit('submit')">Показать</button>
        </div>
    </div>
</div>
</template>

<script>
import FilterForm from 'components/Filter/FilterForm.vue';
import SortForm from 'components/SortForm.vue';

export default {
    components: {
        FilterForm,
        SortForm,
    },

    props: {
        fields: Object,
    },

    data() {
        return {
            filter: {},
            sort: {},
            filterPreview: '<div class="filter-preview-object">{}</div>',
        };
    },

    computed: {
        fieldsLoaded() {
            return Object.values(this.fields).length > 0;
        },
    },

    methods: {
        onFilterChange({filter, preview}) {
            this.filter = filter;
            this.filterPreview = preview;
            this.notify();
        },

        onSortChange(sort) {
            this.sort = sort;
            this.notify();
        },

        notify() {
            this.$emit('change', {
                filter: this.filter,
                preview: this.preview,
                sort: this.sort,
            });
        },

        reset() {
            this.filter = {};
            // Dirty
            this.$refs.filter.reset();
            this.notify();
        }
    },
}
</script>
