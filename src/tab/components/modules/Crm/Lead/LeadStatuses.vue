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
                {code: 'SEMANTICS', label: 'Семантика'},
                {code: 'EXTRA', label: 'Дополнительно'},
                {code: 'SORT', label: 'Сортировка'},
            ],
        };
    },

    computed: {
        ...mapState({
            items: store => store.leadStatuses.items,
        }),
    },

    async mounted() {
        this.load();
        this.setBreadcrumb(['CRM', 'Справочники', 'Статусы лидов']);
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            load: 'leadStatuses/load',
        })
    }
};
</script>