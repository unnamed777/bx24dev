<template>
    <div class="auth-item recent-item mb-2">
        <div class="auth-item__body">
            <div class="auth-item__title" @click="$emit('itemClick')"><b>{{ item.portal }} / {{ item.title }}</b></div>
            <small class="text-secondary">{{ item.extra }}</small>
        </div>
        <div class="auth-item__actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
/**
 * @typedef {Object} ConnectionTemplateItem
 * @property {String} id
 * @property {String} portal
 * @property {String} title
 * @property {String} extra
 */

export default {
    props: {
        item: Object,
    }
}
</script>

<style lang="scss">
.auth-item {
    display: flex;
    line-height: 1.2em;

    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;

    &__body {
        flex: 1 1 auto;
        cursor: default;
    }

    &__title {
        cursor: pointer;
    }

    &__actions {
        display: flex;
        width: 32px;
        flex: 0 0 32px;

        justify-content: space-around;
    }
}
</style>