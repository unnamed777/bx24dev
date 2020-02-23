import BX24 from 'lib/BX24';
import mixin from './cachedItemsLoaderMixin';

export default {
    namespaced: true,
    state: {
        ...mixin.state,
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(() => {
            return BX24.call('crm.status.list', {
                order: {'SORT': 'ASC'},
                filter: {
                    'ENTITY_ID': 'DEAL_STAGE'
                }
            });
        }),
    }
};
