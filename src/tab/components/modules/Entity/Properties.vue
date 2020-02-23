<template>
<TableList :columns="columns" :items="tableItems"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import TableList from 'components/TableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            columns: [
                {code: 'PROPERTY', label: 'Код'},
                {code: 'NAME', label: 'Название'},
                {code: 'TYPE', label: 'Тип'},
                {code: 'SORT', label: 'Сортировка'},
            ]
        };
    },

    computed: {
        tableItems() {
            return this.properties.sort((a, b) => {
                if (a.SORT === b.SORT) {
                    return a.NAME < b.NAME ? -1 : 1;
                }

                return a.SORT - b.SORT;
            });
        },

        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.getEntityById(this.$route.params.entityId);
        },

        ...mapState({
            properties: state => state.entityProperties.items,
        }),

        ...mapGetters({
            getEntityById: 'entities/getById'
        }),
    },

    async mounted() {
        this.prepareData();
    },

    beforeRouteUpdate(to, from, next) {
        console.log('beforeRouteUpdate', this.entityId);
        next();
        this.prepareData();
    },

    methods: {
        async prepareData() {
            await this.loadEntity(this.entityId);
            await this.loadProperties(this.entityId);
            this.setBreadcrumb(['Хранилище', `${this.entity.NAME} (${this.entity.ENTITY})`, 'Свойства']);
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntity: 'entities/load',
            loadProperties: 'entityProperties/load',
        })
    }
};
</script>