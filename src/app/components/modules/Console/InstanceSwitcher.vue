<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { Portal } from "portal-vue";
import { onClickOutside } from "@vueuse/core";

const instances = defineModel();

let idGeneratorValue = 0;
let activeInstanceIndex = null;

onMounted(() => {
    initHotkey();
});

const add = () => {
    const id = getNewInstanceId();

    const newInstance = {
        id,
        active: false,
        label: id.toString(),
    };

    instances.value.push(newInstance);
    setActive(id);
};

const getNewInstanceId = () => {
    return ++idGeneratorValue;
};

const setActive = (id) => {
    const index = instances.value.findIndex(instance => instance.id === id);

    if (index === -1) {
        console.warn('Instance %d not found', id);
        return;
    }

    if (instances.value[activeInstanceIndex]) {
        instances.value[activeInstanceIndex].active = false;
    }

    instances.value[index].active = true;
    activeInstanceIndex = index;
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
                console.log('click', contextMenuInstanceId);
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
    if (!contextMenuInstanceId.value) {
        console.error('Empty contextMenuInstanceId, nothing to remove');
        return;
    }

    const index = getIndex(contextMenuInstanceId);
    const isActive = activeInstanceIndex === index;

    instances.value = [
        ...instances.value.slice(0, index),
        ...instances.value.slice(index + 1),
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

        setActive(instances.value[activateIndex].id);
    }

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
    buttonRefs.value[id].focus();
    renamingActiveId.value = id;
    window.getSelection().selectAllChildren(buttonRefs.value[id]);
};

const doneRenaming = () => {
    if (renamingActiveId.value === null) {
        return;
    }

    instances.value[getIndex(renamingActiveId.value)].label = buttonRefs.value[renamingActiveId.value].innerText;
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

defineExpose({
    add,
});
</script>

<template>
    <Portal to="breadcrumbAfter">
        <div class="d-flex align-self-start ml-2 mt-n2">
            <button
                v-for="instance of instances"
                class="instance-tab btn btn-sm btn-light mr-1"
                :class="{ 'active': instance.active }"
                :contenteditable="renamingActiveId === instance.id ? true : null"
                :ref="(el) => { buttonRefs[instance.id] = el; }"
                @click="setActive(instance.id)"
                @dblclick="activateRenaming(instance.id)"
                @contextmenu.prevent="onRightClick($event, instance.id)"
                @keydown.enter.prevent="doneRenaming()"
                @keydown.esc.prevent="cancelRenaming()"
                @blur="doneRenaming()"
            >{{ instance.label }}</button>

            <button class="btn btn-sm" @click="add">+</button>
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
                >Переименовать</button>
                <button
                    class="dropdown-item"
                    type="button"
                    @click="remove"
                >Закрыть</button>
            </div>
        </div>
    </Teleport>
</template>