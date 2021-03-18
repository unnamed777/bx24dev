<template>
    <BaseTableList
        :columns="columns"
        :items="preparedItems"
        :rowActions="rowActions"
    >
        <template v-for="(_, slot) in $slots">
            <template :slot="slot">
              <slot :name="slot"></slot>
            </template>
        </template>

        <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="slotProps">
            <slot :name="slot" v-bind="slotProps" />
        </template>
    </BaseTableList>
</template>
<script>
import BaseTableList from './BaseTableList';
import preloadFieldTypeValuesMixin from 'mixins/preloadFieldTypeValuesMixin';

export default {
    components: {
        BaseTableList,
    },

    mixins: [preloadFieldTypeValuesMixin],

    props: {
        columns: {
            type: Array,

            validator(value) {
                return value.filter(item => !item).length === 0;
            }
        },

        items: Array,
        rowActions: Array,
    },

    data() {
        return {
            valuesPreloaded: false,
        };
    },

    computed: {
        preparedItems() {
            if (!this.isFieldTypeValuesLoaded) {
                return [];
            }

            const newItems = [];
            const registeredFieldTypes = this.$store.state.fieldTypes;

            for (let item of this.items) {
                let newItem = {};

                for (let column of this.columns) {
                    let value;

                    if (registeredFieldTypes[column.type]) {
                        value = this.$store.getters[`${registeredFieldTypes[column.type]}/getFormatted`]({
                            field: column,
                            value: item[column.code],
                        });

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

    watch: {
        async columns() {
            await this.preloadFieldTypeValues(this.columns);
        }
    },

    async mounted() {
        await this.preloadFieldTypeValues(this.columns);
    },
};
</script>