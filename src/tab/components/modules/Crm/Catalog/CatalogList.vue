<template>
    <TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import TableList from 'components/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            tableColumns: [
                {code: 'ID', label: 'ID'},
                {code: 'NAME', label: 'Название'},
                {code: 'ORIGINATOR_ID', label: 'Внешний источник'},
                {code: 'ORIGIN_ID', label: 'Идентификатор в источнике данных'},
                {code: 'XML_ID', label: 'Внешний код'},
            ]
        };
    },

    computed: {
        tableItems() {
            return Object.values(this.catalogs).sort((a, b) => {
                return a.ID < b.ID ? -1 : 1;
            });
        },

        ...mapState({
            catalogs: state => state.crmCatalogs.items,
        }),
    },

    async mounted() {
        this.loadCatalogs();
        this.setBreadcrumb(['CRM', 'Каталоги']);
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadCatalogs: 'crmCatalogs/load',
        })
    }
};
</script>
