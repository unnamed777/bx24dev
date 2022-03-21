import SmartProcess from 'lib/entities/Crm/SmartProcess';
import mixin from '@/tab/store/modules/cachedItemsLoaderMixin';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    getters: {
        getById: state => id => {
            return state.items.find(item => item.id === id);
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            let smartProcesses = await SmartProcess.load();
            let result = {};
            console.log(smartProcesses);

            for (let smartProcess of smartProcesses) {
                result[smartProcess.id] = smartProcess;
            }

            return result;
        }),
    }
};