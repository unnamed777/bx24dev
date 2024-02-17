import ProductSection from 'lib/entities/Crm/ProductSection';
import mixin from './cachedItemsLoaderMixin';

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
            return ProductSection.getFields();
        }),
    }
};