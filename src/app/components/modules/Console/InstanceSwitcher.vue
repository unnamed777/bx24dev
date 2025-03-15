<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { Portal } from "portal-vue";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(['add', 'remove', 'rename', 'setActive']);

const instances = defineModel();

let idGeneratorValue = 0;
let activeInstanceIndex = null;

onMounted(() => {
    initHotkey();
});

const setActive = (id) => {
    emit('setActive', id);
};

const getIndex = (id) => {
    return instances.value.findIndex(instance => instance.id === id) ?? null;
};

//
// Hotkeys
//
const isMac = /(macintosh|macintel|macppc|mac68k|macos)/i.test(window.navigator.userAgent);
const hotkeysAbortController =  new AbortController();

const initHotkey = () => {
    window.addEventListener('keydown', onHotkey.bind(this), { signal: hotkeysAbortController.signal });
};

const onHotkey = (e) => {
    // All hotkeys use cmd/ctrl
    if (
        isMac && !e.metaKey
        || !isMac && !e.ctrlKey
    ) {
        return;
    }

    // cmd+option+1..9, ctrl+alt+1..9
    if (!e.shiftKey && e.altKey && e.keyCode >= 49 && e.keyCode <= 57) {
        e.preventDefault();

        let pos = e.keyCode - 48;
        let instance = instances.value[pos - 1];

        if (instance) {
            setActive(instance.id);
        }
    }
};

onUnmounted(() => {
    hotkeysAbortController.abort();
});

//
// Context menu
//
const contextMenuElement = ref(null);
const contextMenuInstanceId = ref(null);
let contextMenuRemoveClickOutside;

const contextMenuPosition = ref({
    top: 0,
    left: 0,
});

const onRightClick = (e, instanceId) => {
    contextMenuInstanceId.value = instanceId;

    contextMenuPosition.value = {
        top: e.pageY,
        left: e.pageX,
    };

    nextTick(() => {
        nextTick(() => {
            // @todo fix error when return to Console from another page
            contextMenuRemoveClickOutside = onClickOutside(contextMenuElement, () => {
                hideContextMenu();
            });
        });
    });
};

const hideContextMenu = () => {
    if (!contextMenuInstanceId) {
        return;
    }

    contextMenuInstanceId.value = null;
    contextMenuRemoveClickOutside();
};

const remove = () => {
    emit('remove', contextMenuInstanceId.value);
    hideContextMenu();
};

const onContextMenuRename = () => {
    const id = contextMenuInstanceId.value;

    // Menu item has focus, so we need to close it first
    hideContextMenu();
    activateRenaming(id);
};


//
// Inline tab renaming
//
const renamingActiveId = ref(null);
const buttonRefs = ref([]);

const activateRenaming = (id) => {
    const button = buttonRefs.value[id];

    button.focus();
    renamingActiveId.value = id;

    const range = document.createRange();
    range.setStart(button.firstChild, 0);
    range.setEnd(button.firstChild, button.firstChild.length);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
};

const doneRenaming = () => {
    if (renamingActiveId.value === null) {
        return;
    }

    emit('rename', {
        id: renamingActiveId.value,
        label: buttonRefs.value[renamingActiveId.value].innerText.trim(),
    });

    renamingActiveId.value = null;
};

const cancelRenaming = () => {
    if (renamingActiveId.value === null) {
        return;
    }

    // Restore original label
    buttonRefs.value[renamingActiveId.value].innerText = instances.value[getIndex(renamingActiveId.value)].label;
    renamingActiveId.value = null;
};

const visibleIndex = (index, instance) => {
    const visibleIndex = index + 1;

    if (instance.label && visibleIndex.toString() !== instance.label) {
        return visibleIndex;
    }

    if (instance.method) {
        return visibleIndex;
    }

    return null;
};
</script>

<template>
    <Portal to="breadcrumbAfter">
        <div class="d-flex align-self-start ml-2 mt-n2">
            <button
                v-for="(instance, index) of instances"
                class="instance-tab btn btn-sm btn-light mr-1"
                :class="{ 'active': instance.active }"
                :title=" index < 10 ? (isMac ? `⌘ ⌥ ` : 'Ctrl+Alt+') + `${index + 1}` : null"
                :contenteditable="renamingActiveId === instance.id ? true : null"
                :ref="(el) => { buttonRefs[instance.id] = el; }"
                :data-visibleIndex="visibleIndex(index, instance)"
                @click="setActive(instance.id)"
                @dblclick="activateRenaming(instance.id)"
                @contextmenu.prevent="onRightClick($event, instance.id)"
                @keydown.enter.prevent="doneRenaming()"
                @keydown.esc.prevent="cancelRenaming()"
                @blur="doneRenaming()"
            >{{ instance.label || instance.method || instance.id }}</button>

            <button class="btn btn-sm" @click="emit('add')">+</button>
        </div>
    </Portal>

    <Teleport
        to="#contextMenuPortalContainer"
        :disabled="!contextMenuInstanceId"
    >
        <div
            v-show="contextMenuInstanceId"
            class="context-menu"
            :style="{
                    '--top': contextMenuPosition.top + 'px',
                    '--left': contextMenuPosition.left + 'px',
                }"
            ref="contextMenuElement"
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
                    @click="onContextMenuRename"
                >Переименовать<span class="text-secondary ml-4" style="opacity: 0.5; margin-right: -0.75rem;">Дв. клик</span></button>
                <button
                    class="dropdown-item"
                    type="button"
                    @click="remove"
                >Закрыть</button>
            </div>
        </div>
    </Teleport>
</template>

<style lang="scss" scoped>
.instance-tab {
    &[data-visibleIndex] {
        &::before {
            display: inline-block;
            opacity: 0.5;
            margin-right: 0.5rem;
            font-size: 0.75rem;
            content: attr(data-visibleIndex);
        }
    }
}
</style>