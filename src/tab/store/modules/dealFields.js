import Deal from 'lib/entities/Crm/Deal';

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
            let fields = await Deal.getFields();
            commit('set', fields);
        }
    }
};