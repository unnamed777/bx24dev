import CrmStatus from 'lib/entities/Crm/Status';
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
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            const statuses = await CrmStatus.load();
            return statuses.filterByEntityId('DEAL_STAGE');
        }),
    }
};
