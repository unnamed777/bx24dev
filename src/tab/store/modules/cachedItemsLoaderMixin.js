export default {
    state: {
        items: {},
        isLoading: false,
    },
    mutations: {
        set(state, payload) {
            state.items = payload;
        },

        setLoading(state, payload) {
            state.isLoading = !!payload;
        }
    },
    actions: {
        async load({state, dispatch}) {
            if (Object.entries(state.items).length === 0) {
                await dispatch('forceLoad');
            }
        },

        async reload({dispatch}) {
            await dispatch('forceLoad');
        },
    },

    helpers: {
        makeForceLoad(loadData) {
            return async function ({state, commit}) {
                if (state.isLoading === true) {
                    return;
                }

                commit('setLoading', true);

                let result = await loadData();

                commit('set', result);
                commit('setLoading', false);
            };
        },

    }
};