/**
 * @typedef {Object} ConsoleHistoryItem
 * @property {String} method
 * @property {String} data
 */

export default {
    namespaced: true,

    state: {
        items: [],
    },

    getters: {
    },

    mutations: {
        add(state, payload) {
            state.items.unshift(payload);
        },

        remove(state, index) {
            state.items = [
                ...state.items.slice(0, index),
                ...state.items.slice(index + 1),
            ];
        },
    },

    actions: {
        /**
         *
         * @param state
         * @param commit
         * @param {ConsoleHistoryItem} payload
         */
        addToHistory({ state, commit }, payload) {
            let index = state.items.findIndex((item) => {
                return item.method === payload.method && item.data === payload.data;
            });

            if (index !== -1) {
                commit('remove', index);
            }

            commit('add', payload);
        },
    },
};