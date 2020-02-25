<template>
<div class="nav flex-column mb-4">
    <SidebarMenuItem
        v-for="(item, index) in items"
        :item="item"
        :key="item._id"
        :ref="`item_${item._id}`"
    />
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
        const items = [
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
                                route: this.getPath('crmLeadList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('crmLeadFields'),
                            },
                            {
                                label: 'Статусы',
                                route: this.getPath('crmLeadStatuses'),
                            }
                        ]
                    },
                    {
                        label: 'Сделки',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('crmDealList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('crmDealFields'),
                            },
                            {
                                label: 'Стадии',
                                route: this.getPath('crmDealStages'),

                            }
                        ]
                    },
                    {
                        label: 'Справочники',
                        children: [
                            {
                                label: 'Типы',
                                route: this.getPath('crmStatusTypes'),
                            },
                            {
                                label: 'Источники',
                                route: this.getPath('crmSources'),
                            },
                        ]
                    },
                ]
            },
            {
                label: 'События',
                children: [
                    {
                        label: 'Список',
                        route: this.getPath('eventList'),
                    },
                ]
            },
            {
                label: 'Placement',
                children: [
                    {
                        label: 'Список',
                        route: this.getPath('placementList'),
                    },
                    {
                        label: 'Места',
                        route: this.getPath('placementTypes'),
                    },
                ]
            },
        ];

        this.assignInternalIds(items);

        return {
            items,
        };
    },

    computed: {
        itemsMap() {
            let queue = [...this.items];

            const map = {
                route: {},
                id: {},
                _id: {},
                _rel: {},
            };

            for (let item of queue) {
                if (item.route) {
                    map.route[item.route] = item;
                }

                if (item.id) {
                    map.id[item.id] = item;
                }

                if (item._id) {
                    map._id[item._id] = item;
                }

                if (item.children) {
                    item.children.forEach(child => {
                        map._rel[child._id] = item._id;
                    });

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
        items() {
            console.log('items changed');
        },

        entities() {
            this.rebuildEntitiesMenu();
        },

        $route(value) {
            let path = value.path;
            const item = this.itemsMap.route[path];

            if (!item) {
                console.log('Menu item not found');
                return;
            }

            let nextId = item._id;
            let parents = [];

            while (undefined !== (nextId = this.itemsMap._rel[nextId])) {
                parents.push(nextId);
            }

            parents = parents.reverse();
            console.log('Expand menu', parents);
            let menuItem = this.$refs[`item_${parents[0]}`][0];

            for (let i = 1; i <= parents.length; i++) {
                console.log('current item', menuItem, parents[i - 1]);
                menuItem.toggle(true);
                console.log('Get next parent', parents[i]);

                if (i !== parents.length) {
                    menuItem = menuItem.$refs[`item_${parents[i]}`][0];
                }
            }
        }
    },

    methods: {
        onEntitiesClick() {
            this.loadEntities();

            if (this.$router.currentRoute.name !== 'entityList') {
                this.$router.push({name: 'entityList'});
            }

            return {
                expand: true,
            };
        },

        getPath(route, params) {
            return this.$router.resolve({
                name: route,
                params,
            }).route.path;
        },

        rebuildEntitiesMenu() {
            const items = [];

            // Routes are translates into links.
            // It's needed to match sidebar items with current route and expand them.
            for (let entity of this.entities) {
                items.push({
                    id: `entity_${entity.ENTITY}`,
                    label: `${entity.NAME} (${entity.ENTITY})`,
                    children: [
                        {
                            label: 'Элементы',
                            route: this.getPath('entityList', { entityId: entity.ENTITY }),
                        },
                        {
                            label: 'Свойства',
                            route: this.getPath('entityProperties', { entityId: entity.ENTITY }),
                        },
                        {
                            label: 'Права',
                            route: this.getPath('entityRights', { entityId: entity.ENTITY }),
                        },
                    ],
                });
            }

            items.push({
                label: 'Добавить...',
                route: {
                    name: 'entityAdd',
                }
            });

            this.assignInternalIds(items);

            this.itemsMap.id.entities.children = items;
        },

        assignInternalIds(items) {
            let queue = [...items];

            if (!this.internalCounter) {
                this.internalCounter = 0;
            }

            for (let item of queue) {
                if (!item._id) {
                    item._id = ++this.internalCounter;
                }

                if (item.children) {
                    queue.push(...item.children);
                }
            }
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
                top: 1rem;
                left: 0px;
                width: 8px;
                height: 8px;

                content: '';
                opacity: 0.6;
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAuUlEQVRIie2VTQrCMBQGBwXrKRQ9jIJ6JGs9kf3xBp5C0UsI2q1uGiwlafPSt+jCgWxnSL5F4M9QOAMf5VPUA3PgrSgvgWXzFkfFQGJ7pgi4KcgfwNQWAFgrBHYuuSHvIc+65AAz4BUgL4GFTwDgEBCIfeUgH7x1WBeSwbdSuSHzkKehcugeXDSsi7glsO8rB5gAV4v8TsCwLlaWwEZLbkhr8pO2HH6Di4YdCwJPYARcaHwmmkTVGQ5fXWTJ42kvaCYAAAAASUVORK5CYII=');
                background-size: 100% 100%;
                transform: rotate(-90deg);
                transition: transform ease 0.2s;
            }
        }

        &--expanded {
            &.nav-link--children:before {
                transform: rotate(0deg);
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

    // wide items. Refactor
    .nav {
        margin-left: -15px;
        margin-right: -15px;
    }

    //$leftPadding: 0.5rem;
    --left-padding: 1rem;
    --shift: 1rem;
    --icon-space: 1rem;
    --level: 0;

    .nav-link {
        padding-left: calc(var(--left-padding) + var(--icon-space) + var(--level) * var(--shift));

        &--children::before {
            left: calc(var(--left-padding) + var(--icon-space) + (var(--level) - 1) * var(--shift));
        }
    }

    .nav-item__submenu {
        --level: 1;

        .nav-item__submenu {
            --level: 2;

            .nav-item__submenu {
                --level: 3;
            }
        }
    }


    .router-link-exact-active {
        background-color: #eceef2;
    }

}
</style>
