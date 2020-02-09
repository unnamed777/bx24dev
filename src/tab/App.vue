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
    <div>
        <div class="row mb-3">
            <div class="col">
                <div v-for="(tab, index) in apps">
                    <a
                        href="#"
                        class="d-block"
                        :class="activeAppId === index ? 'font-weight-bold' : null"
                        v-on:click.prevent="selectApp"
                        v-bind:data-id="index"
                    >
                        {{ tab.title }} / {{ tab.portal }}<br/>
                        <small>{{ tab.appUrl }}</small>
                    </a>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col">
                <button class="btn" v-on:click="refreshAuth">Refresh auth</button>
                <button class="btn" v-on:click="testCall">test</button>
                <button class="btn" v-on:click="showEntityList">entity.list</button>
            </div>
        </div>
        <EntityList v-if="activeModule === 'entityList'" v-bind:items="entityList"></EntityList>
    </div>
</template>
<script>
import BX24 from '../lib/BX24';
import EntityList from './EntityList.vue';

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
        }
    },

    components: {
        EntityList,
    },

    async mounted() {
        messageListener.subscribe('refreshAuth', this.onRefreshAuth.bind(this));

        let tabs = await browser.tabs.query({currentWindow: true});
        const apps = [];
        const regExp = /bitrix24\.ru\/marketplace\/app\//gi;
        const appFrameRegExp = /\?DOMAIN=.*APP_SID=/gi;

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
        }

        this.apps = apps;
    },

    methods: {
        async selectApp(e) {
            this.activeAppId = e.currentTarget.getAttribute('data-id') * 1;
            BX24.setAuth(await this.getAuth());
        },

        async getAuth() {
            const app = this.apps[this.activeAppId];
            let result;

            try {
                result = (await browser.tabs.executeScript(app.tabId, {
                    frameId: app.frameId,
                    //code: `(${tmpFunc.toString()})();`,
                    code: `
                        function refreshAuthHelper(auth) {
                            console.log(auth);
                            browser.runtime.sendMessage({
                                type: 'refreshAuth',
                                payload: auth,
                            });
                        }

                        function refreshAuthHelperTest(auth) {
                            let resolve, reject;
                            let promise = new Promise((_resolve, _reject) => { resolve = _resolve; });

                            return {
                                promise,
                                resolve,
                                reject
                            };
                        }

                        function testtt() {
                            console.log('testtt', arguments);
                        }

                        exportFunction(refreshAuthHelper, window, {defineAs: 'refreshAuthHelper'});
                        exportFunction(refreshAuthHelperTest, window, {defineAs: 'refreshAuthHelperTest', allowCrossOriginArguments: true});
                        //exportFunction(testtt, window, {defineAs: 'testtt', allowCrossOriginArguments: true});
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
                result = (await browser.tabs.executeScript(app.tabId, {
                    frameId: app.frameId,
                    //code: `(${tmpFunc.toString()})();`,
                    code: `/*(function () {
                        console.log('executeScript');
                        let {promise, resolve} = refreshAuthHelperTest();
                        window.wrappedJSObject.BX24.refreshAuth(resolve);
                        return promise;
                    })();*/

                    window.wrappedJSObject.BX24.refreshAuth(window.wrappedJSObject.refreshAuthHelper);
                    //window.wrappedJSObject.BX24.refreshAuth(window.wrappedJSObject.testtt);
                    `,
                }));
            } catch (ex) {
                alert('Ошибка получения авторизации из фрейма');
                console.error(ex);
                return;
            }

            console.log(result);
            return result;
        },

        async testCall() {
            console.log(await BX24.call('profile'));
        },

        async showEntityList() {
            this.entityList = await BX24.call('entity.get');
            this.activeModule = 'entityList';
        },

        onRefreshAuth({payload}) {
            BX24.setAuth(payload);
        }
    },

}
</script>
