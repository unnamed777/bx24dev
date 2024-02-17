import ProductPropertyEnum from 'lib/entities/Catalog/ProductPropertyEnum';
import mixin from '../cachedItemsLoaderMixin';

export default {
    namespaced: true,
    state: {
        ...mixin.state,
        items: {},
    },

    getters: {
        getByPropertyId: (state) => (propertyId) => {
            return state.items.filter(item => item.propertyId === propertyId);
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            return (await ProductPropertyEnum.load()).getAll();
        }),
    }
};