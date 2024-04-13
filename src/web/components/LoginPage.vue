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
                        @itemClick="openRecent(item)"
                    >
                        <template v-slot:actions>
                            <StarIcon
                                class="auth-item__save"
                                :class="{ 'auth-item__save--saved': savedIds.includes(item.id) }"
                                @click="savedIds.includes(item.id) ? forgetAuth(item.id) : rememberAuth(index)"
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
import { StarIcon, CloseIcon } from 'vue-bytesize-icons';
import AuthItem from '@web/components/AuthItem';
import BX24 from "lib/BX24";
import channel, { TYPE_REQUEST_ACTIVE_CONNECTIONS } from "@web/etc/channel";

export default {
    components: {
        StarIcon,
        CloseIcon,
        AuthItem,
    },

    data() {
        return {
            activeList: [],
            savedList: [],
        };
    },

    mounted() {
        this.$refs['webhookUrl'].focus();
        //this.getSavedList();
        this.getRecentList();
    },

    computed: {
        savedIds() {
            return this.savedList.map(item => item.id);
        }
    },

    methods: {
        async create(name, payload) {
            const result = await sendMessage({
                type: 'createWebInstance',
                payload: {
                    providerName: name,
                    providerPayload: payload,
                }
            });

            this.$router.push({ path: 'app' }, { authId: result.instanceId });
            console.log(result);
        },

        async webhookSubmit() {
            let webhook = document.getElementById('webhookUrl').value;
            let result = /^https:\/\/([^/]+)\/rest\/[0-9]+\/[^/]+/.exec(webhook);

            if (result === null) {
                // Check whether user entered separate parts of webhook (domain, user id, token)
                result = /^(\S+)\s+([0-9]+)\s+(\S+)$/.exec(webhook);

                if (result !== null) {
                    // Build webhook url
                    webhook = `https://${result[1]}/rest/${result[2]}/${result[3]}`;
                }
            }

            if (result === null) {
                alert('Неверный формат данных для вебхука');
                return;
            }

            /** @var {AuthorizationData} */
            let appData = {
                title: 'Webhook',
                portal: result[1],
                authType: 'webhook',
                auth: {
                    domain: result[1],
                    url: webhook,
                },
            };

            this.openWebhook(appData);
        },

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

        async getSavedList() {
            this.savedList = await sendMessage({
                type: 'getSavedList',
                payload: {}
            });
        },

        async getRecentList() {
            channel.sendMessageWithMultipleResponses(TYPE_REQUEST_ACTIVE_CONNECTIONS, null, ({ payload }) => {
                // @todo Check for duplicates
                switch (payload.authType) {
                    case 'webhook':
                        payload.extra = payload.auth.url.replace(/\/(.)[^\\/]*\/?$/si, '/$1***');
                        break;

                    case 'oauth':
                        // @todo needs to be checked for Token
                        item.extra = item.appUrl;
                        break;

                    default:
                        return;
                        break;
                }

                this.activeList.push(payload);
            });
        },

        async openRecent(item) {
            if (item.authType === 'webhook') {
                this.openWebhook(item);
            }
        },

        async rememberAuth(index) {
            const saveId = await sendMessage({
                type: 'rememberAuth',
                payload: {
                    authId: this.activeList[index].authId,
                }
            });

            await this.getSavedList();
        },

        async forgetAuth(id) {
            if (!confirm('Удалить?')) {
                return;
            }

            await sendMessage({
                type: 'forgetAuth',
                payload: {
                    id: id
                }
            });

            await this.getSavedList();
        },

        async openSaved(id) {
            let result = await sendMessage({
                type: 'openSavedConnection',
                payload: {
                    id: id
                }
            });

            if (result === true) {
                window.close();
            }
        },

        async test() {
            channel.sendMessageWithMultipleResponses(TYPE_REQUEST_ACTIVE_CONNECTIONS, null, ({ payload }) => {
                console.log(payload);
            });
        }
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