import Catalog from 'lib/entities/Catalog/Catalog';
import mixin from '../cachedItemsLoaderMixin';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    getters: {
        getById: state => id => {
            return state.items.find(item => item.id === id);
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            let catalogs = await Catalog.load();
            let result = {};

            for (let catalog of catalogs) {
                result[catalog.id] = catalog;
            }

            return result;
        }),
    }
};
