<template>
    <div class="product-section-tree">
        <BaseTableList
            :columns="tableColumns"
            :items="items"
            :sortOnClick="false"
            :rowActions="getRowActions()"
        >
            <template v-slot:name="slotProps">
                <span class="goto" @click="goto(slotProps.item.iblockSectionId)">{{ ".&nbsp;&nbsp;".repeat(slotProps.item.DEPTH_LEVEL - 1) }}</span><!--
                --><span class="catalog-section-tree-anchor" :data-id="slotProps.item.id">{{ slotProps.item.name }}</span>
            </template>
        </BaseTableList>
    </div>
</template>

<script>
import Section from 'lib/entities/Catalog/Section';
import BaseTableList from 'components/ui/TableList/BaseTableList';
import NestedSet from 'lib/NestedSet';
import { mapActions, mapMutations } from 'vuex';
import { sectionEditInB24, sectionOpenInB24 } from './helpers';

export default {
    components: {
        BaseTableList,
    },

    data() {
        return {
            tableColumns: [
                {code: 'id', label: 'Идентификатор'},
                {code: 'name', label: 'Название'},
            ],
            items: [],
        };
    },

    computed: {
        iblockId() {
            return this.$route.params.iblockId;
        },

        catalog() {
            return this.$store.state.catalogCatalogs.items[this.iblockId];
        },
    },

    async mounted() {
        await this.loadCatalogs();
        await this.loadSections();
        this.setBreadcrumb(['Торговый каталог', this.catalog ? this.catalog.name : 'Каталог', 'Дерево разделов']);
    },

    methods: {
        async loadSections() {
            let sections = (await Section.load({
                order: {
                    name: 'asc',
                },
                filter: {
                    iblockId: this.catalog.id,
                }
            })).getAll();

            let nestedSet = new NestedSet({
                items: sections,
                primaryKey: 'id',
                parentKey: 'iblockSectionId',
                sort: () => {},
            });

            this.items = nestedSet.getFlat();
        },

        getRowActions() {
            return [
                {
                    label: 'Открыть в Б24',
                    onClick: this.onB24OpenClick,
                },
                {
                    label: 'Редактировать в Б24',
                    onClick: this.onB24EditClick,
                },
            ];
        },

        goto(id) {
            const anchor = document.querySelector(`.catalog-section-tree-anchor[data-id="${id}"]`);
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

        onB24OpenClick({row, index}) {
            sectionOpenInB24(this.catalog.id, row.id);
        },

        onB24EditClick({row, index}) {
            sectionEditInB24(this.catalog.id, row.id, row.iblockSectionId);
        },

        ...mapActions({
            loadCatalogs: 'catalogCatalogs/load',
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
.catalog-section-tree {
    tr.transition,
    tr.transition td,
    tr.table-warning {
        transition: background-color ease 0.5s;
    }

}
</style>