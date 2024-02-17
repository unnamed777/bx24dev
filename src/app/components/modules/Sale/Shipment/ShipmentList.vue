<template>
    <AbstractEntryListPage
        :loadEntries="loadEntries"
        :loadFieldsAction="'saleShipmentFields/load'"
        :fieldsGetter="fieldsGetter"
        :visibleColumns="['id', 'orderId', 'statusId', 'dateInsert', 'deliveryId', 'priceDelivery']"
        :sortDefaultField="'id'"
        :breadcrumb="['Интернет-магазин', 'Отгрузки', 'Список']"
    />
</template>

<script>
import Shipment from 'lib/entities/Sale/Shipment';
import AbstractEntryListPage from 'components/modules/AbstractEntryListPage';

export default {
    components: {
        AbstractEntryListPage,
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
