<template>
<div class="nav-item">
    <router-link v-if="item.route" :to="item.route" class="nav-link">{{ item.label }}</router-link>
    <template v-else>
        <a
            class="nav-link"
            href="#"
            v-on:click.prevent="hasAction ? doAction() : (hasChildren ? toggle() : null)"
            v-bind:class="{ 'nav-link--children': hasChildren, 'nav-link--expanded': expanded }"
        >{{ item.label }}</a>
        <div class="nav-item__submenu" v-if="hasChildren" v-bind:class="{ 'nav-item__submenu--expanded': expanded }">
            <SidebarMenuItem
                v-for="(child, index) in item.children"
                :item="child"
                :key="index"
                :ref="`item_${child._id}`"
            />
        </div>
    </template>
</div>
</template>
<script>
export default {
    name: 'SidebarMenuItem',

    props: {
        item: Object
    },

    emits: [
        'toggle'
    ],

    data() {
        return {
            expanded: false,
        };
    },

    computed: {
        hasChildren() {
            return this.item.children && this.item.children.length > 0;
        },

        hasAction() {
            return !!this.item.action;
        },
    },

    methods: {
        async doAction() {
            if (!this.item.action) {
                return;
            }

            const result = await this.item.action({
                expanded: this.expanded,
                toggle: this.toggle,
            });

            if (!result) {
                return;
            }

            if (result.hasOwnProperty('expand')) {
                this.toggle(result.expand);
            }
        },

        toggle(value = null) {
            this.expanded = value === null ? !this.expanded : value;
            this.$emit('toggle', this.expanded);
        }
    }
}
</script>