import ProductProperty from 'lib/entities/Catalog/ProductProperty';
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
            return ProductProperty.getFields({ reload: true });
        }),
    }
};