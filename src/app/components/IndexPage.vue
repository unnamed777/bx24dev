<template>
</template>
<script>
export default {
    inject: ['goToRoute'],

    mounted() {
        this.goToRoute({ name: 'console' }, true);
    },
}
</script>