<template>
    <AbstractEntryListPage
        v-if="isLoaded"
        :loadEntries="loadEntries"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'name', 'timestampX']"
        :sortDefaultField="'id'"
        :sortDefaultOrder="'DESC'"
        :rowActions="rowActions"
        :breadcrumb="['Торговый каталог', this.catalog ? this.catalog.name : 'Каталог', 'Товары']"
    />
</template>

<script>
import Product from 'lib/entities/Catalog/Product';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';
import { mapActions, mapState } from "vuex";
import { vueToObject } from 'lib/functions';

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

        fieldsToSelect() {
            let fields = this.$store.getters['catalogProductFields/getByIblockId'](this.iblockId);
            let result = [];

            // property* are selected by default.
            // But if I request some properties explicitly, the server returns error 500
            for (let fieldCode of Object.keys(fields)) {
                if (/^property\d+$/.test(fieldCode)) {
                    continue;
                }

                result.push(fieldCode);
            }

            return result;
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
            filter.iblockId = this.iblockId;

            let collection = (await Product.load({
                select: this.fieldsToSelect,
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
            const originalFields = $store.getters['catalogProductFields/getByIblockId'](this.iblockId);
            const fields = {};

            for (let [fieldCode, field] of Object.entries(originalFields)) {
                let newField = vueToObject(field);
                newField.label = newField.name;
                newField.code = fieldCode;

                // Convert values to enumeration (like CRM)
                if (field.propertyType === 'L') {
                    newField.type = 'enumeration';

                    newField.items = [];

                    for (let enumItem of Object.values(newField.values)) {
                        newField.items.push({
                            ID: enumItem.id,
                            VALUE: enumItem.value,
                        });
                    }

                    delete newField.values;
                }

                fields[fieldCode] = newField;
            }

            return fields;
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