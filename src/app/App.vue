<template>
<div>
    <div class="container-fluid" style="height: calc(100%);">
        <div class="row">
            <div class="sidebar col-2 bg-light">
                <div
                    class="b24app"
                    :class="{ 'b24app--menu': !!$slots.appTitleMenu }"
                    :data-toggle="$slots.appTitleMenu ? 'dropdown' : null"
                >
                    <div class="b24app__title" :title="title">
                        {{ title }}
                    </div>
                    <div class="b24app__portal">{{ portal }}</div>
                </div>
                <slot name="appTitleMenu"></slot>

                <SidebarMenu />

                <a class="github" href="https://github.com/unnamed777/bx24dev" target="_blank">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Github" role="img" viewBox="0 0 512 512">
                        <rect width="512" height="512" rx="50%"></rect>
                        <path fill="#fff" d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"></path>
                    </svg>
                </a>
            </div>
            <div
                class="col-10 pt-3"
                :class="contentClass ? [contentClass] : null"
            >
                <div class="d-flex">
                    <nav aria-label="breadcrumb" v-if="breadcrumb.length > 0">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item" v-for="(item, index) in breadcrumb">{{ item.text }}</li>
                        </ol>
                    </nav>
                    <PortalTarget name="breadcrumbAfter" slim />
                </div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { mapState } from "vuex";
import SidebarMenu from "components/SidebarMenu/SidebarMenu";
import { PortalTarget } from "portal-vue";

export default {
    components: {
        SidebarMenu,
        PortalTarget,
    },

    props: {
        mode: {
            type: String,
            validator(value) {
                return ['web', 'extension'].includes(value);
            },
        },
        title: String,
        portal: String,
    },

    data() {
        return {
        }
    },

    computed: mapState({
        breadcrumb: state => state.breadcrumb,
        contentClass: state => state.contentClass,
    }),

    inject: ['resolveRoute', 'goToRoute'],

    mounted() {
        document.title = document.title + ': ' + this.title;
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

.btn:focus {
    box-shadow: none !important;
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
    margin: 0.5rem 0;
    white-space: nowrap;

    &__title {
        overflow: hidden;
        font-size: 1.2rem;
        text-overflow: ellipsis;
    }

    &__portal {
        font-size: 0.7rem;
    }

    &--menu {
        cursor: pointer;
    }
}

.breadcrumb {
    margin-top: -5px;
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

.btn-link:hover {
    text-decoration: none;
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

    .select2-results__group {
        font-weight: 600;
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

.github {
    display: block;
    height: 26px;
    width: 26px;
    margin-bottom: 15px;
    margin-top: 15px;
    opacity: 0.15;
}

.context-menu {
    position: absolute;
    top: var(--top);
    left: var(--left);
}

.page-content {
    &--fixed-height {
        height: 100vh;
        display: flex;
        overflow: auto;
        flex-flow: column nowrap;
    }
}
</style>