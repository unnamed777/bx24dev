<template>
    <div class="m-2" style="width: 450px;">
        <div>На странице несколько активных приложений <br/>или встроек. Выберите нужное для подключения:</div>
        <div class="list-group mt-1">
            <button
                v-for="item of appsFormatted"
                class="list-group-item list-group-item-action"
                @click="select(item)"
            >
                <div><b>{{ item.name }}</b></div>
                <div>{{ item.primary }}<span style="opacity: 0.8;">{{ item.secondary }}</span><span v-if="item.params" style="opacity: 0.5;">{{ item.params }}</span></div>
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

    computed: {
        appsFormatted() {
            let result = [];

            for (/** @type {CreateExtensionInstanceMessagePayload} */ let app of this.apps) {
                let url = new URL(app.providerPayload.appUrl);

                result.push({
                    name: app.providerPayload.appName,
                    primary: url.protocol + '//' + url.hostname,
                    secondary: url.pathname,
                    params: url.search,
                });
            }

            return result;
        }
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
    word-break: break-all;
}
</style>