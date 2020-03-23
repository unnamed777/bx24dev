<template>
<div>
    <!--<nav class="navbar navbar-light">
      <a class="navbar-brand">
          <div v-if="activeAppId" class="b24app">
              <div class="b24app__title">
                  {{ apps[activeAppId].title }}
              </div>
              <div class="b24app__portal">{{ apps[activeAppId].portal }}</div>
          </div>
      </a>
    </nav>-->
    <div class="container-fluid" style="height: calc(100%);">
        <div class="row">
            <div class="sidebar col-2 bg-light">
                <div v-if="activeAppId" class="b24app">
                    <div class="b24app__title">
                        {{ apps[activeAppId].title }}
                    </div>
                    <div class="b24app__portal">{{ apps[activeAppId].portal }}</div>
                </div>
                <!--<div class="mt-3 mb-3">
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
                </div>-->

                <SidebarMenu v-if="activeAppId !== null" :actions="{refreshAuth}"/>
            </div>
            <div class="col-10 pt-3">
                <nav aria-label="breadcrumb"  v-if="breadcrumb.length > 0">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item" v-for="(item, index) in breadcrumb">
                            <template v-if="index === breadcrumb.length - 1">{{ item.text }}</template>
                            <template v-else><a :href="item.link">{{ item.text }}</a></template>
                        </li>
                    </ol>
                </nav>
                <Template v-bind:is="activeModule" v-if="activeModule"/>
                <router-view></router-view>
            </div>
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
            apps: [null],
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
        window.BX24 = BX24;

        await this.obtainAuth();

        if (this.$root.onReadyToRoute) {
            this.$root.onReadyToRoute();
        }

        document.title = document.title + ': ' + this.apps[this.activeAppId].title;
    },

    methods: {
        async obtainAuth() {
            let appData = await browser.runtime.sendMessage({
                type: 'getAppData',
            });

            console.log('appData from background', appData);
            BX24.setAuth(appData.auth);

            // Temporary
            this.apps.push({
                title: appData.title,
                appUrl: appData.appUrl,
                portal: appData.portal,
            });

            this.setActiveAppId(this.apps.length - 1);
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

*:focus {
    outline: none;
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

.navbar {
    background-color: #edeef2;

    .b24app {
        padding: 0;
    }
}

.navbar-brand {
    padding: 0px;
    line-height: 1em;
}

.b24app {
    padding: 0.5rem 0;
    white-space: nowrap;

    &__title {
        overflow: hidden;
        font-size: 1.2rem;
        text-overflow: ellipsis;
    }

    &__portal {
        font-size: 0.7rem;
    }
}

.breadcrumb {
    padding: 0px;
    background-color: transparent;
}

.filter-preview-object {
    font-family: monospace;
    font-size: 0.8rem;
    line-height: 1rem;
    white-space: pre;

    &__key {
        color: #007bff;
    }
}

.page-link {
    &:not([href]) {
        cursor: default;
    }

    &:focus {
        box-shadow: none;
    }
}

.btn-light {
    background-color: #eff1f2;
    border-color: #eff1f2;
}

</style>