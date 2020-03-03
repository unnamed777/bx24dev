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
            formData: {},
            form: {
                fields: [
                    {
                        code: 'object',
                        label: 'Объект',
                        type: 'string',
                    },
                    {
                        code: 'access',
                        label: 'Права',
                        type: 'enumeration',
                        items: Object.entries(Entity.rightLabels).map(item => ({ ID: item[0], VALUE: item[1] })),
                    },
                ],
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
        this.rights = await Entity.loadRights(this.entityId);
        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Права', 'Добавить']);
    },

    methods: {
        async create() {
            if (this.rights[this.formData.object]) {
                alert(`Для ${this.formData.object} уже существует доступ ${this.rights[this.formData.object]}`);
                return;
            }

            if (!Entity.rightLabels[this.formData.access]) {
                alert(`Неизвестное право ${this.formData.access}`);
            }

            // Add object validation
            const newRights = {...this.rights};
            newRights[this.formData.object] = this.formData.access;

            try {
                let result = await Entity.setRights(this.entityId, newRights);

                if (!result) {
                    return;
                }
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

            this.$router.push({ name: 'entityRights', params: { entityId: this.entityId } });
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