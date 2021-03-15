<template>
    <div>
        <BaseTableList
            :columns="tableColumns"
            :items="items"
        >
            <template v-slot:NAME="slotProps">
                {{ ".&nbsp;&nbsp;".repeat(slotProps.item.DEPTH_LEVEL - 1) }}{{ slotProps.item.NAME }}
            </template>
        </BaseTableList>
    </div>
</template>

<script>
import ProductSection from 'lib/entities/Crm/ProductSection';
import BX24 from 'lib/BX24';
import AbstractEntryList from 'components/modules/AbstractEntryList';
import BaseTableList from 'components/TableList/BaseTableList';
import NestedSet from 'lib/NestedSet';
import { mapActions, mapMutations } from 'vuex';

export default {
    components: {
        AbstractEntryList,
        BaseTableList,
    },

    data() {
        return {
            tableColumns: [
                {code: 'ID', label: 'Идентификатор'},
                {code: 'NAME', label: 'Название'},
            ],
            items: [],
        };
    },

    computed: {
        catalogId() {
            return this.$route.params.catalogId;
        },

        catalog() {
            return this.$store.state.crmCatalogs.items[this.catalogId];
        },
    },

    async mounted() {
        await this.loadCatalogs();
        await this.loadSections();
        this.setBreadcrumb(['CRM', 'Каталоги', this.catalog ? this.catalog.NAME : 'Каталог', 'Дерево разделов']);
    },

    methods: {
        async loadSections() {
            let sections = (await BX24.fetchAll(ProductSection.listEndpoint, {
                order: {
                    NAME: 'ASC',
                },
                filter: {
                    CATALOG_ID: this.catalogId,
                }
            }));

            let nestedSet = new NestedSet({
                items: sections,
                primaryKey: 'ID',
                parentKey: 'SECTION_ID',
                sort: () => {},
            });

            this.items = nestedSet.getFlat();
        },

        fieldsGetter($store) {
            let fields = $store.state.productSectionFields.items;
            delete fields.CATALOG_ID;
            return fields;
        },

        ...mapActions({
            loadCatalogs: 'crmCatalogs/load',
        }),

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
