<template>
<div class="nav flex-column mb-4">
    <SidebarMenuItem v-for="(item, index) in items" v-bind:item="item" v-bind:key="index"></SidebarMenuItem>
</div>
</template>

<script>
import SidebarMenuItem from './SidebarMenuItem.vue';

export default {
    props: {
        items: Array
    },
    components: {
        SidebarMenuItem
    }
}
</script>

<style lang="scss">
.sidebar {
    .nav-link {
        $el: &;
        position: relative;
        color: #333;

        &:hover {
            color: #000;
        }

        &--children {
            &:before {
                position: absolute;
                left: 0px;

                content: '▶︎';
                color: #555555;
                font-size: 0.7rem;
                line-height: 1.5rem;
                transition: transform ease 0.2s;
            }
        }

        &--expanded {
            &.nav-link--children:before {
                transform: rotate(90deg);
            }
        }
    }

    .nav-item {
        &__submenu {
            display: none;

            &--expanded {
                display: block;
            }
        }
    }
}
</style>
