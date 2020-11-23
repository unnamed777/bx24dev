<template>
<div>
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

                <SidebarMenu v-if="activeAppId !== null" :actions="{ refreshAuth }"/>
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
import browser from 'webextension-polyfill';
import {mapState, mapMutations} from 'vuex';
import BX24 from '../lib/BX24';
import SidebarMenu from './components/SidebarMenu/index.vue';

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
        }
    },

    async mounted() {
        window.BX24 = BX24;

        await this.obtainAuth();
        await this.loadInitialData();

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
            BX24.setAuth(appData.authType, appData.auth);

            // Temporary
            this.apps.push({
                title: appData.title,
                appUrl: appData.appUrl,
                portal: appData.portal,
            });

            this.setAppData({
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

        async refreshAuth() {
            let appData = await browser.runtime.sendMessage({
                type: 'refreshAuth',
            });

            console.log('appData from background', appData);
            BX24.setAuth(appData.authType, appData.auth);
        },

        async loadInitialData() {
            // @todo make batch
            const scope = await BX24.fetch('scope');
            console.log('App scope', scope);
            this.setScope(scope);

            const methods = await BX24.fetch('methods');
            this.setAvailableMethods(methods);
        },

        ...mapMutations({
            setActiveModule: 'setActiveModule',
            setActiveAppId: 'setActiveAppId',
            setAppData: 'setAppData',
            setScope: 'setScope',
            setAvailableMethods: 'setAvailableMethods',
        }),
    },

}
</script>

<style lang="scss">
html, body {
    height: 100%;
}

body {
    position: relative;
}

*:focus {
    outline: none;
}

.form-control:focus {
    border-color: #000;
    box-shadow: none !important;
}

.btn-light {
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

// select2 default theme
.select2, .select2-dropdown {
    font-size: 14px;
    line-height: 1.3em;
}

.select2-container {
    &--default .select2-selection--single {
        height: 31px;
        border-radius: 0.2rem;
        border: 1px solid #ced4da;

        .select2-selection__arrow {
            height: 30px;
        }

        // Disable left border radius if select is in group (ex. filter values)
        .input-group & {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }
    }

    .select2-results > .select2-results__options {
        max-height: 350px;
    }

    &--open .select2-selection--single {
        border-color: #000000;
    }

    &--open .select2-dropdown--below {
        border: 1px solid #000;
        margin-top: -1px;
    }
}

body .json-formatter-row {
    font-size: 14px;

    .json-formatter-key {
        color: #2E75E0;
        // color: #B52F24;
    }

    .json-formatter-boolean {
        color: #3D8825;
        // color: #1317C8;
    }

    .json-formatter-number {
        color: #3D8825;
        // color: #1317C8;
    }

    .json-formatter-string {
        color: #CB2FA4;
        // color: #B52F24;
    }
}
</style>