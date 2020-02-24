<template>
<TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import Entity from 'lib/entities/Entity/Entity';
import BX24 from 'lib/BX24';
import zipObject from 'lodash/zipObject';
import TableList from 'components/TableList.vue';

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
            ]
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
            }

            return result;
        },

        // It doesn't auto-update, use router events
        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.getEntityById(this.entityId);
        },

        ...mapState({
            properties: state => state.entityProperties.items,
        }),

        ...mapGetters({
            getEntityById: 'entities/getById'
        }),
    },

    async mounted() {
        await this.loadEntities();
        this.setBreadcrumb(['Хранилище', `${this.entity.NAME} (${this.entity.ENTITY})`, 'Права']);
        this.loadRights();
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

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
        })
    }
};
</script>