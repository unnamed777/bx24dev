<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'dealFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['ID', 'TITLE', 'OPPORTUNITY', 'STAGE_ID']"
        :breadcrumb="['CRM', 'Сделки', 'Список']"
    />
</template>

<script>
import Deal from 'lib/entities/Crm/Deal';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Deal.load({
                order: sort,
                filter: filter,
            }, {
                page: page,
            }));

            return {
                entries: collection.getAll(),
                total: collection.total,
            };
        },

        fieldsGetter($store) {
            return $store.state.dealFields.items;
        },
    }
};
</script>
<!--<template>
<div>
    <div class="row">
        <div class="col-10">
            <GetListForm
                :fields="fields"
                @change="onFormChange"
                @submit="onSubmit"
            />
        </div>
        <div class="col-2 d-flex justify-content-end">
            <div>
            </div>
        </div>
    </div>

    <div v-if="items.length > 0">
        <PageNavigation
            v-if="totalPages > 1"
            :total="totalPages"
            :current="currentPage"
            @change="onPageChange"
        />

        <div style="max-width: 100%; overflow-x: scroll;">
            <RichTableList
                :availableColumns="availableColumns"
                :visibleColumns="visibleColumns"
                :items="items"
                :hasSettings="true"
            />
        </div>

        <PageNavigation
            v-if="totalPages > 1"
            :total="totalPages"
            :current="currentPage"
            @change="onPageChange"
        />
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { getFieldLabel } from 'lib/functions';
import Deal from 'lib/entities/Crm/Deal';
import GetListForm from 'components/ui/GetListForm.vue';
import RichTableList from 'components/TableList/RichTableList.vue';
import PageNavigation from 'components/ui/PageNavigation.vue';
import entriesPageNavMixin from 'mixins/entriesPageNavMixin';

export default {
    components: {
        GetListForm,
        RichTableList,
        PageNavigation,
    },

    mixins: [entriesPageNavMixin],

    data() {
        return {
            items: [],
            visibleColumns: ['ID', 'TITLE', 'OPPORTUNITY', 'STAGE_ID'],
            filter: {},
            sort: {},
        };
    },

    computed: {
        availableColumns() {
            return Object.values(this.fields).map(item => ({
                code: item.field,
                label: getFieldLabel(item),
                ...item
            }));
        },

        ...mapState({
            fields: state => state.dealFields.items,
        }),
    },

    async mounted() {
        window.aaa = this;
        // noinspection ES6MissingAwait
        this.loadFields();
        this.setBreadcrumb(['CRM', 'Сделки', 'Список']);
    },

    methods: {
        onSubmit() {
            this.currentPage = 1;
            this.loadEntries();
        },

        async loadEntries() {
            let collection = (await Deal.load({
                order: this.sort,
                filter: this.filter,
            }, {
                page: this.currentPage,
            }));

            this.items = collection.getAll();
            this.totalPages = Math.ceil(collection.total / Deal.PAGE_SIZE);
        },

        onFormChange({filter, sort}) {
            this.filter = filter;
            this.sort = sort;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadFields: 'dealFields/load',
        })
    }
};
</script>-->