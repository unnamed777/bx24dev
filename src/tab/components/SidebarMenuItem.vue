<template>
<div class="nav-item">
    <a
        class="nav-link"
        href="#"
        v-on:click.prevent="hasChildren ? toggle() : (item.action ? item.action() : null)"
        v-bind:class="{ 'nav-link--children': hasChildren, 'nav-link--expanded': expanded }"
    >{{ item.label }}</a>
    <div class="nav-item__submenu pl-3" v-if="hasChildren" v-bind:class="{ 'nav-item__submenu--expanded': expanded }">
        <SidebarMenuItem v-for="(child, index) in item.children" v-bind:item="child" v-bind:key="index" />
    </div>
</div>
</template>
<script>
import SidebarMenuItem from './SidebarMenuItem.vue';

export default {
    name: 'SidebarMenuItem',
    props: {
        item: Object
    },
    data() {
        return {
            expanded: false,
        };
    },
    computed: {
        hasChildren() {
            return this.item.children && this.item.children.length > 0;
        }
    },
    methods: {
        toggle() {
            console.log(111);
            this.expanded = !this.expanded;
        }
    }
}
</script>