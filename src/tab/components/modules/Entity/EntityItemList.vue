<template>
<div>
    <div class="row" v-if="fieldsLoaded">
        <div class="col-5">
            <FilterForm
                :fields="fields"
                @submit="onSubmit"
            />
        </div>
    </div>
    <button class="btn btn-light" @click="$router.push({ name: 'entityItemAdd', params: { entityId } })">Создать элемент</button>
    <div v-if="items.length > 0">
        <TableColumns
            :items="fields"
            :selected="visibleColumns"
            @change="setVisibleColumns"
        />

        <div style="max-width: 100%; overflow-x: scroll;">
            <TableList
                :columns="columns"
                :rowActions="tableRowActions"
                :items="tableItems"
            />
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { getFieldLabel } from 'lib/functions';
import EntityItem from 'lib/entities/Entity/Item';
import FilterForm from 'components/Filter/FilterForm.vue';
import TableList from 'components/TableList/TableList.vue';
import TableColumns from 'components/TableList/Columns.vue';
import cloneDeep from 'lodash-es/cloneDeep';
import EntityProperty from "lib/entities/Entity/Property";

export default {
    components: {
        FilterForm,
        TableList,
        TableColumns,
    },

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

    async mounted() {
        window.testComponent = this;
        await this.loadEntities();
        this.fields = await EntityItem.getFields();
        await this.fillProperties();

        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Элементы']);

        if (this.$route.query.autoload) {
            console.log(1);
            this.loadItems();
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

        async onSubmit(filter) {
            console.log('Filter', filter);
            this.loadItems({ filter });
        },

        async loadItems({ filter } = {}) {
            console.log(2);
            this.items = (await EntityItem.load({
                ENTITY: this.entityId,
                SORT: { 'ID': 'DESC' },
                FILTER: filter,
                _limit: 100
            })).getAll();
        },

        setVisibleColumns(columns) {
            this.visibleColumns = columns;
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