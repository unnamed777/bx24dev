<template>
<TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/TableList/TableList.vue';

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
            this.setBreadcrumb(['Placement', 'Места']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
