<template>
    <AbstractEntryListPage
        v-if="isLoaded"
        :loadEntries="loadEntries"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'name', 'timestampX']"
        :rowActions="rowActions"
        :breadcrumb="['Торговый каталог', this.catalog ? this.catalog.name : 'Каталог', 'Товары']"
    />
</template>

<script>
import Product from 'lib/entities/Catalog/Product';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapActions, mapState } from "vuex";

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

    async mounted() {
        await this.loadProductFields({iblockId: this.iblockId, productType: Product.TYPE_PRODUCT});
        this.isLoaded = true;
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Product.load({
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

        fieldsGetter($store) {
            return $store.getters['catalogProductFields/getByIblockId'](this.iblockId);
        },

        onB24EditClick({row, index}) {
            window.open(`https://${this.appData.portal}/crm/catalog/${this.iblockId}/product/${row.id}/`, '_blank');
        },

        ...mapActions({
            loadProductFields: 'catalogProductFields/load',
        })
    }
};
</script>