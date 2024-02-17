<template>
    <TableList :columns="columns" :items="tableItems"/>
</template>

<script>
import { mapMutations } from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/ui/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    props: {
        loadActionName: {
            type: String,
            required: true,
        },
        breadcrumb: {
            type: Array,
            required: true,
        },
        getter: {
            type: Function,
            required: true,
        },
    },

    data() {
        return {
            columns: [
                {code: 'code', label: 'Код'},
                {code: 'type', label: 'Тип'},
                {code: 'isImmutable', label: 'Неизменяемое'},
                {code: 'isReadOnly', label: 'Только для чтения'},
                {code: 'isRequired', label: 'Обязательное'},
            ],
        };
    },

    computed: {
        tableItems() {
            return Object.entries(this.getter(this.$store)).map( ([code, fields]) => ({ code, ...fields }));
        },
    },

    async mounted() {
        this.setBreadcrumb(this.breadcrumb);
        await this.$store.dispatch(this.loadActionName);
    },

    methods: {
        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
