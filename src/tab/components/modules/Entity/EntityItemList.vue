<template>
<div>
    <div class="row">
        <div class="col-10">
            <GetListForm
                :fields="fields"
                @change="onFormChange"
                @submit="onSubmit"
            />
        </div>
        <div class="col-2 d-flex justify-content-end">
            <div>
                <button class="btn btn-primary" @click="$router.push({ name: 'entityItemAdd', params: { entityId } })">Создать элемент</button>
            </div>
        </div>
    </div>
    <div v-if="items.length > 0">
        <TableColumns
            :items="fields"
            :selected="visibleColumns"
            @change="setVisibleColumns"
        />

        <PageNavigation
            v-if="totalPages > 1"
            :total="totalPages"
            :current="currentPage"
            @change="onPageChange"
        />

        <div style="max-width: 100%; overflow-x: scroll;">
            <TableList
                :columns="columns"
                :rowActions="tableRowActions"
                :items="tableItems"
            />
        </div>

        <PageNavigation
            v-if="totalPages > 1"
            :total="totalPages"
            :current="currentPage"
            @change="onPageChange"
        />
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { getFieldLabel } from 'lib/functions';
import EntityItem from 'lib/entities/Entity/Item';
import GetListForm from 'components/ui/GetListForm.vue';
import TableList from 'components/TableList/TableList.vue';
import TableColumns from 'components/TableList/Columns.vue';
import entriesPageNavMixin from 'mixins/entriesPageNavMixin';
import cloneDeep from 'lodash-es/cloneDeep';

export default {
    components: {
        GetListForm,
        TableList,
        TableColumns,
    },

    mixins: [entriesPageNavMixin],

    data() {
        return {
            items: [],
            visibleColumns: ['ID', 'NAME'],
            fields: {},
            tableRowActions: [
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },
            ],
            filter: {},
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

        availableColumns() {
            return Object.values(this.fields).map(item => ({
                code: item.field,
                label: getFieldLabel(item)
            }));
        },

        columns() {
            let columns = [];

            for (let columnCode of this.visibleColumns) {
                columns.push(this.fields[columnCode]);
            }

            return columns;
        },

        tableItems() {
            const items = cloneDeep(this.items);

            items.map(item => {
                if (!item.PROPERTY_VALUES) {
                    return;
                }

                for (let [property, value] of Object.entries(item.PROPERTY_VALUES)) {
                    item[`PROPERTY_${property}`] = value;
                }
            });

            return items;
        },
    },

    watch: {
        $route() {
            // Add reload
        }
    },

    async mounted() {
        window.testComponent = this;
        await this.loadEntities();
        this.fields = await EntityItem.getFields();
        await this.fillProperties();

        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Элементы']);

        if (this.$route.query.autoload) {
            this.loadEntries();
        }
    },

    methods: {
        async fillProperties() {
            await this.loadProperties(this.entityId);

            this.mergedFields = await EntityItem.getMergedFields(this.entityId, this.properties);
            this.fields = this.mergedFields;

            // Add all properties to visible columns
            this.visibleColumns = this.visibleColumns.concat(
                Object.values(this.fields)
                    .filter(item => item.isProperty)
                    .map(item => item.code)
            );
        },

        async onSubmit() {
            this.currentPage = 1;
            this.loadEntries();
        },

        async loadEntries() {
            let collection = await EntityItem.load({
                ENTITY: this.entityId,
                SORT: { 'ID': 'DESC' },
                FILTER: this.filter,
            }, {
                page: this.currentPage,
            });

            this.items = collection.getAll();
            this.totalPages = Math.ceil(collection.total / EntityItem.PAGE_SIZE);
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
        },

        onFormChange({filter}) {
            this.filter = filter;
        },

        async onDeleteClick({index, row}) {
            if (!confirm(`Удалить элемент ${row.ID} из хранилища ${this.entity.ENTITY}?`)) {
                return;
            }

            await EntityItem.delete(this.entity.ENTITY, row.ID);

            let itemIndex = this.items.findIndex((item) => item.ID === row.ID);
            this.items = [].concat(this.items.slice(0, itemIndex), this.items.slice(itemIndex + 1));
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
            loadProperties: 'entityProperties/load',
        })
    }
};
</script>