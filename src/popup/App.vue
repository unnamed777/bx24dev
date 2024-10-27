<template>
    <div class="m-2" style="max-width: 450px;">
        <div>На странице несколько активных приложений <br/>или встроек. Выберите нужное для подключения:</div>
        <div class="list-group mt-1">
            <button
                v-for="item of apps"
                class="list-group-item list-group-item-action"
                @click="select(item)"
            >
                 {{ item.providerPayload.appUrl }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        apps: Array,
        createExtensionInstance: Function,
    },

    methods: {
        /**
         * @param {CreateExtensionInstanceMessagePayload} item
         */
        select(item) {
            console.log(item);
            this.createExtensionInstance(item);
        }
    },
};
</script>

<style lang="scss" scoped>
.list-group-item {
    word-break: break-word;
}
</style>