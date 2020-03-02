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
    </div>
</div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import Entity from 'lib/entities/Entity/Entity';
import EntityProperty from 'lib/entities/Entity/Property';
import BX24 from 'lib/BX24';
import Form from 'components/ui/Form.vue';

export default {
    components: {
        Form,
    },

    data() {
        return {
            formData: {
                ENTITY: this.$route.params.entityId,
            },
            form: {
                fields: [],
                ui: {
                    labelCols: 3,
                    valueCols: 9,
                }
            },
        };
    },

    computed: {
        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.getEntityById(this.$route.params.entityId);
        },

        ...mapGetters({
            getEntityById: 'entities/getById'
        }),
    },

    async mounted() {
        await this.loadEntities();
        this.form.fields = Object.values(await EntityProperty.getFields());
        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Свойства', 'Новое']);
    },

    methods: {
        async create() {
            let result;

            try {
                result = await EntityProperty.add(this.formData);
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

            if (result !== true) {
                return;
            }

            await this.reloadEntities();
            this.$router.push({ name: 'entityProperties', params: { entityId: this.entityId } });
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