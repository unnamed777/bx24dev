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
import Form from 'components/ui/Form';
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

        getEndpoint: {
            type: String,
            required: true
        },

        updateEndpoint: {
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
        const fieldFields = getFieldFields();
        fieldFields.find(item => item.code === 'FIELD_NAME').readOnly = true;

        return {
            formData: {
                FIELD_NAME: '',
                EDIT_FORM_LABEL: '',
                LIST_COLUMN_LABEL: '',
                LIST_FILTER_LABEL: '',
                XML_ID: '',
                USER_TYPE_ID: '',
                MANDATORY: '',
                MULTIPLE: '',
                SORT: 0,
                SHOW_IN_LIST: '',
                SHOW_FILTER: '',
                EDIT_IN_LIST: '',
            },
            form: {
                fields: fieldFields,
                buttons: [
                    {
                        type: 'cancel',
                        label: 'Отмена',
                        action: this.goToList,
                    },
                    {
                        type: 'submit',
                        label: 'Изменить',
                        action: this.save,
                    },
                ],
            },
        };
    },

    computed: {
        fieldId() {
            return this.$route.params.fieldId;
        },
    },

    async mounted() {
        await this.loadUserField();
        this.setBreadcrumb([...this.breadcrumb, `${this.getLangLabel('LIST_COLUMN_LABEL')} (${this.userField.FIELD_NAME})`]);
        this.fillFormData();
    },

    methods: {
        async loadUserField() {
            this.userField = await BX24.fetch(this.getEndpoint, {
                id: this.fieldId,
            });
        },

        getLangLabel(field) {
            if (typeof(this.userField[field]) === 'object') {
                return this.userField[field].ru || this.userField[field].en;
            } else {
                return this.userField[field];
            }
        },

        fillFormData() {
            for (let fieldCode of Object.keys(this.formData)) {
                if (['EDIT_FORM_LABEL', 'LIST_COLUMN_LABEL', 'LIST_FILTER_LABEL'].indexOf(fieldCode) !== -1) {
                    this.formData[fieldCode] = this.getLangLabel(fieldCode);
                } else {
                    this.formData[fieldCode] = this.userField[fieldCode];
                }
            }
        },

        async save() {
            let result;

            try {
                result = await BX24.call(this.updateEndpoint, {
                    id: this.fieldId,
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
            this.goToList();
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