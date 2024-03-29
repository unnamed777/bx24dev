<template>
<div>
    <div class="mb-3">
        <button class="btn btn-light" @click="add()">Создать свойство</button>
        <button class="btn btn-light" @click.prevent="exportProps()">Экспорт</button>
    </div>
    <TableList
        :columns="tableColumns"
        :rowActions="tableRowActions"
        :items="tableItems"
    />
</div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import TableList from 'components/ui/TableList/BaseTableList.vue';
import EntityProperty from 'lib/entities/Entity/Property';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            tableColumns: [
                {code: 'PROPERTY', label: 'Код'},
                {code: 'NAME', label: 'Название'},
                {code: 'TYPE', label: 'Тип'},
                {code: 'SORT', label: 'Сортировка'},
            ],
            tableRowActions: [
                {
                    label: 'Изменить',
                    onClick: this.onChangeClick,
                },
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },
            ],
            properties: [],
        };
    },

    computed: {
        tableItems() {
            //const properties = cloneDeep(this.properties);
            const properties = [...this.properties];

            return properties.sort((a, b) => {
                if (a.SORT === b.SORT) {
                    return a.NAME < b.NAME ? -1 : 1;
                }

                return a.SORT - b.SORT;
            });
        },

        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.$store.state.entities.items[this.entityId];
        },

        ...mapGetters({
            getEntityById: 'entities/getById',
            getByEntityId: 'entityProperties/getByEntityId',
        }),
    },

    async mounted() {
        this.prepareData();
    },

    beforeRouteUpdate(to, from, next) {
        console.log('beforeRouteUpdate', this.entityId);
        next();
        this.prepareData();
    },

    methods: {
        async prepareData() {
            await this.loadEntities();
            await this.fillProperties();

            this.setBreadcrumb(['Хранилище', `${this.entity.NAME} (${this.entity.ENTITY})`, 'Свойства']);
        },

        async fillProperties() {
            await this.loadProperties(this.entityId);
            this.properties = this.getByEntityId(this.entityId);
        },

        async onChangeClick({row, index}) {
            this.$root.goToRoute({
                name: 'entityPropertyEdit',
                params: {
                    entityId: this.entity.ENTITY,
                    propertyCode: row.PROPERTY,
                },
            });
        },

        async onDeleteClick({row, index}) {
            if (!confirm(`Удалить свойство ${row.PROPERTY} из хранилища ${this.entity.ENTITY}?`)) {
                return;
            }

            await EntityProperty.delete({
                ENTITY: this.entity.ENTITY,
                PROPERTY: row.PROPERTY,
            });

            this.fillProperties();
        },

        add() {
            this.$root.goToRoute({
                name: 'entityPropertyAdd',
                params: {
                    entityId: this.entityId,
                },
            });
        },

        exportProps() {
            this.$root.goToRoute({
                name: 'console',
                params: {
                    method: EntityProperty.listEndpoint,
                    code: `{\n\tENTITY: '${this.entityId}'\n}`,
                },
            });
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
            // Always update properties
            loadProperties: 'entityProperties/reload',
        })
    }
};
</script>