<template>
<div class="nav flex-column mb-4">
    <SidebarMenuItem v-for="(item, index) in items" v-bind:item="item" v-bind:key="index"></SidebarMenuItem>
</div>
</template>

<script>
import Entity from 'lib/entities/Entity/Entity';
import {mapState, mapActions} from 'vuex';
import SidebarMenuItem from './Item.vue';

export default {
    components: {
        SidebarMenuItem
    },

    props: {
        actions: Object,
    },

    data() {
        return {
            items: [
                /*{
                    label: 'test',
                    action: this.testCall,
                },*/
                {
                    label: 'Refresh auth',
                    action: this.refreshAuth,
                },
                {
                    id: 'entities',
                    label: 'Хранилище',
                    action: this.onEntitiesClick,
                    children: [
                        {label: 'Загрузка...'}
                    ],
                },
                {
                    label: 'CRM',
                    children: [
                        {
                            label: 'Лиды',
                            children: [
                                {
                                    label: 'Список',
                                    route: 'crmLeadList',
                                },
                                {
                                    label: 'Поля',
                                    route: 'crmLeadFields',
                                },
                                {
                                    label: 'Статусы',
                                    route: 'crmLeadStatuses',
                                }
                            ]
                        },
                        {
                            label: 'Сделки',
                            children: [
                                {
                                    label: 'Список',
                                    route: 'crmDealList',
                                },
                                {
                                    label: 'Поля',
                                    route: 'crmDealFields',
                                },
                                {
                                    label: 'Стадии',
                                    route: 'crmDealStages',
                                }
                            ]
                        },
                        {
                            label: 'Справочники',
                            children: [
                                {
                                    label: 'Типы',
                                    route: 'crmStatusTypes',
                                },
                                {
                                    label: 'Источники',
                                    route: 'crmSources',
                                },
                            ]
                        },
                    ]
                }
            ]
        };
    },

    computed: {
        itemsMap() {
            let queue = [...this.items];

            const map = {
                route: {},
                id: {},
            };

            for (let item of queue) {
                if (item.route) {
                    map.route[item.route] = item;
                }

                if (item.id) {
                    map.id[item.id] = item;
                }

                if (item.children) {
                    queue.push(...item.children);
                }
            }

            return map;
        },

        ...mapState({
            entities: store => store.entities.items,
        }),
    },

    watch: {
        entities() {
            this.rebuildEntitiesMenu();
        }
    },

    methods: {
        onEntitiesClick() {
            this.loadEntities();

            return {
                expand: true,
            };
        },

        rebuildEntitiesMenu() {
            const items = [];

            for (let entity of this.entities) {
                items.push({
                    id: `entity_${entity.ENTITY}`,
                    label: `${entity.NAME} (${entity.ENTITY})`,
                    children: [
                        {
                            label: 'Элементы',
                            route: {
                                name: 'entityList',
                                params: {
                                    entityId: entity.ENTITY
                                },
                            },
                        },
                        {
                            label: 'Свойства',
                            route: {
                                name: 'entityProperties',
                                params: {
                                    entityId: entity.ENTITY
                                },
                            },
                        },
                        {
                            label: 'Права',
                            route: {
                                name: 'entityRights',
                                params: {
                                    entityId: entity.ENTITY
                                },
                            },
                        },
                    ],
                });
            }

            this.itemsMap.id.entities.children = items;
        },

        ...mapActions({
            loadEntities: 'entities/load',
        })
    }
}
</script>

<style lang="scss">
.sidebar {
    .nav-link {
        $el: &;
        position: relative;
        color: #333;

        &:hover {
            color: #000;
        }

        &--children {
            &:before {
                position: absolute;
                left: 0px;

                content: '▶︎';
                color: #555555;
                font-size: 0.7rem;
                line-height: 1.5rem;
                transition: transform ease 0.2s;
            }
        }

        &--expanded {
            &.nav-link--children:before {
                transform: rotate(90deg);
            }
        }
    }

    .nav-item {
        &__submenu {
            display: none;

            &--expanded {
                display: block;
            }
        }
    }
}
</style>
