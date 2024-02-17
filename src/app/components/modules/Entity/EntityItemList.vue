<template>
<div>
    <AbstractEntryListPage
        ref="component"
        :loadEntries="loadEntries"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="visibleColumns"
        :rowActions="rowActions"
        :breadcrumb="breadcrumb"
    >
        <template v-slot:page-actions>
            <button class="btn btn-light" @click="$root.goToRoute({ name: 'entityItemAdd', params: { entityId } })">Создать элемент</button>
        </template>
    </AbstractEntryListPage>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import EntityItem from 'lib/entities/Entity/Item';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
    },

    data() {
        return {
            breadcrumb: ['Хранилище'],
            items: [],
            visibleColumns: ['ID', 'NAME'],
            fields: {},
            rowActions: [
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },
            ],
            filter: {},
            sort: {},
        };
    },

    computed: {
        fieldsLoaded() {
            return Object.values(this.fields).length > 0;
        },

        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.$store.state.entities.items[this.entityId];
        },

        properties() {
            return this.$store.state.entityProperties.items[this.entityId];
        },

        columns() {
            let columns = [];

            for (let columnCode of this.visibleColumns) {
                columns.push(this.fields[columnCode]);
            }

            return columns;
        },
    },

    watch: {
        $route() {
            // Add reload
        }
    },

    async mounted() {
        await this.loadEntities();
        await this.loadMergedFields();
        this.setVisibleColumns();

        this.breadcrumb = ['Хранилище', this.entity.NAME, 'Элементы'];

        if (this.$route.query.autoload) {
            this.$refs.component.submit();
        }
    },

    methods: {
        async loadMergedFields() {
            await EntityItem.getFields();
            await this.fillProperties();
        },

        fieldsGetter($store) {
            return this.fields;
        },

        async fillProperties() {
            await this.loadProperties(this.entityId);

            this.mergedFields = await EntityItem.getMergedFields(this.entityId, this.properties);
            this.fields = this.mergedFields;
        },

        async loadEntries() {
            let collection = await EntityItem.load({
                ENTITY: this.entityId,
                SORT: this.sort,
                FILTER: this.filter,
            }, {
                page: this.currentPage,
            });

            let items = collection.getAll();

            items.map(item => {
                if (!item.PROPERTY_VALUES) {
                    return;
                }

                for (let [property, value] of Object.entries(item.PROPERTY_VALUES)) {
                    item[`PROPERTY_${property}`] = value;
                }
            });

            return {
                entries: items,
                total: collection.total,
            };
        },

        setVisibleColumns() {
            this.visibleColumns = this.visibleColumns.concat(
                Object.values(this.fields)
                    .filter(item => item.isProperty)
                    // Limit amount of visible properties by default
                    .slice(0, 10)
                    .map(item => item.code)
            );
        },

        async onDeleteClick({index, row}) {
            if (!confirm(`Удалить элемент ${row.ID} из хранилища ${this.entity.ENTITY}?`)) {
                return;
            }

            await EntityItem.delete(this.entity.ENTITY, row.ID);
            this.$refs.component.removeItem((items) => items.findIndex((item) => item.ID === row.ID));
        },

        ...mapActions({
            loadEntities: 'entities/load',
            loadProperties: 'entityProperties/load',
        })
    }
};
</script>