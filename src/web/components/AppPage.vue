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
            // Seems that a user just reloaded the page, so we don't have auth
            this.$router.push({ name: 'login' });
            return;
        }

        // Postpone App rendering until scope is loaded
        await loadInitialData();
        this.isLoaded = true;
    }
};
</script>