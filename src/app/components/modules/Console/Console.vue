<script setup>
import { useStore } from 'vuex';
import Instance from "components/modules/Console/Instance";
import InstanceSwitcher from "components/modules/Console/InstanceSwitcher";
import { onMounted, ref, useTemplateRef } from "vue";

// For getting params from URL. Unused for now
const props = defineProps({
    queryMethod: String,
    queryCode: [String, Object],
});

const store = useStore();
const instanceSwitcher = useTemplateRef('instanceSwitcher');
const instances = ref([]);
let idGeneratorValue = 0;
let activeInstanceIndex = null;

onMounted(() => {
    store.commit('setBreadcrumb', ['Консоль']);
    store.commit('setContentClass', 'page-content--fixed-height');
    add();
});

const add = () => {
    const id = getNewInstanceId();

    const newInstance = {
        id,
        active: false,
        method: null,
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

const remove = (id) => {
    const index = getIndex(id);
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
    } else {
        // Update active index if it has been shifted
        activeInstanceIndex = instances.value.findIndex(instance => instance.active === true)
    }
};

const rename = ({id, label}) => {
    instances.value[getIndex(id)].label = label;
};

const onMethodChange = (method) => {
    if (activeInstanceIndex === null) {
        throw new Error('No active instance');
    }

    instances.value[activeInstanceIndex].method = method;
};
</script>

<template>
    <div class="flex-grow-1 flex-shrink-1" style="overflow: auto;">
        <InstanceSwitcher
            ref="instanceSwitcher"
            v-model="instances"
            @add="add"
            @remove="remove"
            @setActive="setActive"
            @rename="rename"
        />

        <Instance
            v-for="instance of instances"
            :key="instance.id"
            v-show="instance.active"
            :instance="instance"
            @methodChange="onMethodChange"
        />
    </div>
</template>

<style lang="scss" scoped>
.instance-tab {
    &.active {
        cursor: default;
    }
}
</style>