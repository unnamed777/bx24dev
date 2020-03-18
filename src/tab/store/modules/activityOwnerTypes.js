import ActivityOwnerType from 'lib/entities/Crm/ActivityOwnerType';
import mixin from './cachedItemsLoaderMixin';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    getters: {
        getFormatted: (state) => (id) => {
            // noinspection EqualityComparisonWithCoercionJS
            const item = state.items.filter(item => item.ID == id)[0];

            if (!item) {
                return null;
            }

            return `[${item.ID}] ${item.NAME}`;
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            return (await ActivityOwnerType.load()).getAll();
        }),
    },
};