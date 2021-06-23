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
export default {
    props: {
        item: Object,
    }
}
</script>