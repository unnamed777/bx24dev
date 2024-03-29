<template>
<div v-if="formData" class="row">
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
import EntityProperty from 'lib/entities/Entity/Property';
import Form from 'components/ui/Form.vue';

export default {
    components: {
        Form,
    },

    data() {
        return {
            formData: {},
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
                        label: 'Изменить',
                        action: this.save,
                    },
                ],
            },
        };
    },

    computed: {
        entityId() {
            return this.$route.params.entityId;
        },

        propertyCode() {
            return this.$route.params.propertyCode;
        },

        entity() {
            return this.$store.state.entities.items[this.entityId];
        },

        property() {
            const properties = this.$store.state.entityProperties.items[this.entityId];

            if (!properties) {
                return [];
            }

            return properties.filter((item) => item.PROPERTY === this.propertyCode)[0];
        },
    },

    watch: {
        $route() {
            //this.remount();
        }
    },

    async mounted() {
        await this.loadEntities();
        this.form.fields = Object.values(await EntityProperty.getFields());

        await this.loadProperties(this.entityId);
        this.formData = {
            ...JSON.parse(JSON.stringify(this.property)),
            ENTITY: this.entity.ENTITY,
        };

        this.setBreadcrumb();
    },

    methods: {
        async save() {
            let result;

            const newData = { ...this.formData };

            if (newData.PROPERTY !== this.property.PROPERTY) {
                newData.PROPERTY_NEW = newData.PROPERTY;
                newData.PROPERTY = this.property.PROPERTY;
            }

            try {
                result = await EntityProperty.update(newData);
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

            if (result !== true) {
                return;
            }

            this.goToList();
        },

        setBreadcrumb() {
            this.applyBreadcrumb([
                {
                    text: 'Хранилище',
                    route: 'entityList',
                },
                {
                    text: this.entity.NAME,
                    route: 'entityItemList',
                    params: { entityId: this.entityId },
                },
                {
                    text: 'Свойства',
                    route: 'entityPropertyEdit',
                    params: { entityId: this.entityId },
                },
                this.property.NAME
            ]);
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
            applyBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
            loadProperties: 'entityProperties/load',
        })
    }
};
</script>