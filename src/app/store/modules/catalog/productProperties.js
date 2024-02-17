import ProductProperty from 'lib/entities/Catalog/ProductProperty';
import mixin from '../cachedItemsLoaderMixin';
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
        getByIblockId: (state) => (iblockId) => {
            return state.items[iblockId];
        },
    },

    actions: {
        async load({state, dispatch}, iblockId) {
            if (!state.items[iblockId]) {
                await dispatch('forceLoad', iblockId);
            }
        },

        async reload({dispatch}, iblockId) {
            await dispatch('forceLoad', iblockId);
        },

        async forceLoad({state, dispatch, commit}, iblockId) {
            if (state.isLoading === true) {
                return;
            }

            commit('setLoading', true);

            let result = (await ProductProperty.load({
                filter: {
                    iblockId: iblockId
                }
            })).getAll();

            commit('set', {
                key: iblockId,
                items: result
            });

            commit('setLoading', false);
        },
    }
};