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
import EntityItem from 'lib/entities/Entity/Item';
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
                        label: 'Сохранить',
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

        properties() {
            return this.$store.state.entityProperties.items[this.entityId];
        },

    },

    async mounted() {
        window.testComponent = this;
        await this.loadEntities();
        await this.loadProperties(this.entityId);
        this.mergedFields = await EntityItem.getMergedFields(this.entityId, this.properties);

        this.form.fields = Object.values(this.mergedFields)
            .filter((item) => !item.isReadOnly)
            .sort((a, b) => a.sort - b.sort);

        this.setBreadcrumb(['Хранилище', this.entity.NAME, 'Элементы', 'Новый']);
    },

    methods: {
        async create() {

            try {
                let result;
                let formData = { ...this.formData };
                formData.PROPERTY_VALUES = {};

                for (let key of Object.keys(formData)) {
                    if (key === 'PROPERTY_VALUES' || key.indexOf('PROPERTY_') !== 0) {
                        continue;
                    }

                    let code = key.substr(9);
                    formData.PROPERTY_VALUES[code] = formData[key];
                    delete formData[key];
                }

                result = await EntityItem.add(this.entityId, formData);

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
                name: 'entityItemList',
                params: { entityId: this.entityId },
                query: { autoload: true }
            });
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

        ...mapActions({
            loadEntities: 'entities/load',
            reloadEntities: 'entities/reload',
            loadProperties: 'entityProperties/load',
        })
    }
};
</script>