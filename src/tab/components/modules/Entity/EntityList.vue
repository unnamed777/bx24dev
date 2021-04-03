<template>
<TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import TableList from 'components/ui/TableList/BaseTableList.vue';

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
            return Object.values(this.entities).sort((a, b) => {
                return a.ENTITY < b.ENTITY ? -1 : 1;
            });
        },

        ...mapState({
            entities: state => state.entities.items,
        }),
    },

    async mounted() {
        await this.loadEntities();
        this.setBreadcrumb(['Хранилище', 'Список']);
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
        })
    }
};
</script>
