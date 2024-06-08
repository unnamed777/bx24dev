<template>
        <App
            v-if="isLoaded"
            :mode="'web'"
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
import { SESSION_STORAGE_ACTIVE_KEY } from "@web/etc/storage";

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
            let appData;
            const authId = this.$router.currentRoute.params.authId;

            // Try to obtain auth data from session storage by authId
            if (this.$route.params.authId) {
                let activeList = window.sessionStorage.getItem(SESSION_STORAGE_ACTIVE_KEY);

                if (activeList) {
                    try {
                        activeList = JSON.parse(activeList);
                        appData = activeList[authId] ?? null;
                    } catch (ex) {}
                }
            }

            // If failed, asks other app tabs for auth data
            if (!appData) {
                try {
                    result = await channel.sendMessageWithSingleResponse(TYPE_REQUEST_AUTH_DATA_BY_UUID, { authId: authId });
                    appData = result.payload;
                } catch (ex) {
                    console.warn('Auth with requested id not found');
                    return;
                }
            }

            this.$store.commit('setAppData', appData);
            BX24.setAuth(BX24.TYPE_WEBHOOK, appData.auth);
        }
    },
};
</script>