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

onMounted(() => {
    store.commit('setBreadcrumb', ['Консоль']);
    store.commit('setContentClass', 'page-content--fixed-height');
    instanceSwitcher.value.add();
});
</script>

<template>
    <div class="flex-grow-1 flex-shrink-1" style="overflow: auto;">
        <InstanceSwitcher
            ref="instanceSwitcher"
            v-model="instances"
        />

        <Instance
            v-for="instance of instances"
            :key="instance.id"
            v-show="instance.active"
            :instance="instance"
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