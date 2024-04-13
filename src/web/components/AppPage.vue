<template>
        <App
            v-if="isLoaded"
            :title="$store.state.appData.title"
            :portal="$store.state.appData.portal"
        />
        <div v-else class="text-secondary m-1 opacity-25">
            Загрузка...
        </div>
</template>

<script>
import App from "@app/App";
import loadInitialData from "@app/etc/loadInitialData";
import BX24 from "lib/BX24";
import channel, { TYPE_REQUEST_AUTH_DATA_BY_UUID } from "@web/etc/channel";

export default {
    components: {
        App,
    },

    data() {
        return {
            isLoaded: false,
        };
    },

    async mounted() {
        if (!this.$store.state.appData.portal) {
            if (this.$router.currentRoute.params.authId) {
                await this.obtainAuthData();
            }
        }

        if (!this.$store.state.appData.portal) {
            this.$router.push({ name: 'login' });
            return;
        }

        // Postpone App rendering until scope is loaded
        await loadInitialData();
        this.isLoaded = true;
    },

    methods: {
        async obtainAuthData() {
            let result;

            try {
                result = await channel.sendMessageWithSingleResponse(TYPE_REQUEST_AUTH_DATA_BY_UUID, { authId: this.$router.currentRoute.params.authId });
            } catch (ex) {
                console.warn('Auth with requested id not found');
                return;
            }

            this.$store.commit('setAppData', result.payload);
            BX24.setAuth(BX24.TYPE_WEBHOOK, result.payload.auth);
        }
    },
};
</script>