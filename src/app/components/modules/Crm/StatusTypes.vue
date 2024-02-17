<template>
    <div>
        <RichTableList
            :items="items"
            :availableColumns="availableColumns"
            :visibleColumns="visibleColumns"
            :rowActions="rowActions"
        />
        <ModalSlider
            v-if="itemStatuses"
            :width="800"
            @close="onModalStatusesClose"
        >
            <div class="p-3">
                <h3>Статусы {{ modalItem.NAME }} ({{ modalItem.ID }})</h3>
                <table class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>
                                STATUS_ID
                                <div class="header-column-code text-muted">STATUS_ID</div>
                            </th>
                            <th>
                                Название
                                <div class="header-column-code text-muted">NAME</div>
                            </th>
                            <th>
                                Сортировка
                                <div class="header-column-code text-muted">SORT</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="status of itemStatuses">
                            <td>{{ status.STATUS_ID }}</td>
                            <td>{{ status.NAME }}</td>
                            <td>{{ status.SORT }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ModalSlider>
    </div>
</template>

<script>
import BX24 from 'lib/BX24';
import TableList from 'components/ui/TableList/BaseTableList.vue';
import RichTableList from '../../ui/TableList/RichTableList.vue';
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import ModalSlider from 'components/ui/ModalSlider';

export default {
    data() {
        return {
            columns: [],
            items: [],
            availableColumns: [],
            visibleColumns: [],
            rowActions: [
                {
                    code: 'showCard',
                    label: 'Посмотреть',
                    //onClick: this.onShowClick,
                },
                {
                    code: 'showStatuses',
                    label: 'Статусы',
                    onClick: this.onStatusesClick,
                },
            ],
            modalItem: null,
            itemStatuses: null,
        };
    },

    components: {
        RichTableList,
        ModalSlider,
    },

    async mounted() {
        this.setBreadcrumb(['CRM', 'Справочники']);
        let result = await BX24.call('crm.status.entity.types');

        this.availableColumns = [
            {code: 'ID', label: 'ID'},
            {code: 'NAME', label: 'Название'},
            {code: 'ENTITY_TYPE_ID', label: 'Тип сущности'},
            {code: 'PARENT_ID', label: 'Родитель'},
            {code: 'PREFIX', label: 'Префикс'},
            {code: 'FIELD_ATTRIBUTE_SCOPE'},
            {code: 'CATEGORY_ID'},
            {code: 'SEMANTIC_INFO'},
        ];

        this.visibleColumns = ['ID', 'NAME', 'ENTITY_TYPE_ID', 'PARENT_ID', 'PREFIX'];

        this.items = result;
    },

    methods: {
        async onStatusesClick({ index, row }) {
            this.itemStatuses = await BX24.call('crm.status.entity.items', {
                entityId: row.ID,
            });

            this.modalItem = row;
        },

        onModalStatusesClose() {
            this.itemStatuses = null;
            this.modalItem = null;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
