<template>
    <div>
        <TableList
            :columns="columns"
            :items="tableData"
        >
            <template v-slot:label="{ item, column }">
                {{ item.label }}

                <FieldEnumTableList
                    v-if="item.propertyType === 'L'"
                    :enums="Object.values(fields[item.code].values)"
                />
            </template>
        </TableList>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import Product from 'lib/entities/Crm/Product';
import TableList from 'components/ui/TableList/BaseTableList.vue';
import FieldEnumTableList from 'components/FieldEnumTableList.vue';

export default {
    components: {
        TableList,
        FieldEnumTableList,
    },

    props: {
        breadcrumb: Array,
        b24EditEntity: String,
        rawFields: Object,
        listEndpoint: String,
        reloadFieldsAction: String,
    },

    data() {
        return {
            tableRowActions: [],
            fields: {},
            items: [],
            userFields: {},
            columns: [
                {code: 'code', label: 'Код'},
                {code: 'label', label: 'Название'},
                {code: 'type', label: 'Тип'},
                {code: 'multiple', label: 'Множ'},
                {code: 'required', label: 'Обяз'},
            ],
        };
    },

    computed: {
        tableData() {
            return this.prepareFields(this.fields);
        },

        ...mapState({
            appData: state => state.appData,
        }),
    },

    async mounted() {
        await this.load();
        this.setBreadcrumb(['CRM', 'Каталоги', 'Товарный каталог', 'Поля']);
    },

    methods: {
        async load() {
            this.fields = await Product.getFields();
        },

        prepareFields(crmFields) {
            const items = [];

            const pushEnumValues = (fieldCode) => {
                const field = crmFields[fieldCode];

                let html = `
                    <div>
                        <table>
                            <tbody>
                                ${field.items.map((item) => {
                            return `
                                        <tr>
                                            <td>${item.ID}</td>
                                            <td>${item.VALUE}</td>
                                        </tr>
                                    `;
                        }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

                field.type = field.type + html;
            };

            for (let key in crmFields) {
                let field = crmFields[key];

                items.push({
                    code: key,
                    label: field.title,
                    type: field.propertyType ? field.propertyType : field.type,
                    sort: 10,
                    multiple: field.isMultiple ? '●' : '',
                    required: field.isRequired ? '●' : '',
                    propertyType: field.propertyType,
                    //...(field.values ? { values: field.values } : {})
                });
            }

            return items;
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
