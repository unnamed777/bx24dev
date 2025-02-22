<template>
    <div class="main-container container-fluid relative">
        <div class="row justify-content-center">
            <div class="col-5 mt-4">
                <h1 class="mb-4">bx24dev</h1>

                <div class="mb-5">
                    <h4>Вебхук</h4>
                    <form class="webhook-form" @submit.prevent="webhookSubmit">
                        <div class="form-row">
                            <div class="col">
                                <input class="form-control form-control-lg" id="webhookUrl" type="text" name="url" ref="webhookUrl" placeholder="url или &quot;domain user_id key&quot;" />
                            </div>
                            <div class="col-1">
                                <button class="btn btn-lg btn-primary" type="submit" tabindex="-1">➤</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="mb-5">
                    <h4>Токен</h4>
                    <form class="token-form" @submit.prevent="tokenSubmit">
                        <div class="form-row">
                            <div class="col">
                                <input class="form-control form-control-lg" type="text" id="tokenDomain" name="domain" placeholder="domain" /><br/>
                            </div>
                            <div class="col-1"></div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <input class="form-control form-control-lg" type="text" id="tokenToken" name="token" placeholder="access_token" />
                            </div>
                            <div class="col-1">
                                <button class="btn btn-lg btn-primary" type="submit" tabindex="-1">➤</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div v-if="this.activeList.length > 0" class="mb-5">
                    <h4>Активные подключения</h4>
                    <AuthItem
                        v-for="(item, index) of activeList"
                        :key="item.id"
                        :item="item"
                        :index="index"
                        @itemClick="openActive(item)"
                    >
                        <template v-slot:actions>
                            <StarIcon
                                class="auth-item__save"
                                :class="{ 'auth-item__save--saved': savedIds.includes(item.id) }"
                                @click="savedIds.includes(item.id) ? forgetAuth(item.id) : rememberAuth(item)"
                            />
                        </template>
                    </AuthItem>
                </div>

                <div v-if="this.savedList.length > 0" class="mb-5">
                    <h4>Сохранённые подключения</h4>
                    <AuthItem
                        v-for="(item, index) of savedList"
                        :key="item.id"
                        :item="item"
                        :index="index"
                        @itemClick="openSaved(item.id)"
                    >
                        <template v-slot:actions>
                            <CloseIcon class="auth-item__delete" @click="forgetAuth(item.id)"/>
                        </template>
                    </AuthItem>
                </div>
            </div>
        </div>
        <a class="github" href="https://github.com/unnamed777/bx24dev" target="_blank">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Github" role="img" viewBox="0 0 512 512" style="fill: #404040">
                <rect width="512" height="512" rx="50%"></rect>
                <path fill="#fff" d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"></path>
            </svg>
        </a>
    </div>
</template>

<script>
import { StarIcon, CloseIcon } from '@zhuowenli/vue-feather-icons';
import AuthItem from '@web/components/AuthItem';
import BX24 from "lib/BX24";
import channel, { TYPE_REQUEST_ACTIVE_CONNECTIONS } from "@web/etc/channel";
import { parseWebhookFromUserInput} from "lib/functions";

import {
    getSavedConnections,
    addToSavedConnections,
    removeFromSavedConnections,
    getUniqIdByCredentials,
} from '@web/etc/storage';


export default {
    components: {
        StarIcon,
        CloseIcon,
        AuthItem,
    },

    data() {
        return {
            savedList: [],
            activeConnections: [],
        };
    },

    mounted() {
        this.$refs['webhookUrl'].focus();
        this.loadSavedList();
        this.loadActiveList();
    },

    computed: {
        activeList() {
            const result = [];

            for (let connection of this.activeConnections) {
                /** @var {ConnectionTemplateItem} */
                let item;

                switch (connection.authType) {
                    case 'webhook':
                        item = {
                            id: getUniqIdByCredentials('webhook', connection.auth),
                            title: connection.title,
                            portal: connection.portal,
                            extra: connection.auth.url.replace(/\/(.)[^\\/]*\/?$/si, '/$1***'),
                        };
                        break;

                    case 'oauth':
                        // @todo needs to be checked for Token
                        item.extra = item.appUrl;
                        break;

                    default:
                        return;
                }

                result.push(item);
            }

            return result;
        },

        savedIds() {
            return this.savedList.map(item => item.id);
        }
    },

    methods: {
        async webhookSubmit() {
            const webhookData = parseWebhookFromUserInput(document.getElementById('webhookUrl').value);

            if (webhookData === null) {
                alert('Неверный формат данных для вебхука');
                return;
            }

            /** @var {AuthorizationData} */
            let appData = {
                title: 'Webhook',
                portal: webhookData.domain,
                authType: 'webhook',
                auth: {
                    domain: webhookData.domain,
                    url: webhookData.url,
                },
            };

            this.openWebhook(appData);
        },

        /**
         * @param {AuthorizationData} appData
         */
        openWebhook(appData) {
            this.$store.commit('setAppData', appData);
            BX24.setAuth(BX24.TYPE_WEBHOOK, appData.auth);
            this.$router.push({ name: 'app', params: { authId: window.crypto.randomUUID() } });
        },

        tokenSubmit() {
            this.create('token', {
                domain: document.getElementById('tokenDomain').value,
                token: document.getElementById('tokenToken').value,
            });
        },

        loadActiveList() {
            this.activeConnections = [];

            channel.sendMessageWithMultipleResponses(TYPE_REQUEST_ACTIVE_CONNECTIONS, null, ({ payload }) => {
                /** @var {AuthorizationData} payload */
                payload.id = getUniqIdByCredentials('webhook', payload.auth);

                for (let connection of this.activeConnections) {
                    if (connection.id === payload.id) {
                        return;
                    }
                }

                this.activeConnections.push(payload);
            });
        },

        /**
         * @param {ConnectionTemplateItem} item
         */
        openActive(item) {
            console.log(item);
            const connection = this.activeConnections.find(el => el.id === item.id);

            if (!connection) {
                console.error('Connection with requested id not found');
                return;
            }

            if (connection.authType === 'webhook') {
                this.openWebhook(connection);
            }
        },

        loadSavedList() {
            const connections = getSavedConnections();

            /** @var {ConnectionTemplateItem[]} */
            const items = [];

            for (let connection of connections) {
                /** @var {ConnectionTemplateItem} */
                let item;

                switch (connection.type) {
                    case 'webhook':
                        let parts = /^.*:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)\/?$/.exec(connection.credentials.url);

                        item = {
                            id: connection.id,
                            title: 'Webhook',
                            portal: parts[1],
                            extra: connection.credentials.url.replace(/\/(.)[^\\/]*\/?$/si, '/$1***'),
                        };
                        break;

                    default:
                        throw new Error('Unsupported provider');
                }

                items.push(item);
            }

            this.savedList = items;
        },

        /**
         * @param {AuthorizationData} item
         * @returns {void}
         */
        rememberAuth(item) {
            addToSavedConnections(item);
            this.loadSavedList();
        },

        forgetAuth(id) {
            if (!confirm('Удалить?')) {
                return;
            }

            removeFromSavedConnections(id);
            this.loadSavedList();
        },

        async openSaved(id) {
            let savedItems = getSavedConnections();

            for (let index in savedItems) {
                let item = savedItems[index];

                if (item.id === id) {
                    /** @var {AuthorizationData} */
                    let appData = {
                        title: 'Webhook',
                        portal: item.credentials.domain,
                        authType: 'webhook',
                        auth: {
                            domain: item.credentials.domain,
                            url: item.credentials.url,
                        },
                    };

                    this.openWebhook(appData);

                    break;
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
/** {
    font-size: 20px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"
}*/

form {
    margin: 0px;
    padding: 0px;
}

input {
    border: 1px solid #a0a0a0;
}

.submit {
    height: 36px;
    box-sizing: border-box;
    padding: 5px;
    margin-left: 10px;
}

.main-container {
    min-height: 100vh;
}

.github {
    position: fixed;
    bottom: 15px;
    left: 15px;
}

.auth-item {
    &__save {
        width: 20px;
        height: 20px;
        opacity: 0.5;
        cursor: pointer;

        &--saved {
            opacity: 1;
        }
    }

    &__delete {
        width: 16px;
        height: 16px;
        opacity: 0.3;
        cursor: pointer;

        &--saved {
            opacity: 1;
        }
    }
}
</style>