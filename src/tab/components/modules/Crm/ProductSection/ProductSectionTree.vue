<template>
    <div class="product-section-tree">
        <BaseTableList
            :columns="tableColumns"
            :items="items"
            :sortOnClick="false"
        >
            <template v-slot:NAME="slotProps">
                <span class="goto" @click="goto(slotProps.item.SECTION_ID)">{{ ".&nbsp;&nbsp;".repeat(slotProps.item.DEPTH_LEVEL - 1) }}</span><!--
                --><span class="product-section-tree-anchor" :data-id="slotProps.item.ID">{{ slotProps.item.NAME }}</span>
            </template>
        </BaseTableList>
    </div>
</template>

<script>
import ProductSection from 'lib/entities/Crm/ProductSection';
import BX24 from 'lib/BX24';
import BaseTableList from 'components/ui/TableList/BaseTableList';
import NestedSet from 'lib/NestedSet';
import { mapActions, mapMutations } from 'vuex';

export default {
    components: {
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

        goto(id) {
            const anchor = document.querySelector(`.product-section-tree-anchor[data-id="${id}"]`);
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Dirty
            anchor.closest('tr').classList.add('transition', 'table-warning');

            setTimeout(() => {
                anchor.closest('tr').classList.remove('table-warning');

                setTimeout(() => {
                    anchor.closest('tr').classList.remove('transition');
                }, 500);
            }, 2000);
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

<style scoped lang="scss">
.goto {
    cursor: pointer;
}
</style>

<style lang="scss">
.product-section-tree {
    tr.transition,
    tr.transition td,
    tr.table-warning {
        transition: background-color ease 0.5s;
    }

}
</style>