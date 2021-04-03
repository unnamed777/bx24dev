<template>
    <div class="row">
        <div class="col-6">
            <Form
                v-model="formData"
                :fields="form.fields"
                :buttons="form.buttons"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import Entity from 'lib/entities/Entity/Entity';
import Form from 'components/ui/Form.vue';
import BaseInput from 'components/ui/BaseInput';

export default {
    components: {
        Form,
        BaseInput,
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
                        readOnly: false,
                    },
                    {
                        code: 'access',
                        label: 'Права',
                        type: 'enumeration',
                        items: Object.entries(Entity.rightLabels).map(item => ({ ID: item[0], VALUE: item[1] })),
                    },
                ],
                buttons: [
                    {
                        type: 'cancel',
                        label: 'Отмена',
                        action: this.goToList,
                    },
                    {
                        type: 'submit',
                        label: 'Создать',
                        action: this.create,
                    },
                ],
            },
        };
    },

    computed: {
        entityId() {
            return this.$route.params.entityId;
        },

        entity() {
            return this.$store.state.entities.items[this.entityId];
        },

        object() {
            return this.$route.params.object;
        },

        isNew() {
            return !this.object;
        },
    },

    async mounted() {
        await this.loadEntities();
        this.rights = await Entity.loadRights(this.entityId);
        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Права', this.isNew ? 'Добавить' : 'Изменить']);

        if (!this.isNew) {
            let value = this.form.fields.find(item => item.code === 'object').readOnly = true;

            this.formData = {
                object: this.object,
                access: this.rights[this.object],
            };
        }
    },

    methods: {
        async create() {
            if (this.isNew) {
                if (this.rights[this.formData.object]) {
                    alert(`Для ${this.formData.object} уже существует доступ ${this.rights[this.formData.object]}`);
                    return;
                }
            }

            if (!Entity.rightLabels[this.formData.access]) {
                alert(`Неизвестное право ${this.formData.access}`);
            }

            // Add object validation
            const newRights = { ...this.rights };
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

            this.goToList();
        },

        goToList() {
            this.$root.goToRoute({
                name: 'entityRights',
                params: {
                    entityId: this.entityId ,
                }
            });
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