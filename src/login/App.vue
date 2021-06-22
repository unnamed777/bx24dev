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
                                <input class="form-control" id="webhookUrl" type="text" name="url" ref="webhookUrl" placeholder="&quot;webhook url&quot; или &quot;domain user_id key&quot;" />
                            </div>
                            <div class="col-1">
                                <button class="btn btn-primary" type="submit" tabindex="-1">➤</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="mb-5">
                    <h4>Токен</h4>
                    <form class="token-form" @submit.prevent="tokenSubmit">
                        <div class="form-row">
                            <div class="col">
                                <input class="form-control" type="text" name="domain" placeholder="domain" /><br/>
                            </div>
                            <div class="col-1"></div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <input class="form-control"type="text" name="token" placeholder="access_token" />
                            </div>
                            <div class="col-1">
                                <button class="btn btn-primary" type="submit" tabindex="-1">➤</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div v-if="this.recentList.length > 0" class="mb-5">
                    <h4>Недавние подключения</h4>
                    <div v-for="(item, index) of recentList" class="auth-item recent-item mb-2">
                        <div class="auth-item__body">
                            <div class="auth-item__title" @click="openRecent(index)"><b>{{ item.portal }} / {{ item.title }}</b></div>
                            <small class="text-secondary">{{ item.extra }}</small>
                        </div>
                        <div class="auth-item__actions">
                            <StarIcon
                                class="recent-item__save"
                                :class="{ 'recent-item__save--saved': savedIds.includes(item.id) }"
                                @click="savedIds.includes(item.id) ? forgetAuth(item.id) : rememberAuth(index)"
                            />
                        </div>
                    </div>
                </div>

                <div v-if="this.savedList.length > 0" class="mb-5">
                    <h4>Сохранённые подключения</h4>
                    <div v-for="(item, index) of savedList" class="auth-item saved-item mb-2">
                        <div class="auth-item__body">
                            <div class="auth-item__title" @click="openSaved(item.id)"><b>{{ item.title }} {{ item.portal }}</b></div>
                            <small class="text-secondary">{{ item.extra }}</small>
                        </div>
                        <div class="auth-item__actions">
                            <CloseIcon class="saved-item__delete" @click="forgetAuth(item.id)"/>
                        </div>
                    </div>
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
import browser from 'webextension-polyfill';
import { StarIcon, CloseIcon } from 'vue-bytesize-icons';

export default {
    components: {
        StarIcon,
        CloseIcon,
    },

    data() {
        return {
            recentList: [],
            savedList: [],
        };
    },

    mounted() {
        this.$refs['webhookUrl'].focus();
        this.getSavedList();
        this.getRecentList();
    },

    computed: {
        savedIds() {
            return this.savedList.map(item => item.id);
        }
    },

    methods: {
        create(name, payload) {
            (window.browser || chrome).runtime.sendMessage(null, {
                type: 'createExtensionInstance',
                payload: {
                    providerName: name,
                    providerPayload: payload,
                }
            });
        },

        webhookSubmit() {
            const webhook = document.getElementById('webhookUrl').value;

            if (/^https:\/\/[^/]+\/rest\/[0-9]+\/[^/]+/.test(webhook) === false && /^\S+\s+[0-9]+\s+\S+$/.test(webhook) === false) {
                alert('Неверный формат данных для вебхука');
                return;
            }

            this.create('webhook', {
                url: document.getElementById('webhookUrl').value,
            });

            setTimeout(() => window.close(), 50);
        },

        tokenSubmit() {
            this.create('token', {
                domain: document.getElementById('tokenDomain').value,
                token: document.getElementById('tokenToken').value,
            });
        },

        async getSavedList() {
            // noinspection JSVoidFunctionReturnValueUsed
            this.savedList = await (window.browser || chrome).runtime.sendMessage(null, {
                type: 'getSavedList',
                payload: {}
            });

            for (let item of this.savedList) {
                if (item.type === 'webhook') {
                    item.extra = item.url.replace(/\/(.)[^\\/]*$/si, '/$1***');
                }
            }
        },

        async getRecentList() {
            // noinspection JSVoidFunctionReturnValueUsed
            this.recentList = await (window.browser || chrome).runtime.sendMessage(null, {
                type: 'getRecentList',
                payload: {}
            });
            console.log(this.recentList);

            for (let item of this.recentList) {
                switch (item.type) {
                    case 'webhook':
                        item.extra = item.url.replace(/\/(.)[^\\/]*$/si, '/$1***');
                        break;

                    case 'oauth':
                        item.extra = item.clientId;
                        break;
                }
            }
        },

        async openRecent(index) {
            const result = await (window.browser || chrome).runtime.sendMessage(null, {
                type: 'openRecentConnection',
                payload: {
                    authId: this.recentList[index].authId,
                }
            });

            if (result === true) {
                window.close();
            }
        },

        async rememberAuth(index) {
            const saveId = await (window.browser || chrome).runtime.sendMessage(null, {
                type: 'rememberAuth',
                payload: {
                    authId: this.recentList[index].authId,
                }
            });

            await this.getSavedList();
        },

        async forgetAuth(id) {
            if (!confirm('Удалить?')) {
                return;
            }

            await browser.runtime.sendMessage(null, {
                type: 'forgetAuth',
                payload: {
                    id: id
                }
            });

            await this.getSavedList();
        },

        async openSaved(id) {
            await browser.runtime.sendMessage(null, {
                type: 'createExtensionInstanceBySavedId',
                payload: {
                    id: id
                }
            });
        },
    },
}
</script>

<style lang="scss">
* {
    font-size: 20px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"
}

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
    display: flex;
    line-height: 1.2em;

    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;

    &__body {
        flex: 1 1 auto;
        cursor: default;
    }

    &__title {
        cursor: pointer;
    }

    &__actions {
        display: flex;
        width: 32px;
        flex: 0 0 32px;

        justify-content: space-around;
    }
}

.recent-item {
    &__save {
        width: 20px;
        height: 20px;
        opacity: 0.5;
        cursor: pointer;

        &--saved {
            opacity: 1;
        }
    }
}

.saved-item {
    &__delete {
        width: 16px;
        height: 16px;
        opacity: 0.5;
        cursor: pointer;

        &--saved {
            opacity: 1;
        }
    }
}
</style>