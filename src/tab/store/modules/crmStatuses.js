import mixin from './cachedItemsLoaderMixin';
import Status from 'lib/entities/Crm/Status';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: [],
    },

    getters: {
        getByEntityId: (state) => {
            console.log('init getter');

            return (entityId) => {
                console.log('inside');
                return state.items.filter(item => item.ENTITY_ID === entityId);
            }
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            return (await Status.load()).getAll();
        }),
    }
};
