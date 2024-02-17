<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'productSectionFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'SECTION_ID', 'XML_ID']"
        :breadcrumb="['CRM', 'Каталоги', this.catalog ? this.catalog.NAME : 'Каталог', 'Разделы']"
    />
</template>

<script>
import ProductSection from 'lib/entities/Crm/ProductSection';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapActions } from 'vuex';

export default {
    components: {
        AbstractEntryListPage,
    },

    computed: {
        catalogId() {
            return this.$route.params.catalogId;
        },

        catalog() {
            return this.$store.state.crmCatalogs.items[this.catalogId];
        },
    },

    mounted() {
        this.loadCatalogs();
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            filter = {
                ...filter,
                CATALOG_ID: this.catalogId,
            };

            let collection = (await ProductSection.load({
                order: sort,
                select: ['*'],
                filter: filter,
            }, {
                page: page,
            }));

            return {
                entries: collection.getAll(),
                total: collection.total,
            };
        },

        fieldsGetter($store) {
            let fields = $store.state.productSectionFields.items;
            delete fields.CATALOG_ID;
            return fields;
        },

        ...mapActions({
            loadCatalogs: 'crmCatalogs/load',
        })
    }
};
</script>
