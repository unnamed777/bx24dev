import Product from "lib/entities/Catalog/Product";
import mixin from "../cachedItemsLoaderMixin";

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    mutations: {
        ...mixin.mutations,

        set(state, payload) {
            state.items[payload.key] = payload.items;
        },
    },

    getters: {
        getByIblockId: (state) => (iblockId) => {
            return state.items[iblockId];
        },
    },

    actions: {
        async load({ state, dispatch }, { iblockId, productType }) {
            if (!state.items[iblockId]) {
                await dispatch('forceLoad', { iblockId, productType });
            }
        },

        async reload({ dispatch }, { iblockId, productType }) {
            await dispatch('forceLoad', iblockId, productType);
        },

        async forceLoad({ state, dispatch, commit }, { iblockId, productType }) {
            if (state.isLoading === true) {
                return;
            }

            commit('setLoading', true);

            let result = await Product.loadFields({
                iblockId: iblockId,
                productType: productType,
            });

            // Let's hope we won't need productType
            commit('set', {
                key: iblockId,
                items: result
            });

            commit('setLoading', false);
        },
    }
};