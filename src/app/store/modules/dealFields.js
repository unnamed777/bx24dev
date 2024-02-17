import Deal from 'lib/entities/Crm/Deal';
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
            return Deal.getFields({ reload: true });
        }),
    }
};