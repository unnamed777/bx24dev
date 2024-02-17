import EntityProperty from 'lib/entities/Entity/Property';
import mixin from './cachedItemsLoaderMixin';
import Vue from 'vue';

export default {
    namespaced: true,
    state: {
        ...mixin.state,
        items: {},
    },

    mutations: {
        ...mixin.mutations,

        set(state, payload) {
            Vue.set(state.items, payload.key, payload.items);
        },
    },

    getters: {
        getByEntityId: (state) => (entityId) => {
            return state.items[entityId];
        },
    },

    actions: {
        async load({state, dispatch}, entityId) {
            if (!state.items[entityId]) {
                await dispatch('forceLoad', entityId);
            }
        },

        async reload({dispatch}, entityId) {
            await dispatch('forceLoad', entityId);
        },

        async forceLoad({state, dispatch, commit}, entityId) {
            // add key?
            if (state.isLoading === true) {
                return;
            }

            commit('setLoading', true);

            let result = (await EntityProperty.load({
                ENTITY: entityId
            })).getAll();

            commit('set', {
                key: entityId,
                items: result
            });

            commit('setLoading', false);
        },
    }
};
