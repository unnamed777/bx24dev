import EntityProperty from 'lib/entities/Entity/Property';
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
    actions: {
        async load({state, dispatch, commit}, payload) {
            if (state.isLoading === true) {
                return;
            }

            commit('setLoading', true);

            let result = (await EntityProperty.load({
                ENTITY: payload
            })).getAll();

            commit('set', result);
            commit('setLoading', false);
        },
        //...mixin.actions,

        /*forceLoad: mixin.helpers.makeForceLoad(async () => {
            const statuses = await CrmStatus.load();
            return statuses.filterByEntityId('STATUS');
        }),*/
    }
};
