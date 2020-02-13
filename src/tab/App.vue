<!--<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

-->
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

            <div class="nav flex-column" v-if="activeAppId !== null">
                <a class="nav-link" href="#" v-on:click.prevent="refreshAuth">Refresh auth</a>
                <a class="nav-link" href="#" v-on:click.prevent="testCall">test</a>
                <a class="nav-link" href="#" v-on:click.prevent="showEntityList">entity.list</a>
                <a class="nav-link" href="#" v-on:click.prevent="crmLeadFields">crm.lead.fields</a>
                <a class="nav-link" href="#" v-on:click.prevent="crmDealFields">crm.deal.fields</a>
                <a class="nav-link" href="#" v-on:click.prevent="crmStatusTypes">crm: справочник / типы</a>
                <a class="nav-link" href="#" v-on:click.prevent="crmDealStages">crm: справочник / стадии сделок</a>
            </div>
        </div>
        <div class="col-10 pt-3">
            <div class="row mb-3" v-if="activeAppId !== null && breadcrumb.length > 0">
                <div class="col">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb bg-light">
                            <li class="breadcrumb-item" v-for="(item, index) in breadcrumb">
                                <template v-if="index === breadcrumb.length - 1">{{ item }}</template>
                                <template v-else><a href="#">{{ item }}</a></template>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <EntityList v-if="activeModule === 'entityList'" v-bind:items="entityList"></EntityList>
            <FieldList v-if="activeModule === 'crmDealFields'" v-bind:items="crmDealFields"></FieldList>
            <FieldList v-if="activeModule === 'crmLeadFields'" v-bind:items="crmLeadFields"></FieldList>
            <table-list v-if="activeModule === 'tableList'" v-bind:fields="moduleData.fields" v-bind:items="moduleData.items"></table-list>
        </div>
    </div>
</div>
</template>
<script>
import BX24 from '../lib/BX24';
import EntityList from './EntityList.vue';
import FieldList from './FieldList.vue';
import TableList from './TableList.vue';

const messageListener = {
    init() {
        this.subscribers = {};

        browser.runtime.onMessage.addListener(this.onMessage.bind(this));
    },

    onMessage(message) {
        if (message.type) {
            this.notify(message);
        }
    },

    subscribe(type, callback) {
        if (!this.subscribers[type]) {
            this.subscribers[type] = [];
        }

        this.subscribers[type].push(callback);
        return this.subscribers[type].length - 1;
    },

    notify({type, payload}) {
        if (!this.subscribers[type]) {
            return;
        }

        this.subscribers[type].forEach(func => func({type, payload}));
    }
};

messageListener.init();

export default {
    data() {
        return {
            apps: [],
            activeAppId: null,
            activeModule: null,
            breadcrumb: [],
            moduleData: {},
        }
    },

    components: {
        EntityList,
        FieldList,
        TableList,
    },

    async mounted() {
        messageListener.subscribe('refreshAuth', this.onRefreshAuth.bind(this));

        // We'll try to pre-select an app from a tab where the extension has been called
        const openerTabId = (await browser.tabs.getCurrent()).openerTabId;
        console.log('openerTabId', openerTabId);

        let tabs = await browser.tabs.query({currentWindow: true});
        const apps = [];
        const regExp = /bitrix24\.ru\/marketplace\/app\//gi;
        const appFrameRegExp = /\?DOMAIN=.*APP_SID=/gi;
        let appIdToSelect = null;

        for (let tab of tabs) {
            if (regExp.test(tab.url) === false) {
                continue;
            }

            let frames = await browser.webNavigation.getAllFrames({tabId: tab.id});
            let appFound = false;
            let frame;

            for (frame of frames) {
                if (appFrameRegExp.test(frame.url) !== false) {
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
            this.activeAppId = appId;
            BX24.setAuth(await this.getAuth());
        },

        async getAuth() {
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

            console.log(result);
            return result;
        },

        async refreshAuth() {
            const app = this.apps[this.activeAppId];
            let result;

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
            this.activeModule = 'entityList';
            this.breadcrumb = ['Хранилище данных'];
        },

        onRefreshAuth({payload}) {
            console.log('onRefreshAuth');
            BX24.setAuth(payload);
        },

        async crmLeadFields() {
            this.crmLeadFields = await BX24.call('crm.lead.fields');
            this.activeModule = 'crmLeadFields';
            this.breadcrumb = ['CRM', 'Лид', 'Поля'];
            console.log(this.crmLeadFields);
        },

        async crmDealFields() {
            this.crmDealFields = await BX24.call('crm.deal.fields');
            this.activeModule = 'crmDealFields';
            this.breadcrumb = ['CRM', 'Сделка', 'Поля'];
            console.log(this.crmDealFields);
        },

        async crmStatusTypes() {
            let result = await BX24.call('crm.status.entity.types');

            this.breadcrumb = ['CRM', 'Справочники', 'Типы'];

            this.moduleData = {
                fields: [
                    {code: 'ID', label: 'ID'},
                    {code: 'NAME', label: 'Сущность'},
                ],
                items: result
            };

            this.activeModule = 'tableList';
            console.log(this.moduleData);
        },

        async crmDealStages() {
            let result = await BX24.call('crm.status.list', {
                order: {'SORT': 'ASC'},
                filter: {
                    'ENTITY_ID': 'DEAL_STAGE'
                }
            });

            console.log(result);

            this.breadcrumb = ['CRM', 'Справочники', 'Стадии сделки'];

            this.moduleData = {
                fields: [
                    {code: 'ID', label: 'ID'},
                    {code: 'STATUS_ID', label: 'STATUS_ID'},
                    {code: 'NAME', label: 'Название'},
                    {code: 'SORT', label: 'Сортировка'},
                ],
                items: result
            };

            this.activeModule = 'tableList';
        },
    },

}
</script>

<style>
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
    height: calc(100vh/* - 4rem*/);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar .nav-link {
    color: #333;
}

.sidebar .nav-link:hover {
    color: #000;
}
</style>