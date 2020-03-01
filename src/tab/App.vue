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

            <SidebarMenu v-if="activeAppId !== null" :actions="{refreshAuth}"/>
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
            <Template v-bind:is="activeModule" v-if="activeModule"/>
            <router-view></router-view>
        </div>
    </div>
</div>
</template>
<script>
import {mapState, mapMutations} from 'vuex';
import BX24 from '../lib/BX24';
//import messageListener from '../lib/MessageListener';
import SidebarMenu from './components/SidebarMenu/index.vue';
import testOauthApp from '../../.secret.js';

export default {
    components: {
        SidebarMenu,
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

    watch: {
        $route(newValue) {
            console.log('route changed', newValue);

            if (newValue.name === 'oauth') {
                this.useOAuthToken();
            }
        }
    },

    async mounted() {
        //messageListener.init();
        window.BX24 = BX24;

        await this.obtainAuth();

        if (this.$root.onReadyToRoute) {
            this.$root.onReadyToRoute();
        }
    },

    methods: {
        async obtainAuth() {
            let appData = await browser.runtime.sendMessage({
                type: 'getAppData',
            });

            BX24.setAuth(appData.auth);

            // Temporary
            this.apps.push({
                title: appData.title,
                appUrl: appData.appUrl,
                portal: appData.portal,
            });

            this.setActiveAppId(this.apps.length - 1);
        },

        async useOAuthToken() {
            this.$route.query.code;

            const {clientId, clientSecret} = testOauthApp;

            let params = {
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code: this.$route.query.code,
            };

            const urlParams = new URLSearchParams;

            for (let [param, value] of Object.entries(params)) {
                urlParams.append(param, value);
            }

            const tokenUrl = 'https://oauth.bitrix.info/oauth/token/?' + urlParams.toString();
            let result;

            try {
                result = await fetch(tokenUrl).then(response => response.json());
            } catch (ex) {
                console.error(ex);
                alert(`Ошибка получения токена через OAuth.\n${ex.toString()}`);
                return;
            }

            if (result.error) {
                console.error(result);
                alert(`Ошибка получения токена через OAuth.\n${result.error_description} (${result.error})`);
            }

            let appAuth = {
                domain: /:\/\/(.*?)\//.exec(result.client_endpoint)[1],
                access_token: result.access_token,
                expires_in: result.expires_in,
                member_id: result.member_id,
                refresh_token: result.refresh_token,
            };

            BX24.setAuth(appAuth);

            this.apps.push({
                type: 'oauth',
                title: 'OAuth',
                appUrl: null,
                portal: appAuth.domain,
            });

            this.setActiveAppId(this.apps.length - 1);

            this.$router.push({name: 'index'});
        },

        onAppItemClick(e) {
            this.selectApp(e.currentTarget.getAttribute('data-id') * 1);
        },

        async selectApp(appId) {
            this.setActiveAppId(appId);
            //this.getActiveAppAuth();
            //this.activeModule = 'CrmDealList';
        },

        refreshAuth() {
            // stub
        },

        async test() {
            const { appId, secret, url: waitForUrl } = testOauthApp;
            const domain = 'nav.bitrix24.ru';
            const authUrl = 'https://' + domain + '/oauth/authorize/?client_id=' + appId + '&state=bx24dev-ext-auth';

            //await browser.tabs.create({url: browser.runtime.getURL('tab/index.html#/oauth?auaua=aaa'), active: false});
            //return;
            let authTab = await browser.tabs.create({url: 'about:blank', active: true});

            let redirectCallback = (details) => {
                console.log('Captured url', details);
                let url = new URL(details.url);

                browser.webRequest.onBeforeRequest.removeListener(redirectCallback);

                setTimeout(async () => {
                    await browser.tabs.remove(authTab.id);
                    let currentTab = await browser.tabs.query({ active: true });

                    browser.tabs.update(currentTab.id, {
                        url: browser.runtime.getURL('tab/index.html#/oauth' + url.search)
                    });
                }, 10);

                return {
                    cancel: true,
                    //redirectUrl: browser.runtime.getURL('popup/popup.html#/oauth' + url.search),
                };
            };

            browser.webRequest.onBeforeRequest.addListener(redirectCallback, {
                urls: [waitForUrl + '?*'],
                tabId: authTab.id,
            }, ['blocking']);

            await browser.tabs.update(authTab.id, {url: authUrl});
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