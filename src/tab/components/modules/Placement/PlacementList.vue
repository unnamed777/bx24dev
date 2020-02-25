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
                {code: 'placement', label: 'Место'},
                {code: 'handler', label: 'Обработчик'},
                {code: 'title', label: 'Название'},
                {code: 'description', label: 'Описание'},
            ]
        };
    },

    computed: {
        tableItems() {
            return this.items;
        },
    },

    async mounted() {
        this.prepareData();
    },

    methods: {
        async prepareData() {
            this.items = await BX24.fetch('placement.get');
            this.setBreadcrumb(['Placement', 'Места']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
