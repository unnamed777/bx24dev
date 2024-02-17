import Shipment from 'lib/entities/Sale/Shipment';
import mixin from '../cachedItemsLoaderMixin';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(() => {
            return Shipment.getFields();
        }),
    }
};