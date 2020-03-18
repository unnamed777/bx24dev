<template>
<BaseTableList
    :columns="columns"
    :items="preparedItems"
    :rowActions="rowActions"
/>
</template>
<script>
import BaseTableList from './BaseTableList';
import {mapState, mapActions, mapMutations} from 'vuex';

export default {
    components: {
        BaseTableList,
    },

    props: {
        columns: {
            type: Array,

            validator(value) {
                return value.filter(item => !item).length === 0;
            }
        },
        items: Array,
        rowActions: Array,
        links: Object,
    },

    computed: {
        preparedItems() {
            const newItems = [];
            const registeredFieldTypes = this.$store.state.fieldTypes;

            for (let item of this.items) {
                let newItem = {};

                for (let column of this.columns) {
                    let value;

                    if (registeredFieldTypes[column.type]) {
                        console.log(registeredFieldTypes[column.type]);
                        value = this.$store.getters[`${registeredFieldTypes[column.type]}/getFormatted`](item[column.code]);

                        if (value === null) {
                            value = item[column.code];
                        }
                    } else {
                        value = item[column.code];
                    }

                    newItem[column.code] = value;
                }

                newItems.push(newItem);
            }

            return newItems;
        }
    },

    methods: {
        getUser(id) {
            if (!this.links.user) {
                return id;
            }

            // iD in User entity is string
            id = id.toString();
            const user = this.links.user.filter((item) => item.ID === id)[0];

            if (!user) {
                return id;
            }

            return `[${id}] ${user.FULL_NAME}`;
        }
    },
};
</script>