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
    },

    async mounted() {
        await this.loadEntities();
        this.form.fields = Object.values(await EntityProperty.getFields());
        this.form.fields.find(item => item.code === 'ENTITY').readOnly = true;
        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Свойства', 'Новое']);
    },

    methods: {
        async create() {
            let result;

            try {
                result = await EntityProperty.add(this.formData);
            } catch (ex) {
                console.error(ex);
                alert('Ошибка при создании свойства\n' + ex);
            }

            if (result !== true) {
                return;
            }

            await this.reloadEntities();
            this.goToList();
        },

        goToList() {
            return this.$root.goToRoute({
                name: 'entityProperties',
                params: {
                    entityId: this.entityId,
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