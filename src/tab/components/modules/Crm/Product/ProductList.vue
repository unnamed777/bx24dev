<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'productFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'NAME', 'PRICE', 'ACTIVE', 'TIMESTAMP_X']"
        :rowActions="rowActions"
        :breadcrumb="['CRM', 'Каталоги', this.catalog ? this.catalog.NAME : 'Каталог', 'Товары']"
    />
</template>

<script>
import Product from 'lib/entities/Crm/Product';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AbstractEntryListPage,
    },

    data() {
        return {
            rowActions: [
                {
                    label: 'Открыть в Б24',
                    onClick: this.onB24EditClick,
                },
            ],
        };
    },

    computed: {
        catalogId() {
            return this.$route.params.catalogId;
        },

        catalog() {
            return this.$store.state.crmCatalogs.items[this.catalogId];
        },

        ...mapState({
            appData: state => state.appData,
        }),
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

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/shop/catalog/${this.catalogId}/product/${row.ID}/`, '_blank');
        },

        ...mapActions({
            loadCatalogs: 'crmCatalogs/load',
        })
    }
};
</script>
