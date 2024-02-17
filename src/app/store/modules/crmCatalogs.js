import Catalog from 'lib/entities/Crm/Catalog';
import mixin from './cachedItemsLoaderMixin';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    getters: {
        getById: state => id => {
            return state.items.find(item => item.ENTITY === id);
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
                result[catalog.ID] = catalog;
            }

            return result;
        }),
    }
};