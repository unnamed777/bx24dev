import Entity from 'lib/entities/Entity/Entity';
import mixin from './cachedItemsLoaderMixin';

export default {
    namespaced: true,

    state: {
        ...mixin.state,
        items: {},
    },

    getters: {
        getById: state => id => {
            return state.items.find(item => item.ENTITY === id);
        },
    },

    mutations: {
        ...mixin.mutations,
    },

    actions: {
        ...mixin.actions,

        forceLoad: mixin.helpers.makeForceLoad(async () => {
            let entities = await Entity.load();
            let result = {};

            for (let entity of entities) {
                result[entity.ENTITY] = entity;
            }

            return result;
        }),
    }
};