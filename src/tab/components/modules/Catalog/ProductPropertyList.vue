<template>
<div>
    <TableList
        :columns="tableColumns"
        :rowActions="tableRowActions"
        :items="tableItems"
    />

    <ModalSlider
        v-if="isItemCardOpened"
        :width="800"
        @close="onItemCardClose"
    >
        <div class="p-3">
            <h3>Запись детально</h3>
            <table class="table table-sm table-hover">
                <tbody>
                    <tr v-for="field in propertyFields">
                        <td class="mr-2 align-top" style="width: 30%;">
                            <div style="line-height: 1em;">{{ field.label }}</div>
                            <div class="text-muted" style="font-size: 60%">{{ field.code }}</div>
                        </td>
                        <td class="align-middle" style="line-height: 1em;">
                            <span v-if="cardItem[field.code]">{{ cardItem[field.code] }}</span>
                            <span v-else class="text-muted">null</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ModalSlider>
</div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import TableList from 'components/ui/TableList/BaseTableList.vue';
import ModalSlider from 'components/ui/ModalSlider';

export default {
    components: {
        TableList,
        ModalSlider,
    },

    data() {
        return {
            tableColumns: [
                {code: 'id', label: 'ID'},
                {code: 'code', label: 'Код'},
                {code: 'name', label: 'Название'},
                {code: 'propertyType', label: 'Тип'},
                {code: 'userType', label: 'Польз. тип'},
                {code: 'isRequired', label: 'Обяз.'},
                {code: 'multiple', label: 'Множ.'},
                {code: 'sort', label: 'Сортировка'},
            ],
            tableRowActions: [
                {
                    code: 'showCard',
                    label: 'Посмотреть',
                    onClick: this.onShowClick,
                },
                /*{
                    label: 'Изменить',
                    onClick: this.onChangeClick,
                },
                {
                    label: 'Удалить',
                    onClick: this.onDeleteClick,
                },*/
            ],
            items: [],
            isItemCardOpened: false,
            cardItem: null,
        };
    },

    computed: {
        tableItems() {
            const items = [...this.items];

            return items.sort((a, b) => {
                if (a.sort === b.sort) {
                    return a.id < b.id ? -1 : 1;
                }

                return a.sort - b.sort;
            });
        },

        iblockId() {
            return this.$route.params.iblockId;
        },

        catalog() {
            return this.$store.state.catalogCatalogs.items[this.iblockId];
        },

        propertyFields() {
            return this.$store.state.catalogProductPropertyFields.items;
        },

        ...mapGetters({
            getByIblockId: 'catalogProductProperties/getByIblockId',
        }),
    },

    async mounted() {
        await this.prepareData();
    },

    beforeRouteUpdate(to, from, next) {
        next();
        this.prepareData();
    },

    methods: {
        async prepareData() {
            await this.loadCatalogs();
            await this.loadPropertyFields();
            await this.fillProperties();

            this.setBreadcrumb(['Торговый каталог', `${this.catalog.name}`, 'Свойства']);
        },

        async fillProperties() {
            await this.loadProductProperties(this.iblockId);
            this.items = this.getByIblockId(this.iblockId);
        },

        onShowClick({row, index}) {
            this.cardItem = this.items[index];
            this.isItemCardOpened = true;
        },

        onItemCardClose() {
            this.isItemCardOpened = false;
        },

        /*async onChangeClick({row, index}) {
            this.$root.goToRoute({
                name: 'catalogProductPropertyEdit',
                params: {
                    iblockId: this.catalog.id,
                    id: row.id,
                },
            });
        },*/

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadCatalogs: 'catalogCatalogs/load',
            loadPropertyFields: 'catalogProductPropertyFields/load',
            // Always update properties
            loadProductProperties: 'catalogProductProperties/reload',
        })
    }
};
</script>