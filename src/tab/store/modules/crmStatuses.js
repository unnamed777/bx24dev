import mixin from './cachedItemsLoaderMixin';
import Status from 'lib/entities/Crm/Status';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: [],
    },

    getters: {
        getByEntityId: (state) => (entityId) => {
            return state.items.filter(item => item.ENTITY_ID === entityId);
        },

        getFormatted: (state) => ({field, value}) => {
            // noinspection EqualityComparisonWithCoercionJS
            const item = state.items.filter(item => item.ENTITY_ID === field.statusType && item.STATUS_ID == value)[0];

            if (!item) {
                return null;
            }

            return `[${item.STATUS_ID}] ${item.NAME}`;
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            console.log('load crmStatuses');
            return (await Status.load()).getAll();
        }),
    }
};
