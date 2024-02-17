<template>
    <AbstractEntryListPage
        v-if="isLoaded"
        :key="'sectionList_' + catalog.id"
        :loadEntries="loadEntries"
        :loadFieldsAction="'catalogSectionFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'active', 'name', 'iblockSectionId', 'xmlId', 'code']"
        :sortDefaultField="'id'"
        :sortDefaultOrder="'desc'"
        :rowActions="rowActions"
        :breadcrumb="['Торговый каталог', this.catalog ? this.catalog.name : 'Каталог', 'Разделы']"
    />
</template>

<script>
import Section from 'lib/entities/Catalog/Section';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapActions, mapState } from "vuex";
import { sectionEditInB24, sectionOpenInB24 } from './helpers';

export default {
    components: {
        AbstractEntryListPage,
    },

    data() {
        return {
            rowActions: [
                {
                    label: 'Открыть в Б24',
                    onClick: this.onB24OpenClick,
                },
                {
                    label: 'Редактировать в Б24',
                    onClick: this.onB24EditClick,
                },
            ],
            isLoaded: false,
        };
    },

    computed: {
        iblockId() {
            return this.$route.params.iblockId;
        },

        catalog() {
            return this.$store.state.catalogCatalogs.items[this.iblockId];
        },

        ...mapState({
            appData: state => state.appData,
        }),
    },

    watch: {
        $route() {
            console.log('changed');
        }
    },

    async mounted() {
        await this.loadCatalogs();
        await this.loadSectionFields();
        this.isLoaded = true;
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            filter.iblockId = this.iblockId;

            let collection = (await Section.load({
                order: sort,
                filter: filter,
            }, {
                page: page,
            }));

            return {
                entries: collection.getAll(),
                total: collection.total,
            };
        },

        fieldsGetter(store) {
            return store.state.catalogSectionFields.items;
        },

        onB24OpenClick({row, index}) {
            sectionOpenInB24(this.catalog.id, row.id);
        },

        onB24EditClick({row, index}) {
            sectionEditInB24(this.catalog.id, row.id, row.iblockSectionId);
        },

        ...mapActions({
            loadCatalogs: 'catalogCatalogs/load',
            loadSectionFields: 'catalogSectionFields/load',
        }),
    }
};
</script>