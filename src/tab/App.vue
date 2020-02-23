<template>
<div class="container-fluid" style="height: calc(100%);">
    <div class="row">
        <div class="sidebar col-2 bg-light">
            <div class="mt-3 mb-3">
                <div v-for="(tab, index) in apps">
                    <a
                            href="#"
                            class="d-block"
                            :class="activeAppId === index ? 'font-weight-bold' : null"
                            :title="tab.appUrl"
                            :data-id="index"
                            v-on:click.prevent="onAppItemClick"
                    >
                        {{ tab.title }} / {{ tab.portal }}
                    </a>
                </div>
            </div>

            <SidebarMenu v-if="activeAppId !== null" :actions="{refreshAuth, showEntityList}"/>
        </div>
        <div class="col-10 pt-3">
            <nav aria-label="breadcrumb"  v-if="breadcrumb.length > 0">
                <ol class="breadcrumb bg-light">
                    <li class="breadcrumb-item" v-for="(item, index) in breadcrumb">
                        <template v-if="index === breadcrumb.length - 1">{{ item }}</template>
                        <template v-else><a href="#">{{ item }}</a></template>
                    </li>
                </ol>
            </nav>
            <EntityList v-if="activeModule === 'entityList'" v-bind:items="entityList"></EntityList>
            <TableList v-if="activeModule === 'tableList'" v-bind:fields="moduleData.fields" v-bind:items="moduleData.items"/>
            <Template v-bind:is="activeModule" v-if="activeModule"/>
            <router-view></router-view>
        </div>
    </div>
</div>
</template>
<script>
import {mapState, mapMutations} from 'vuex';
import BX24 from '../lib/BX24';
import messageListener from '../lib/MessageListener';
import EntityList from './components/EntityList.vue';
import TableList from './components/TableList.vue';
import SidebarMenu from './components/SidebarMenu/index.vue';
import CrmDealList from './components/modules/Crm/DealList.vue';
import CrmDealFields from './components/modules/Crm/DealFields.vue';
import CrmDealStages from './components/modules/Crm/DealStages.vue';
import CrmLeadList from './components/modules/Crm/LeadList.vue';
import CrmLeadFields from './components/modules/Crm/LeadFields.vue';
import CrmLeadStatuses from './components/modules/Crm/LeadStatuses.vue';
import CrmStatusTypes from './components/modules/Crm/StatusTypes.vue';
import CrmSources from './components/modules/Crm/Sources.vue';

export default {
    components: {
        EntityList,
        TableList,
        SidebarMenu,
        CrmDealList,
        CrmDealFields,
        CrmDealStages,
        CrmLeadList,
        CrmLeadFields,
        CrmLeadStatuses,
        CrmStatusTypes,
        CrmSources,
    },

    data() {
        return {
            apps: [],
            moduleData: {},
        }
    },

    computed: mapState({
        activeModule: state => state.activeModule,
        activeAppId: state => state.activeAppId,
        breadcrumb: state => state.breadcrumb,
    }),

    async mounted() {
        messageListener.init();
        messageListener.subscribe('refreshAuth', this.onRefreshAuth.bind(this));

        // We'll try to pre-select an app from a tab where the extension has been called
        const openerTabId = (await browser.tabs.getCurrent()).openerTabId;
        console.log('openerTabId', openerTabId);

        let tabs = await browser.tabs.query({currentWindow: true});
        const apps = [];
        let appIdToSelect = null;

        for (let tab of tabs) {
            if (/bitrix24\.ru\/marketplace\/app\//i.test(tab.url) === false) {
                continue;
            }

            let frames = await browser.webNavigation.getAllFrames({tabId: tab.id});
            let appFound = false;
            let frame;

            // Check app frame
            for (frame of frames) {
                if (/\?DOMAIN=.*APP_SID=/gi.test(frame.url) !== false) {
                    appFound = true;
                    break;
                }
            }

            if (appFound === false) {
                continue;
            }

            apps.push({
                tabId: tab.id,
                url: tab.url,
                portal: /\/\/(.*?)\//gi.exec(tab.url)[1],
                title: tab.title,
                frameId: frame.frameId,
                appUrl: frame.url,
            });

            if (openerTabId === tab.id) {
                appIdToSelect = apps.length - 1;
            }
        }

        this.apps = apps;

        if (appIdToSelect !== null) {
            this.selectApp(appIdToSelect);
        }

        window.BX24 = BX24;
    },

    methods: {
        onAppItemClick(e) {
            this.selectApp(e.currentTarget.getAttribute('data-id') * 1);
        },

        async selectApp(appId) {
            this.setActiveAppId(appId);
            this.getActiveAppAuth();
            //this.activeModule = 'CrmDealList';
        },

        async getActiveAppAuth() {
            const app = this.apps[this.activeAppId];
            let result;

            try {
                result = (await browser.tabs.executeScript(app.tabId, {
                    frameId: app.frameId,
                    code: `
                        function refreshAuthHelper(auth) {
                            console.log(auth);
                            browser.runtime.sendMessage({
                                type: 'refreshAuth',
                                payload: auth,
                            });
                        }

                        exportFunction(refreshAuthHelper, window, {defineAs: 'refreshAuthHelper'});

                        window.wrappedJSObject.BX24.getAuth();
                    `,
                }))[0];

            } catch (ex) {
                alert('Ошибка получения авторизации из фрейма');
                console.error(ex);
                return;
            }

            console.log('executeScript result', result);

            // If auth is failed (expired in app), try to refresh it
            if (result === false) {
                this.refreshAuth();
                return;
            }

            BX24.setAuth(result);

            if (this.$root.onReadyToRoute) {
                this.$root.onReadyToRoute();
            }
        },

        async refreshAuth() {
            const app = this.apps[this.activeAppId];

            // If b24 authorization is expired, this call will notify of problem
            this.refreshTimeout = setTimeout(this.onRefreshAuthFailed, 3000);

            try {
                browser.tabs.executeScript(app.tabId, {
                    frameId: app.frameId,
                    code: `window.wrappedJSObject.BX24.refreshAuth(window.wrappedJSObject.refreshAuthHelper);`,
                });
            } catch (ex) {
                alert('Ошибка получения авторизации из фрейма');
                console.error(ex);
            }
        },

        async testCall() {
            console.log(await BX24.call('profile'));
        },

        async showEntityList() {
            this.entityList = await BX24.call('entity.get');
            //this.activeModule = 'entityList';
            //this.breadcrumb = ['Хранилище данных'];
        },

        onRefreshAuth({payload}) {
            console.log('onRefreshAuth');
            clearTimeout(this.refreshTimeout);
            BX24.setAuth(payload);

            if (this.$root.onReadyToRoute) {
                this.$root.onReadyToRoute();
            }
        },

        onRefreshAuthFailed() {
            alert('Не удалось получить авторизацию. Попробуйте перезагрузить страницу с приложением Б24');
        },

        onClickSetModule(module) {
            return () => {
                //this.setActiveModule(module);
                this.$router.push({name: module});
            };
        },

        ...mapMutations({
            setActiveModule: 'setActiveModule',
            setActiveAppId: 'setActiveAppId'
        }),
    },

}
</script>

<style lang="scss">
html, body {
    height: 100%;
}
/*.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding: 48px 0 0;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}*/
.sidebar {
    position: sticky;
    top: 0;
    z-index: 1000;
    //height: calc(100vh/* - 4rem*/);
    height: 100%;
    min-height: 100vh;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.form-control:focus {
    border-color: #000;
    box-shadow: none !important;
}

.filter-item {
    $el: &;

    &__add-value-wrapper {
        position: absolute;
        top: 100%;
        left: 15px;
        right: 15px;
        display: none;
        line-height: 1em;
        opacity: 0.5;
        font-size: 70%;

        &:hover {
            opacity: 1;
        }
    }

    &:hover {
        #{$el}__add-value-wrapper {
            display: block;
        }
    }
}
</style>