<template>
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
                    <!-- buttons -->
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
import GetListForm from 'components/ui/GetListForm.vue';
import RichTableList from 'components/TableList/RichTableList.vue';
import PageNavigation from 'components/ui/PageNavigation.vue';

export default {
    components: {
        GetListForm,
        RichTableList,
        PageNavigation,
    },

    props: {
        loadEntries: {
            type: Function,
            required: true,
        },

        loadFieldsAction: {
            type: String,
            required: true,
        },

        fieldsGetter: {
            type: Function,
            required: true,
        },

        visibleColumns: {
            type: Array,
            required: true,
        },

        breadcrumb: {
            type: Array,
            required: true,
        },

    },

    data() {
        return {
            items: [],
            filter: {},
            sort: {},
            currentPage: 1,
            totalPages: 0,
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

        fields() {
            let fields = this.fieldsGetter(this.$store);

            if (Object.entries(fields).length === 0) {
                console.warn('fieldsGetter() returns no fields');
            }

            return fields;
        },
    },

    watch: {
        breadcrumb() {
            this.setBreadcrumb(this.breadcrumb);
        }
    },

    async mounted() {
        // noinspection ES6MissingAwait
        this.$store.dispatch(this.loadFieldsAction);
        this.setBreadcrumb(this.breadcrumb);
    },

    methods: {
        async onSubmit() {
            this.currentPage = 1;

            await this.loadEntriesWrapper();
        },

        async loadEntriesWrapper() {
            let result = await this.loadEntries({
                sort: this.sort,
                filter: this.filter,
                page: this.currentPage,
            });

            this.items = result.entries;
            // @todo Get rid of 50
            this.totalPages = Math.ceil(result.total / 50);
        },

        onFormChange({filter, sort}) {
            this.filter = filter;
            this.sort = sort;
        },

        onPageChange(page) {
            this.currentPage = page;
            this.loadEntriesWrapper();
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
