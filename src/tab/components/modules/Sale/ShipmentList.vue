<template>
    <AbstractEntryList
        :loadEntries="loadEntries"
        :loadFieldsAction="'saleShipmentFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'orderId', 'statusId', 'dateInsert', 'deliveryId', 'priceDelivery']"
        :breadcrumb="['Интернет-магазин', 'Отгрузки']"
    />
</template>

<script>
import Shipment from 'lib/entities/Sale/Shipment';
import AbstractEntryList from 'components/modules/AbstractEntryList';

export default {
    components: {
        AbstractEntryList,
    },

    methods: {
        async loadEntries({sort, filter, page = 1}) {
            let collection = (await Shipment.load({
                order: sort,
                select: ['*'],
                filter: filter,
            }, {
                page: page,
            }));

            return {
                entries: collection.getAll(),
                total: collection.total,
            };
        },

        fieldsGetter($store) {
            return $store.state.saleShipmentFields.items;
        },
    }
};
</script>
