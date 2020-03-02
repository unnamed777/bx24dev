import Lead from 'lib/entities/Crm/Lead';
import mixin from './cachedItemsLoaderMixin';
import Deal from "../../../lib/entities/Crm/Deal";

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(() => {
            return Lead.getFields();
        }),
    }
};