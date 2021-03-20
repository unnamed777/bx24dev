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
import EntityItem from 'lib/entities/Entity/Item';
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

                result = await EntityItem.add(this.entityId, this.formData);

                if (!result) {
                    return;
                }
            } catch (ex) {
                console.error(ex);
                alert(ex.toString());
            }

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