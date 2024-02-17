import User from 'lib/entities/User';
import mixin from './cachedItemsLoaderMixin';

export default {
    namespaced: true,
    state: {
        ...mixin.state,
        items: [],
    },

    mutations: {
        ...mixin.mutations,
    },

    getters: {
        getFormatted: (state) => ({value}) => {
            // noinspection EqualityComparisonWithCoercionJS
            const user = state.items.filter(item => item.ID == value)[0];

            if (!user) {
                return null;
            }

            return `[${user.ID}] ${user.FULL_NAME}`;
        },
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            return (await User.load()).getAll();
        }),
    }
};
