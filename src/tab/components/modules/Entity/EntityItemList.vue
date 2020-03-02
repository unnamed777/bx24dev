<template>
<div>
    <div class="row" v-if="fieldsLoaded">
        <div class="col-5">
            <FilterForm :fields="fields" v-on:submit="onSubmit" />
        </div>
    </div>
    <div v-if="items.length > 0">
        <TableColumns :items="fields" :selected="visibleColumns" v-on:change="setVisibleColumns" />
        <div style="max-width: 100%; overflow-x: scroll;">
            <TableList :columns="columns" :items="tableItems" />
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
        };
    },

    computed: {
        fieldsLoaded() {
            return Object.entries(this.fields).length > 0;
        },

        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.getEntityById(this.$route.params.entityId);
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

        ...mapGetters({
            getEntityById: 'entities/getById',
            getByEntityId: 'entityProperties/getByEntityId',
        }),
    },

    async mounted() {
        await this.loadEntities();
        this.fields = await EntityItem.getFields();
        await this.fillProperties();

        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Элементы']);
    },

    methods: {
        async fillProperties() {
            await this.loadProperties(this.entityId);
            this.properties = this.getByEntityId(this.entityId);
            const fields = {...this.fields};

            this.properties.map((property) => {
                let title = property.NAME ? `${property.NAME} (${property.PROPERTY})` : property.PROPERTY;
                let alias = `PROPERTY_${property.PROPERTY}`;

                fields[alias] = {
                    code: alias,
                    label: title,
                    title: title,
                    type: property.TYPE,
                };

                this.visibleColumns.push(alias);
            });

            this.fields = fields;
        },

        async onSubmit(filter) {
            console.log('Filter', filter);

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