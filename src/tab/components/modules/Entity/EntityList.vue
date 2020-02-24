<template>
<TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import TableList from 'components/TableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            tableColumns: [
                {code: 'ENTITY', label: 'Идентификатор'},
                {code: 'NAME', label: 'Название'},
            ]
        };
    },

    computed: {
        tableItems() {
            return this.entities.sort((a, b) => {
                return a.ENTITY < b.ENTITY ? -1 : 1;
            });
        },

        ...mapState({
            entities: state => state.entities.items,
        }),
    },

    async mounted() {
        await this.loadEntities();
    },

    methods: {
        async prepareData() {
            await this.loadEntities();
            this.setBreadcrumb(['Хранилище', 'Список']);
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
