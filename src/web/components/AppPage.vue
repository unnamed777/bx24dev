<template>
        <App
            v-if="isLoaded"
            :mode="'web'"
            :title="$store.state.appData.title"
            :portal="$store.state.appData.portal"
        >
            <template #appTitleMenu>
                <ul class="dropdown-menu">
                    <li v-if="!isConnectionSaved"><button class="dropdown-item" @click="saveConnection">Сохранить подключение</button></li>
                    <li v-if="isConnectionSaved"><button class="dropdown-item" @click="removeConnection">Забыть подключение</button></li>
                    <li><button class="dropdown-item" @click="logout">Выйти</button></li>
                </ul>
            </template>
    </App>
        <div v-else class="text-secondary m-1 opacity-25">
            Загрузка...
        </div>
</template>

<script>
import App from "@app/App";
import loadInitialData from "@app/etc/loadInitialData";
import BX24 from "lib/BX24";
import channel, { TYPE_REQUEST_AUTH_DATA_BY_UUID } from "@web/etc/channel";

import {
    getActiveConnectionByAuthId,
    removeFromActiveConnections,
    addToSavedConnections,
    existsInSavedConnections,
    removeFromSavedConnections,
    getUniqIdByCredentials
} from "@web/etc/storage";

export default {
    components: {
        App,
    },

    data() {
        return {
            isLoaded: false,
            isConnectionSaved: false,
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

        this.isConnectionSaved = existsInSavedConnections(this.$store.state.appData);
    },

    methods: {
        async obtainAuthData() {
            let result;
            let appData;
            const authId = this.$router.currentRoute.params.authId;

            // Try to obtain auth data from session storage by authId
            if (authId) {
                appData = getActiveConnectionByAuthId(authId);
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
        },

        logout() {
            this.$store.commit('setAppData', null);
            BX24.setAuth(null, null);
            removeFromActiveConnections(this.$router.currentRoute.params.authId);
            this.$router.push({ name: 'login' });
        },

        saveConnection() {
            addToSavedConnections(this.$store.state.appData);
            this.isConnectionSaved = true;
        },

        removeConnection() {
            const authData = this.$store.state.appData;
            removeFromSavedConnections(getUniqIdByCredentials(authData.authType, authData.auth));
            this.isConnectionSaved = false;
        }
    },
};
</script>