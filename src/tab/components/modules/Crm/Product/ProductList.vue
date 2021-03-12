<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'productFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'PRICE', 'ACTIVE', 'TIMESTAMP_X']"
        :breadcrumb="['CRM', 'Каталоги', this.catalog ? this.catalog.NAME : 'Каталог', 'Товары']"
    />
</template>

<script>
import Product from 'lib/entities/Crm/Product';
import AbstractEntryList from 'components/modules/AbstractEntryList';
import { mapActions } from 'vuex';

export default {
    components: {
        AbstractEntryList,
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

            let collection = (await Product.load({
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
            let fields = $store.state.productFields.items;
            delete fields.CATALOG_ID;
            return fields;
        },

        ...mapActions({
            loadCatalogs: 'crmCatalogs/load',
        })
    }
};
</script>
