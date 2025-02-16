<template>
    <div class="flex-grow-1 flex-shrink-1" style="overflow: auto;">
        <Instance
            v-for="instance of instances"
            :key="instance.id"
            v-show="instance.active"
            :instance="instance"
        />

        <Portal to="breadcrumbAfter">
            <div class="d-flex align-self-start ml-2 mt-n2">
                <button
                    v-for="instance of instances"
                    class="instance-tab btn btn-sm btn-light mr-1"
                    :class="{ 'active': instance.active }"
                    @click="setActiveInstance(instance.id)"
                    @contextmenu.prevent="onTabRightClick($event, instance.id)"
                >{{ instance.label }}</button>

                <button class="btn btn-sm" @click="add">+</button>
            </div>
        </Portal>
        <MountingPortal
            mountTo="#contextMenuPortalContainer"
            :disabled="!contextMenuInstanceId"
        >
            <div
                v-show="contextMenuInstanceId"
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
                        disabled
                    >Дублировать</button>
                    <button
                        class="dropdown-item"
                        type="button"
                        @click="renameTab"
                    >Переименовать</button>
                    <button
                        class="dropdown-item"
                        type="button"
                        @click="removeTab"
                    >Закрыть</button>
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
            idGeneratorValue: 0,
            activeInstanceIndex: null,
            contextMenuInstanceId: null,
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
        this.setContentClass('page-content--fixed-height');
        this.add();
        this.initHotkey();
    },

    beforeDestroy() {
        this.hotkeysAbortController.abort();
    },

    methods: {
        add() {
            if (this.instances[this.activeInstanceIndex]) {
                this.instances[this.activeInstanceIndex].active = false;
            }

            const id = this.getNewInstanceId();

            this.instances.push({
                id,
                active: true,
                label: id.toString(),
            });

            this.setActiveInstance(id);
        },

        getNewInstanceId() {
            return ++this.idGeneratorValue;
        },

        setActiveInstance(id) {
            const index = this.instances.findIndex(instance => instance.id === id);

            if (index === -1) {
                console.warn('Instance %d not found', id);
                return;
            }

            if (this.instances[this.activeInstanceIndex]) {
                this.instances[this.activeInstanceIndex].active = false;
            }

            this.instances[index].active = true;
            this.activeInstanceIndex = index;
        },

        initHotkey() {
            this.isMac = /(macintosh|macintel|macppc|mac68k|macos)/i.test(window.navigator.userAgent);
            this.hotkeysAbortController = new AbortController();
            window.addEventListener('keydown', this.onHotkey.bind(this), { signal: this.hotkeysAbortController.signal });
        },

        onHotkey(e) {
            // All hotkeys use cmd/ctrl
            if (
                this.isMac && !e.metaKey
                || !this.isMac && !e.ctrlKey
            ) {
                return;
            }

            // cmd+option+1..9, ctrl+alt+1..9
            if (!e.shiftKey && e.altKey && e.keyCode >= 49 && e.keyCode <= 57) {
                e.preventDefault();

                let pos = e.keyCode - 48;
                let instance = this.instances[pos - 1];

                if (instance) {
                    this.setActiveInstance(instance.id);
                }

                return;
            }
        },

        onTabRightClick(e, instanceId) {
            this.contextMenuInstanceId = instanceId;

            this.contextMenuPosition = {
                top: e.pageY,
                left: e.pageX,
            };

            this.$nextTick(() => {
                this.$nextTick(() => {
                    // @todo fix error when return to Console
                    this.contextMenuRemoveClickOutside = onClickOutside(this.$refs.contextMenu, () => {
                        console.log('click', this.contextMenuInstanceId);
                        this.hideContextMenu();
                    });
                });
            });
        },

        hideContextMenu() {
            if (!this.contextMenuInstanceId) {
                return;
            }

            this.contextMenuInstanceId = null;
            this.contextMenuRemoveClickOutside();
        },

        removeTab() {
            if (!this.contextMenuInstanceId) {
                console.error('Empty contextMenuInstanceId, nothing to remove');
                return;
            }

            const index = this.instances.findIndex(instance => instance.id === this.contextMenuInstanceId);
            const isActive = this.activeInstanceIndex === index;

            this.instances = [
                ...this.instances.slice(0, index),
                ...this.instances.slice(index + 1),
            ];

            if (isActive) {
                let activateIndex;

                if (index === 0) {
                    // If active tab was first, set active next one (right)
                    activateIndex = index;
                } else if (index > 0) {
                    // If active tab wasn't first, set active previous one (left)
                    activateIndex = index - 1;
                }

                this.setActiveInstance(this.instances[activateIndex].id);
            }

            this.hideContextMenu();
        },

        renameTab() {
            const index = this.instances.findIndex(instance => instance.id === this.contextMenuInstanceId);
            const newLabel = prompt('Новый заголовок консоли', this.instances[index].label);

            if (newLabel !== null) {
                this.instances[index].label = newLabel;
            }

            this.hideContextMenu();
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
            setContentClass: 'setContentClass',
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