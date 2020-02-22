import Lead from 'lib/entities/Crm/Lead';

export default {
    namespaced: true,
    state: {
        items: {},
    },
    mutations: {
        set(state, payload) {
            state.items = payload;
        }
    },
    actions: {
        async load({state, dispatch}) {
            if (Object.entries(state.items).length === 0) {
                dispatch('forceLoad');
            }
        },

        async forceLoad({commit}) {
            let fields = await Lead.getFields();
            commit('set', fields);
        }
    }
};