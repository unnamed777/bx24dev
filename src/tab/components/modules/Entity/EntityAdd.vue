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
import Entity from 'lib/entities/Entity/Entity';
import BX24 from 'lib/BX24';
import Form from 'components/ui/Form.vue';
//import TableList from 'components/TableList.vue';

export default {
    components: {
        Form,
        //TableList,
    },

    data() {
        return {
            formData: {},
            form: {
                fields: [
                    {
                        code: 'ENTITY',
                        label: 'Идентификатор хранилища',
                        type: 'string',
                    },
                    {
                        code: 'NAME',
                        label: 'Название',
                    }
                ],
                ui: {
                    labelCols: 3,
                    valueCols: 9,
                }
            },
        };
    },

    async mounted() {
        await this.loadEntities();
        this.setBreadcrumb(['Хранилище', 'Добавить']);
        //this.loadRights();
    },

    methods: {
        async create() {
            let result;

            try {
                result = await Entity.add(this.formData);
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

            if (result !== true) {
                return;
            }

            await this.reloadEntities();
            this.$root.goToRoute({name: 'entityList'});
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
            reloadEntities: 'entities/reload',
        })
    }
};
</script>