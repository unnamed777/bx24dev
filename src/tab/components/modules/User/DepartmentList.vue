<template>
<FormattedTableList
    :columns="tableColumns"
    :items="tableItems"
/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import FormattedTableList from 'components/ui/TableList/FormattedTableList.vue';

export default {
    components: {
        FormattedTableList,
    },

    data() {
        return {
            items: [],
            tableColumns: [
                { code: 'ID', label: 'ID', type: 'integer' },
                { code: 'NAME', label: 'Название' },
                { code: 'PARENT', label: 'Родитель' },
                { code: 'UF_HEAD', label: 'Руководитель', type: 'user' },
                { code: 'SORT', label: 'Сортировка' },
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
        await this.prepareData();
    },

    methods: {
        async prepareData() {
            this.items = await BX24.fetch('department.get', {
                sort: {'ID': 'ASC'},
            });
            this.setBreadcrumb(['Пользователи', 'Подразделения']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
