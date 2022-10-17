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
                {code: 'id', label: 'ID'},
                {code: 'name', label: 'Название'},
                {code: 'productIblockId', label: 'Основной каталог'},
                {code: 'skuPropertyId', label: 'SKU property ID'},
            ]
        };
    },

    computed: {
        tableItems() {
            return Object.values(this.catalogs);
        },

        ...mapState({
            catalogs: state => state.catalogCatalogs.items,
        }),
    },

    async mounted() {
        this.setBreadcrumb(['Торговый каталог']);
        await this.loadCatalogs();
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadCatalogs: 'catalogCatalogs/load',
        })
    }
};
</script>
