<template>
<div class="nav flex-column">
    <template v-for="(item, index) in items">
        <SidebarMenuItem
            v-if="!item.hidden"
            :item="item"
            :key="item._id"
            :ref="`item_${item._id}`"
            v-on="item.onToggle ? { toggle: item.onToggle } : {}"
        />
    </template>
</div>
</template>

<script>
import {mapState, mapActions} from "vuex";
import SidebarMenuItem from "./Item.vue";

export default {
    components: {
        SidebarMenuItem
    },

    props: {
        actions: Object,
    },

    data() {
        const items = [
            {
                id: 'console',
                label: 'Консоль',
                route: this.getPath('console'),
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
                id: 'crm',
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
                        label: 'Компании',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('crmCompanyList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('crmCompanyFields'),
                            },
                        ]
                    },
                    {
                        label: 'Контакты',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('crmContactList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('crmContactFields'),
                            },
                        ]
                    },
                    {
                        label: 'Счета',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('crmInvoiceList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('crmInvoiceFields'),
                            },
                            {
                                label: 'Статусы',
                                route: this.getPath('crmInvoiceStatuses'),
                            },
                            {
                                label: 'Типы плательщиков',
                                route: this.getPath('crmInvoicePersonTypeList'),
                            }
                        ]
                    },
                    {
                        label: 'Дела',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('crmActivityList'),
                            },
                            {
                                label: 'Типы',
                                //route: this.getPath('crmDealFields'),
                            },
                        ]
                    },
                    {
                        id: 'crmCatalogs',
                        label: 'Каталоги',
                        action: this.onCrmCatalogsClick,
                        children: [
                            {label: 'Загрузка...'}
                        ],
                    },
                    /*{
                        id: 'crmSmartProcesses',
                        label: 'Смарт-процессы',
                        action: this.onCrmSmartProcessesClick,
                        children: [
                            {label: 'Загрузка...'}
                        ],
                    },*/
                    {
                        label: 'Справочники',
                        route: this.getPath('crmStatusTypes'),
                    },
                ]
            },
            {
                id: 'sale',
                label: 'Интернет-магазин',
                children: [
                    {
                        label: 'Заказы',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('saleOrderList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('saleOrderFieldList'),
                            },
                        ],
                    },
                    {
                        label: 'Оплаты',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('salePaymentList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('salePaymentFieldList'),
                            },
                        ],
                    },
                    {
                        label: 'Отгрузки',
                        children: [
                            {
                                label: 'Список',
                                route: this.getPath('saleShipmentList'),
                            },
                            {
                                label: 'Поля',
                                route: this.getPath('saleShipmentFieldList'),
                            },
                        ],
                    },
                ]
            },
            {
                id: 'catalog',
                label: 'Торговый каталог',
                onToggle: this.onCatalogToggle,
                children: [
                    {label: 'Загрузка...'}
                ],
            },
            {
                id: 'users',
                label: 'Пользователи',
                children: [
                    {
                        label: 'Поля',
                        route: this.getPath('userFieldList'),
                    },
                    {
                        label: 'Подразделения',
                        route: this.getPath('departmentList'),
                    },
                ]
            },
            {
                id: 'events',
                label: 'События',
                children: [
                    {
                        label: 'Список',
                        route: this.getPath('eventList'),
                    },
                ]
            },
            {
                id: 'placements',
                label: 'Встраивание приложений',
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
            {
                id: 'info',
                label: 'Информация',
                route: this.getPath('info'),
            },
        ];

        items.map(item => item.hidden = false);
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
            crmCatalogs: store => store.crmCatalogs.items,
            catalogCatalogs: store => store.catalogCatalogs.items,
            crmSmartProcesses: store => store.crmSmartProcesses.items,
            scope: store => store.scope,
        }),
    },

    inject: ['resolveRoute', 'goToRoute'],

    watch: {
        items() {
        },

        entities() {
            this.rebuildEntitiesMenu();
        },

        crmCatalogs() {
            this.rebuildCrmCatalogsMenu();
        },

        crmSmartProcesses() {
            this.rebuildCrmSmartProcessesMenu();
        },

        catalogCatalogs() {
            this.rebuildCatalogCatalogsMenu();
        },

        scope() {
            this.hideUnavailableModules();
        },

        $route(value) {
            // Do nothing if index page is opened. It will redirect anyway.
            if (value.name === 'index') {
                return;
            }

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

            if (parents.length > 0) {
                let menuItem = this.$refs[`item_${parents[0]}`][0];

                for (let i = 1; i <= parents.length; i++) {
                    // console.log('current item', menuItem, parents[i - 1]);
                    menuItem.toggle(true);
                    // console.log('Get next parent', parents[i]);

                    if (i !== parents.length) {
                        menuItem = menuItem.$refs[`item_${parents[i]}`][0];
                    }
                }
            }
        }
    },

    mounted() {
        this.hideUnavailableModules();
    },

    methods: {
        hideUnavailableModules() {
            let itemToScope = {
                'entities': 'entity',
                'crm': 'crm',
                'users': 'user',
                'events': 'event',
                'placements': 'placement',
                'sale': 'sale',
                'catalog': 'catalog',
            };

            for (let [itemId, scopeCode] of Object.entries(itemToScope)) {
                this.itemsMap.id[itemId].hidden = this.scope.indexOf(scopeCode) === -1;
            }
        },

        onEntitiesClick() {
            this.loadEntities();

            if (this.$router.currentRoute.name !== 'entityList') {
                this.goToRoute({name: 'entityList'});
            }

            return {
                expand: null,
            };
        },

        onCrmCatalogsClick() {
            this.loadCrmCatalogs();

            if (this.$router.currentRoute.name !== 'crmCatalogList') {
                this.goToRoute({name: 'crmCatalogList'});
            }

            return {
                expand: null,
            };
        },

        onCatalogToggle(state) {
            if (this.catalogCatalogs.length > 0) {
                return;
            }

            this.loadCatalogCatalogs();

            return {
                expand: null,
            };
        },

        onCrmSmartProcessesClick() {
            this.loadSmartProcesses();

            /*if (this.$router.currentRoute.name !== 'crmCatalogList') {
                this.goToRoute({name: 'crmCatalogList'});
            }*/

            return {
                expand: null,
            };
        },

        getPath(route, params = {}) {
            return this.resolveRoute(route, params);
        },

        rebuildEntitiesMenu() {
            const items = [];

            // Routes are translated into links.
            // It's needed to match sidebar items with current route and expand them.
            for (let entity of Object.values(this.entities)) {
                items.push({
                    id: `entity_${entity.ENTITY}`,
                    label: `${entity.NAME} (${entity.ENTITY})`,
                    children: [
                        {
                            label: 'Элементы',
                            route: this.getPath('entityItemList', { entityId: entity.ENTITY }),
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

        rebuildCrmCatalogsMenu() {
            const items = [];

            // Routes are translated into links.
            // It's needed to match sidebar items with current route and expand them.
            for (let catalog of Object.values(this.crmCatalogs)) {
                items.push({
                    id: `crmCatalog_${catalog.ID}`,
                    label: `${catalog.NAME} (${catalog.ID})`,
                    children: [
                        {
                            label: 'Товары',
                            route: this.getPath('crmProductList', { catalogId: catalog.ID }),
                        },
                        {
                            label: 'Поля товаров',
                            route: this.getPath('crmProductFieldList', { catalogId: catalog.ID }),
                        },
                        {
                            label: 'Разделы',
                            route: this.getPath('crmProductSectionList', { catalogId: catalog.ID }),
                        },
                        {
                            label: 'Дерево',
                            route: this.getPath('crmProductSectionTree', { catalogId: catalog.ID }),
                        },
                    ],
                });
            }

            this.assignInternalIds(items);

            this.itemsMap.id.crmCatalogs.children = items;
        },

        rebuildCrmSmartProcessesMenu() {
            const items = [];

            // Routes are translated into links.
            // It's needed to match sidebar items with current route and expand them.
            for (let smartProcess of Object.values(this.crmSmartProcesses)) {
                items.push({
                    id: `crmSmartProcess_${smartProcess.id}`,
                    label: `${smartProcess.title} (${smartProcess.entityTypeId})`,
                    children: [
                        /*{
                            label: 'Товары',
                            route: this.getPath('crmProductList', { catalogId: catalog.ID }),
                        },
                        {
                            label: 'Поля товаров',
                            route: this.getPath('crmProductFieldList', { catalogId: catalog.ID }),
                        },
                        {
                            label: 'Разделы',
                            route: this.getPath('crmProductSectionList', { catalogId: catalog.ID }),
                        },
                        {
                            label: 'Дерево',
                            route: this.getPath('crmProductSectionTree', { catalogId: catalog.ID }),
                        },*/
                    ],
                });
            }

            this.assignInternalIds(items);

            this.itemsMap.id.crmSmartProcesses.children = items;
        },

        rebuildCatalogCatalogsMenu() {
            const items = [
                {
                    id: 'catalogCatalogsAll',
                    label: 'Список',
                    route: this.getPath('catalogCatalogList'),
                }
            ];

            // Routes are translated into links.
            // It's needed to match sidebar items with current route and expand them.
            for (let catalog of Object.values(this.catalogCatalogs)) {
                let item = {
                    id: `catalogCatalogs_${catalog.id}`,
                    label: `${catalog.name} (${catalog.id})`,
                    children: [
                        {
                            label: 'Товары',
                            route: this.getPath('catalogProductList', { iblockId: catalog.id }),
                        },
                        {
                            label: 'Свойства',
                            route: this.getPath('catalogProductPropertyList', { iblockId: catalog.id }),
                        },
                    ],
                };

                if (!catalog.productIblockId) {
                    item.children.push({
                        label: 'Разделы',
                        route: this.getPath('catalogSectionList', { iblockId: catalog.id }),
                    });

                    item.children.push({
                        label: 'Дерево',
                        route: this.getPath('catalogSectionTree', { iblockId: catalog.id }),
                    });
                }

                items.push(item);
            }

            this.assignInternalIds(items);

            this.itemsMap.id.catalog.children = items;
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
            loadCrmCatalogs: 'crmCatalogs/load',
            loadSmartProcesses: 'crmSmartProcesses/load',
            loadCatalogCatalogs: 'catalogCatalogs/load',
        })
    }
}
</script>

<style lang="scss">
.sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    height: 100%;
    min-height: calc(100vh);
    max-height: 100vh;
    overflow-y: auto;

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

    .nav {
        margin-left: -15px;
        margin-right: -15px;

        min-height: calc(
            100vh
            /* height of app info block */
            - (1.2rem * 1.5 + 0.7rem * 1.5 + 1rem)
            /* github height + its vertical margins */
            - (26px + 15px + 15px)
        );
    }

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