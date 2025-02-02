<template>
    <div>
        <Instance
            v-for="instance of instances"
            :key="instance.id"
            v-show="instance.id === activeInstanceId"
            :instance="instance"
        />

        <Portal to="breadcrumbAfter">
            <div class="d-flex align-self-start ml-2 mt-n2">
                <button
                    v-for="instance of instances"
                    class="instance-tab btn btn-sm btn-light mr-1"
                    :class="{ 'active': instance.id === activeInstanceId }"
                    @click="activeInstanceId = instance.id"
                    @contextmenu.prevent="onTabRightClick($event, instance.id)"
                >{{ instance.id }}</button>

                <button class="btn btn-sm" @click="add">+</button>
            </div>
        </Portal>
        <MountingPortal
            mountTo="#contextMenuPortalContainer"
            :disabled="!contextMenuId"
        >
            <div
                v-show="contextMenuId"
                class="context-menu"
                :style="{
                    '--top': contextMenuPosition.top + 'px',
                    '--left': contextMenuPosition.left + 'px',
                }"
                ref="contextMenu"
            >
                <div class="dropdown-menu d-block">
                    <button
                        class="dropdown-item"
                        type="button"
                    >
                        Дублировать
                    </button>
                    <button
                        class="dropdown-item"
                        type="button"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </MountingPortal>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import { Portal, MountingPortal } from "portal-vue";
import Instance from "components/modules/Console/Instance";
import { onClickOutside } from "@vueuse/core";

export default {
    components: {
        Instance,
        Portal,
        MountingPortal,
    },

    props: {
        queryMethod: String,
        queryCode: [String, Object],
    },

    data() {
        return {
            instances: [],
            activeInstanceId: null,
            contextMenuId: null,
            contextMenuPosition: {
                top: 0,
                left: 0,
            },
        };
    },

    computed: {
    },

    watch: {
    },

    mounted() {
        this.setBreadcrumb(['Консоль']);
        this.add();
        this.initHotkey();
    },

    beforeDestroy() {
        this.hotkeysAbortController.abort();
    },

    methods: {
        add() {
            if (this.instances[this.activeInstanceId]) {
                this.instances[this.activeInstanceId].active = false;
            }

            const id = this.instances.length + 1;
            this.instances.push({ id, active: true });
            this.activeInstanceId = id;
        },

        setActiveInstance(id) {
            const index = this.instances.findIndex(instance => instance.id === id);

            if (index === -1) {
                console.warn('Instance %d not found', id);
                return;
            }

            if (this.instances[this.activeInstanceId]) {
                this.instances[this.activeInstanceId].active = false;
            }

            this.instances[index].active = true;
            this.activeInstanceId = this.instances[index].id;
        },

        initHotkey() {
            this.isMac = /(macintosh|macintel|macppc|mac68k|macos)/i.test(window.navigator.userAgent);
            this.hotkeysAbortController = new AbortController();
            window.addEventListener('keydown', this.onHotkey.bind(this), { signal: this.hotkeysAbortController.signal });
        },

        onHotkey(e) {
            // All hotkeys use cmd/ctrl
            if (
                this.isMac && e.metaKey
                && !this.isMac && e.ctrlKey
            ) {
                return;
            }

            // cmd+1...9
            if (!e.shiftKey && !e.altKey && e.keyCode >= 49 && e.keyCode <= 57) {
                e.preventDefault();

                let pos = e.keyCode - 48;
                let instance = this.instances.filter(Boolean)[pos - 1];

                if (instance) {
                    this.setActiveInstance(instance.id);
                }

                return;
            }
        },

        onTabRightClick(e, instanceId) {
            this.contextMenuId = instanceId;

            this.contextMenuPosition = {
                top: e.pageY,
                left: e.pageX,
            };

            this.$nextTick(() => {
                    this.$nextTick(() => {
                    console.log(this.$refs.contextMenu);
                    onClickOutside(this.$refs.contextMenu, () => {
                        console.log('click', this.contextMenuId);
                        this.contextMenuId = null;
                    });
                });
            });
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>

<style lang="scss" scoped>
.instance-tab {
    &.active {
        cursor: default;
    }
}
</style>