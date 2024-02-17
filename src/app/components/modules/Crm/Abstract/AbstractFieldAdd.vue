<template>
<div class="row">
    <div class="col-6">
        <Form
            v-model="formData"
            :fields="form.fields"
            :ui="form.ui"
            :buttons="form.buttons"
        />
        <div>Превью:</div>
        <pre>{{ formData }}</pre>
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
                buttons: [
                    {
                        type: 'cancel',
                        label: 'Отмена',
                        action: this.goToList,
                    },
                    {
                        type: 'submit',
                        label: 'Сохранить',
                        action: this.create,
                    },
                ],
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
                alert('Ошибка сохранения поля\n' + ex);
            }

            if (!result) {
                return;
            }

            await this.$store.dispatch(this.reloadFieldsAction);
            await this.goToList();
        },

        goToList() {
            return this.$root.goToRoute({ name: this.listRoute });
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>