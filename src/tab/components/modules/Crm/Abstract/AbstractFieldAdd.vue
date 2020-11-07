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
            formData: {},
            form: {
                fields: [
                    {
                        code: 'FIELD_NAME',
                        label: 'Код поля',
                        type: 'string',
                    },
                    {
                        code: 'EDIT_FORM_LABEL',
                        label: 'Название в форме',
                    },
                    {
                        code: 'LIST_COLUMN_LABEL',
                        label: 'Название в списке',
                    },
                    {
                        code: 'XML_ID',
                        label: 'XML ID',
                    },
                    {
                        code: 'USER_TYPE_ID',
                        type: 'enumeration',
                        label: 'Тип',
                        items: [
                            { ID: 'string', VALUE: 'Строка (string)' },
                            { ID: 'integer', VALUE: 'Целое число (integer)' },
                            { ID: 'double', VALUE: 'Число (double)' },
                            { ID: 'boolean', VALUE: 'Да/нет (boolean)' },
                            { ID: 'datetime', VALUE: 'Дата/Время' },
                            { ID: 'date', VALUE: 'Дата' },
                        ],
                    },
                    {
                        code: 'MANDATORY',
                        type: 'enumeration',
                        label: 'Обязательное',
                        items: [
                            { ID: 'Y', VALUE: 'Да' },
                            { ID: 'N', VALUE: 'Нет' },
                        ],
                    },
                    {
                        code: 'MULTIPLE',
                        type: 'enumeration',
                        label: 'Множественное',
                        items: [
                            { ID: 'Y', VALUE: 'Да' },
                            { ID: 'N', VALUE: 'Нет' },
                        ],
                    },
                    {
                        code: 'SORT',
                        label: 'Сортировка',
                    },
                ],
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
            await this.$router.push({ name: this.listRoute });
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>