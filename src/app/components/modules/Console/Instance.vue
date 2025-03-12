<template>
    <div
        class="columns-container"
        :class="{
            'columns-container--wide': viewMode === 'wide',
        }"
        ref="container"
    >
        <div
            class="left-column"
            :style="{
                width: `${leftColumnWidth}px`,
                flexBasis: `${leftColumnWidth}px`,
             }"
        >
            <div class="left-column-top">
                <div v-if="expertMode" class="d-flex">
                    <div class="btn-group btn-group-sm btn-group-toggle mr-2">
                        <label
                            v-for="key of ['JSON', 'GET', 'POST']"
                            class="btn btn-light"
                            :class="{active: httpMethod === key}"
                        >
                            <input
                                type="radio"
                                v-model="httpMethod"
                                autocomplete="off"
                                spellcheck="false"
                                :value="key"
                            />
                            {{ key }}
                        </label>
                    </div>
                    <div class="w-100">
                        <BaseInput
                            v-if="expertMode"
                            v-model="chosenMethod"
                            @keydown.enter="onMethodInputEnter"
                        />
                    </div>
                </div>
                <BaseSelect
                    v-if="!expertMode"
                    :options="combinedMethods"
                    :groups="methodGroups"
                    :search="true"
                    :select2Options="{
                        width: '100%'
                    }"
                    :optionTemplate="select2Template"
                    v-model="chosenMethod"
                    ref="methodSelect"
                />

                <div class="mt-2">
                    <div class="btn-group btn-group-sm btn-group-toggle mb-2">
                        <label
                            v-for="key of ['js/json', 'yaml']"
                            class="btn btn-light"
                            :class="{active: inputMode === key}"
                        >
                            <input
                                type="radio"
                                v-model="inputMode"
                                autocomplete="off"
                                :value="key"
                            />
                            {{ key }}
                        </label>
                    </div>

                    <textarea
                        class="form-control textarea-data"
                        rows="10"
                        spellcheck="false"
                        v-model="body"
                        @keydown="onKeyPress"
                    >
                    </textarea>
                </div>

                <div class="mt-2 d-flex justify-content-end">
                    <div class="form-check mr-auto">
                        <small>
                            <input class="form-check-input" :id="'showManual' + instance.id" type="checkbox" v-model="showManual" />
                            <label class="form-check-label" :for="'showManual' + instance.id">Показать документацию</label>
                        </small>
                    </div>

                    <div class="btn-group" role="group">
                        <button class="btn btn-primary" ref="executeButton" @click="execute()" title="Ctrl+Enter">Выполнить</button>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a
                                    class="dropdown-item d-flex"
                                    :class="{ disabled: expertMode === true }"
                                    href="#"
                                    title="Отправлять тело запроса в виде JSON вместо url-encoded данных"
                                    @click.prevent="useJsonBody = !useJsonBody"
                                >
                                    Отправлять JSON<span class="ml-auto" v-show="useJsonBody">✓</span>
                                </a>
                                <a
                                    class="dropdown-item d-flex"
                                    href="#"
                                    title="Возможность выполнения любых запросов"
                                    @click.prevent="expertMode = !expertMode"
                                >
                                    Экспертный режим<span class="ml-auto" v-show="expertMode">✓</span>
                                </a>
                                <a
                                    class="dropdown-item"
                                    href="#"
                                    title="Все элементы будут получены с помощью постраничной навигации, а результат будет отдан в виде JSON-файла с массивом"
                                    @click.prevent="exportAll"
                                >
                                    Выгрузить всё в JSON-файл...
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="left-column-bottom">
                <div
                    v-if="!!method && showManual"
                    class="doc-iframe-container mt-4 mb-3"
                >
                    <iframe
                        :src="`https://unnamed777.github.io/bx24dev-rest-doc/${method}.html`"
                        width="100%"
                        frameborder="0"
                    ></iframe>
                </div>
            </div>
        </div>

        <div
            class="columns-divider"
            @mousedown="onDividerMouseDown"
        ></div>

        <div class="right-column pb-3">
            <Response
                :response="callResult"
                @changeView="onResponseChangeView"
            />
        </div>

        <div class="loading-overlay" v-show="isLoading"></div>

        <iframe
            v-if="isFirefox === false"
            ref="sandbox"
            src="/tab/helpers/sandbox_console.html"
            style="height: 0; width: 0; opacity: 0; position: absolute; top: -10px; left: -10px;"
        ></iframe>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import BaseSelect from 'components/ui/BaseSelect';
import BaseInput from 'components/ui/BaseInput';
import Response from './Response';
import yaml from 'js-yaml';
import methodsByScope from '@app/etc/methods';
import { getExposedPromise } from "lib/functions";
import { Portal } from "portal-vue";

export default {
    components: {
        BaseSelect,
        BaseInput,
        Response,
        Portal,
    },

    props: {
        queryMethod: String,
        queryCode: [String, Object],
        // @todo Use for memory optimization when the instance inactive
        instance: Object,
    },

    emits: ['methodChange'],

    data() {
        let inputMode = window.localStorage.getItem('console/inputMode') || 'js/json';
        let showManual = window.localStorage.getItem('console/showManual') === 'true';
        let useJsonBody = window.localStorage.getItem('console/useJsonBody') === 'true';

        this.sandboxResolves = {};

        return {
            info: {},
            method: this.queryMethod || '',
            chosenMethod: this.queryMethod || '',
            body: this.queryCode ? (typeof this.queryCode === 'object' ? JSON.stringify(this.queryCode, null, 2) : this.queryCode) : '',
            callResult: {},
            runtimeMethods: [],
            // @todo Sync with localStorage when instance become active
            showManual: showManual,
            isLoading: false,
            inputMode,
            expertMode: !!this.$route.query.expert,
            httpMethod: 'POST',
            useJsonBody: useJsonBody,
            executeButton: null,
            sandbox: null,
            isFirefox: (globalThis.browser || globalThis.chrome).runtime.getURL('').startsWith('moz-extension://'),
            viewMode: 'fixed',
            leftColumnWidth: 500,
        };
    },

    computed: {
        combinedMethods() {
            let result = [];

            if (this.history.length > 0) {
                result = result.concat(this.history.slice(0, 30).map((item, index) => ({
                    label: item.method,
                    value: `history_${index}`,
                    group: 'history',
                })));
            }

            result = result.concat(this.availableMethods.map((item) => ({
                label: item,
                value: item,
                group: 'methods',
            })));

            return result;
        },

        methodGroups() {
            if (this.history.length === 0) {
                return [];
            }

            return [
                { code: 'history', label: 'История' },
                { code: 'methods', label: 'Доступные методы' },
            ];
        },

        outputJson() {
            return JSON.stringify(this.callResult, null, 2);
        },

        availableMethods() {
            let methods = [...methodsByScope.general];

            for (let item of this.scope) {
                if (!methodsByScope[item]) {
                    continue;
                }

                methods = methods.concat(methodsByScope[item]);
            }

            methods.sort();

            return methods;
        },

        ...mapState({
            scope: state => state.scope,
            history: state => state.console.items,
        }),
    },

    watch: {
        chosenMethod(newValue) {
            if (newValue.indexOf('history_') === 0) {
                let index = newValue.substr(8);
                this.method = this.history[index].method;
                this.body = this.history[index].data;
            } else {
                this.method = newValue;
            }
        },

        inputMode(newValue) {
            window.localStorage.setItem('console/inputMode', newValue);
        },

        showManual(newValue) {
            window.localStorage.setItem('console/showManual', newValue);
        },

        useJsonBody(newValue) {
            window.localStorage.setItem('console/useJsonBody', newValue);
        },

        method() {
            this.$emit('methodChange', this.method);
        }
    },

    mounted() {
        // @todo Add support of multiple consoles
        window.addEventListener('message', this.onMessage.bind(this));
    },

    methods: {
        async execute() {
            this.$refs['executeButton'].blur();
            this.isLoading = true;

            try {
                this.callResult = {};
                let requestObject;

                if (this.inputMode === 'yaml') {
                    requestObject = this.yamlToObject(this.body);
                } else {
                    requestObject = await this.codeToObject(this.body);
                }

                if (requestObject === false) {
                    this.isLoading = false;
                    return;
                }

                this.addToHistory({ method: this.method, data: this.body });

                this.callResult = await BX24.request(this.method, requestObject, {
                    method: this.expertMode ? this.httpMethod : (this.useJsonBody ? 'JSON' : 'POST'),
                });
            } finally {
                this.isLoading = false;
            }
        },

        /**
         *
         * @param {String} request
         * @returns {Object}
         */
        codeToObject(request) {
            if (!request) {
                return {};
            }

            if (this.isFirefox) {
                return this.codeToObjectSimple(request);
            } else {
                return this.codeToObjectSandbox(request);
            }
        },

        /**
         * Evaluate js code and convert it to json via sandbox.
         * Safe method to eval() for manifest v3 supported by Chrome.
         * @see https://developer.chrome.com/docs/extensions/reference/manifest/sandbox
         */
        async codeToObjectSandbox() {
            const messageId = Date.now();
            const { promise, resolve } = getExposedPromise();
            this.sandboxResolves[messageId] = resolve;

            this.$refs['sandbox'].contentWindow.postMessage({
                type: 'eval',
                id: messageId,
                code: this.body,
            }, '*');

            const result = await promise;
            delete this.sandboxResolves[messageId];

            if (result.success !== true) {
                alert('Ошибка парсинга кода');
                return;
            }

            return JSON.parse(result.json);
        },

        /**
         * Simple code-to-json converter for Firefox.
         * It doesn't support sandbox yet.
         */
        codeToObjectSimple(request) {
            let str = request
                // Add quotes around keys
                .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
                // Replace single quotes with double quotes
                .replace(/'/g, '"')
                // Remove trailing commas before closing brackets
                .replace(/,\s*([}\]])/g, '$1')
                 // Remove consecutive commas
                .replace(/,(\s*,)+/g, ',');

            try {
                return JSON.parse(str);
            } catch (e) {
                console.error("Failed to convert: %s", str);
                alert('Ошибка парсинга кода');
                return false;
            }
        },


        yamlToObject(request) {
            if (!request) {
                return {};
            }

            request = request.replace(/^\t*/gm, (match) => match.replaceAll('\t', '  '));
            let result;

            try {
                result = yaml.load(request);
            } catch (ex) {
                alert('Ошибка парсинга кода\n' + ex);
                console.error('Error while convert object', ex);
                return false;
            }

            console.log('YAML to JSON:', result);

            if (typeof result !== 'object') {
                alert('Тело запроса должно быть либо пустым, либо объектом, получен ' + typeof(result));
                return false;
            }

            return result;
        },

        onKeyPress(e) {
            switch (true) {
                // Tab
                case e.key === 'Tab' && e.shiftKey === false && e.altKey === false && e.ctrlKey === false && e.metaKey === false:
                    e.preventDefault();
                    let start = e.target.selectionStart;
                    let end = e.target.selectionEnd;

                    e.target.value = e.target.value.substring(0, start) + "\t" + e.target.value.substring(end);
                    e.target.selectionStart = e.target.selectionEnd = start + 1;
                    e.target.dispatchEvent(new Event('input'));

                    break;

                // Ctrl+Enter or Cmd+Enter
                case e.key === 'Enter' && e.shiftKey === false && e.altKey === false && (e.ctrlKey === true || e.metaKey === true):
                    e.preventDefault();
                    this.execute();
                    break;
            }
        },

        onMethodInputEnter(e) {
            this.execute();
        },

        async exportAll() {
            let listDomain = prompt('Узел с результатами', 'items');

            if (listDomain === null) {
                return;
            } else if (!listDomain) {
                listDomain = 'items';
            }

            this.isLoading = true;

            try {
                let requestObject = this.codeToObject(this.body);
                let result = await BX24.fetchAll(this.method, requestObject, {
                    getter: (response) => response.result[listDomain],
                });

                const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });

                let link = document.createElement('a');
                link.download = 'export.json';
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
            } catch (ex) {
                console.error(ex);
                alert('Что-то пошло не так');
            } finally {
                this.isLoading = false;
            }
        },

        select2Template(option) {
            let result;

            switch (true) {
                // group
                case !!option.children:
                    result = $(`<span>${option.text}</span>`);
                    break;

                // option
                case !!option.id:
                    let extra;

                    if (option.id.indexOf('history_') === 0) {
                        extra = this.history[option.id.substr(8)].data;

                        if (extra.length > 100) {
                            extra = extra.substr(0, 100) + '&hellip;';
                        } else if (!extra) {
                            extra = '(empty body)';
                        }
                    }

                    result = $(`
                        <div class="option-field">
                            <div class="option-field__name">${option.text}</div>
                            ${extra ? `<div class="option-field__code">${extra}</div>` : ''}
                        </div>
                    `);
                    break;

                default:
                    break;
            }

            return result;
        },

        onMessage(e) {
            if (e.data.type !== 'eval') {
                return;
            }

            if (!this.sandboxResolves[e.data.id]) {
                return;
            }

            this.sandboxResolves[e.data.id](e.data);
        },

        onResponseChangeView(mode) {
            if (!['pretty', 'json', 'table'].includes(mode)) {
                throw new Error('Invalid mode');
            }

            this.viewMode = mode === 'table' ? 'wide' : 'fixed';
        },

        onDividerMouseDown(e) {
            this.isResizing = true;
            this.dragOffsetX = e.clientX - e.target.getBoundingClientRect().left;

            document.body.addEventListener('mousemove', this.onDividerDrag);
            document.body.addEventListener('mouseup', this.onDividerDragEnd);
        },

        onDividerDragEnd() {
            this.isResizing = false;

            document.body.removeEventListener('mousemove', this.onDividerMouseMove);
            document.body.removeEventListener('mouseup', this.onDividerDragEnd);
        },

        onDividerDrag(e) {
            if (!this.isResizing) {
                return;
            }

            const containerRect = this.$refs.container.getBoundingClientRect();
            let newLeftWidth = e.clientX - containerRect.left - this.dragOffsetX;
            newLeftWidth = Math.min(Math.max(newLeftWidth, 300), containerRect.width - 300);

            this.leftColumnWidth = newLeftWidth;
        },

        ...mapActions({
            addToHistory: 'console/addToHistory',
        }),
    }
};
</script>

<style lang="scss" scoped>
.textarea-data {
    font-family: monospace;
    font-size: 14px;

    -moz-tab-size: 2;
    tab-size: 2;
}

pre {
    font-size: 12px;
}

.doc-iframe-container {
    display: flex;
    // compensate mt-4 + mb-3
    height: calc(100% - 2.5rem);
    margin: 0;
    padding: 0;
    resize: vertical;
    overflow: hidden;

    iframe {
        flex-grow: 1;
        margin: 0;
        padding: 0;
        border: 1px solid #ccc;
    }
}

.loading-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;

    background-color: #FFFFFF99;
}

#showManual {
    margin-top: 6px;
}

.columns-container {
    position: relative;
    display: flex;
    height: 100%;

    //grid-gap: 15px;
    flex-flow: row nowrap;

    &--wide {
        width: max-content;
    }
}

.left-column {
    display: flex;
    height: 100%;
    max-height: 100%;
    overflow: auto;

    flex-flow: column nowrap;
    flex: 1 0 500px;
}

.left-column-top {
    flex: 0 0 auto;
}

.left-column-bottom {
    flex: 1 1 auto;
}

.right-column {
    overflow-y: auto;
    max-height: 100%;
    flex: 1 1 100%;

    .columns-container--wide & {
        flex-shrink: 0;
    }
}

.columns-divider {
    position: relative;
    width: 15px;
    cursor: col-resize;
    flex: 0 0 15px;

    &:hover {
        &:before {
            position: absolute;
            top: 0;
            left: 5px;
            bottom: 0;
            right: 5px;
            background-color: #f5f5f5;
            content: '';
        }
    }
}
</style>