<template>
<TableList :columns="tableColumns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/ui/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            items: [],
            tableColumns: [
                {code: 'event', label: 'Событие'},
                {code: 'handler', label: 'Обработчик'},
                {code: 'auth_type', label: 'От имени'},
                {code: 'offline', label: 'Оффлайн'},
            ]
        };
    },

    computed: {
        tableItems() {
            return this.items.map((item) => {
                return {
                    ...item,
                    offline: item.offline ? '●' : '',
                };
            });
        },
    },

    async mounted() {
        this.prepareData();
    },

    methods: {
        async prepareData() {
            this.items = await BX24.fetch('event.get');
            this.setBreadcrumb(['События', 'Список']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
