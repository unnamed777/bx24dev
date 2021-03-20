<template>
<div class="row">
    <div class="col-6">
        <Form
            v-model="formData"
            :fields="form.fields"
            :ui="form.ui"
        />
        <div class="form-group row">
            <div class="col-12 d-flex justify-content-end">
                <button type="button" class="btn btn-primary" v-on:click="create">Создать</button>
            </div>
        </div>
        {{ formData }}
    </div>
</div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import Form from 'components/ui/Form.vue';
import getFieldFields from './getFieldFields';

export default {
    components: {
        Form,
    },

    props: {
        breadcrumb: {
            type: Array,
            required: true,
        },

        addEndpoint: {
            type: String,
            required: true
        },

        reloadFieldsAction: {
            type: String,
            required: true,
        },

        listRoute: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            formData: {
                MANDATORY: 'N',
                MULTIPLE: 'N',
                SORT: 100,
                SHOW_IN_LIST: 'Y',
                SHOW_FILTER: 'Y',
                EDIT_IN_LIST: 'Y',
            },
            form: {
                fields: getFieldFields(),
                ui: {
                    labelCols: 3,
                    valueCols: 9,
                }
            },
        };
    },

    async mounted() {
        this.setBreadcrumb(this.breadcrumb);
    },

    methods: {
        async create() {
            let result;

            try {
                result = await BX24.call(this.addEndpoint, {
                    fields: this.formData,
                });
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

            if (!result) {
                return;
            }

            await this.$store.dispatch(this.reloadFieldsAction);
            await this.$root.goToRoute({ name: this.listRoute });
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>