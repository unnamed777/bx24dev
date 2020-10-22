<template>
<TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            items: [],
            tableColumns: [
                {code: 'place', label: 'Место'},
            ]
        };
    },

    computed: {
        tableItems() {
            return this.items.map((item) => ({ place: item }));
        },
    },

    async mounted() {
        this.prepareData();
    },

    methods: {
        async prepareData() {
            this.items = await BX24.fetch('placement.list');
            this.setBreadcrumb(['Встраивание приложений', 'Места']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
