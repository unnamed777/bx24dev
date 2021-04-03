<template>
<TableList :columns="columns" :items="items"/>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import TableList from 'components/ui/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            columns: [
                {code: 'ID', label: 'ID'},
                {code: 'STATUS_ID', label: 'STATUS_ID'},
                {code: 'NAME', label: 'Название'},
                {code: 'SORT', label: 'Сортировка'},
            ],
        };
    },

    computed: {
        ...mapState('dealStages', {
            items: store => store.items,
        }),
    },

    async mounted() {
        this.load();
        this.setBreadcrumb(['CRM', 'Справочники', 'Стадии сделки']);
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            load: 'dealStages/load',
        })
    }
};
</script>