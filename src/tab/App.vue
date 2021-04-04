<template>
<div>
    <div class="container-fluid" style="height: calc(100%);">
        <div class="row">
            <div class="sidebar col-2 bg-light">
                <div class="b24app">
                    <div class="b24app__title">
                        {{ title }}
                    </div>
                    <div class="b24app__portal">{{ portal }}</div>
                </div>

                <SidebarMenu />
            </div>
            <div class="col-10 pt-3">
                <nav aria-label="breadcrumb" v-if="breadcrumb.length > 0">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item" v-for="(item, index) in breadcrumb">{{ item.text }}</li>
                    </ol>
                </nav>
                <router-view></router-view>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { mapState } from 'vuex';
import SidebarMenu from 'components/SidebarMenu/SidebarMenu';

export default {
    components: {
        SidebarMenu,
    },

    props: {
        title: String,
        portal: String,
    },

    data() {
        return {
        }
    },

    computed: mapState({
        breadcrumb: state => state.breadcrumb,
    }),

    async mounted() {
        document.title = document.title + ': ' + this.title;

        if (this.$route.name === 'index') {
            this.$root.goToRoute({ name: 'console' });
        }
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
</style>