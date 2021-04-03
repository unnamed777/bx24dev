<template>
<div>
    <div class="row mb-3">
        <div class="col-12 d-flex">
            <div>
                <button class="btn btn-light" @click="$root.goToRoute({ name: 'entityRightsAdd', params: { entityId } })">Добавить право</button>
            </div>
        </div>
    </div>
    <TableList
        :columns="tableColumns"
        :items="tableItems"
        :rowActions="rowActions"
    />
</div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import Entity from 'lib/entities/Entity/Entity';
import BX24 from 'lib/BX24';
import zipObject from 'lodash-es/zipObject';
import TableList from 'components/ui/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            rights: {},
            objectNames: {},
            tableColumns: [
                {code: 'object', label: 'Объект'},
                {code: 'right', label: 'Права'},
            ],
            rowActions: [
                {
                    label: 'Изменить',
                    onClick: this.onEditClick,
                },
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },
            ],
            tableItemIndex2Key: [],
        };
    },

    computed: {
        tableItems() {
            let result = [];

            for (let [object, rightId] of Object.entries(this.rights)) {
                result.push({
                    object: `[${object}] ${this.objectNames[object] || ''}`,
                    right: `[${rightId}] ${Entity.rightLabels[rightId]}`,
                });

                this.tableItemIndex2Key[result.length - 1] = object;
            }

            return result;
        },

        // It doesn't auto-update, use router events
        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.$store.state.entities.items[this.entityId];
        },

        ...mapState({
            properties: state => state.entityProperties.items,
        }),
    },

    async mounted() {
        await this.loadEntities();
        this.setBreadcrumb(['Хранилище', `${this.entity.NAME} (${this.entity.ENTITY})`, 'Права']);
        await this.loadRights();
    },

    methods: {
        async loadRights() {
            this.rights = await Entity.loadRights(this.entityId);
            let objectIds = Object.keys(this.rights);

            if (objectIds.length === 0) {
                return;
            }

            // What if there is more than 50 items?
            let objectNames = await BX24.fetch('access.name', {ACCESS: objectIds});
            this.objectNames = zipObject(Object.keys(objectNames), Object.values(objectNames).map(item => item.name));
        },

        async onEditClick({index, row}) {
            const object = this.tableItemIndex2Key[index];

            this.$root.goToRoute({
                name: 'entityRightsEdit',
                params: {
                    entityId: this.entityId,
                    object,
                },
            });
        },

        async onDeleteClick({index, row}) {
            const object = this.tableItemIndex2Key[index];

            if (!confirm(`Удалить право для ${row.object}?`)) {
                return;
            }

            const newRights = { ...this.rights };
            delete newRights[object];
            await Entity.setRights(this.entityId, newRights);
            await this.loadRights();
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
        })
    }
};
</script>