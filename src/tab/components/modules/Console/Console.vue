<template>
    <div class="row position-relative">
        <div class="col-5">
            <div v-if="expertMode" class="d-flex">
                <div class="btn-group btn-group-sm btn-group-toggle mb-2 mr-2">
                    <label
                        v-for="key of ['POST', 'GET']"
                        class="btn btn-light"
                        :class="{active: httpMethod === key}"
                    >
                        <input
                            type="radio"
                            v-model="httpMethod"
                            autocomplete="off"
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
                    //tags: false,
                    //insertTag: expertMode ? addCustomMethod : undefined,
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
                    v-model="body"
                    @keydown="onKeyPress"
                >
                </textarea>
            </div>

            <div class="mt-2 d-flex justify-content-end">
                <div class="form-check mr-auto">
                    <small>
                        <input class="form-check-input" id="showManual" type="checkbox" v-model="showManual" />
                        <label class="form-check-label" for="showManual">Показать документацию</label>
                    </small>
                </div>

                <div class="btn-group" role="group">
                    <button class="btn btn-primary" @click="execute()" title="Ctrl+Enter">Выполнить</button>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a
                                class="dropdown-item"
                                href="#"
                                title="Все элементы будут получены с помощью постраничной навигации, а результат будет отдан в виде JSON-файла с массивом"
                                @click.prevent="exportAll"
                            >
                                Выгрузить всё в JSON...
                            </a>
                            <a
                                class="dropdown-item d-flex"
                                href="#"
                                title="Возможность выполнения любых запросов"
                                @click.prevent="expertMode = !expertMode"
                            >
                                Экспертный режим<span class="ml-auto" v-show="expertMode">✓</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!!method && showManual" class="mt-4 mb-4 resizer">
                <iframe
                    :src="'https://util.bitrixsoft.com/example_b24/redirect.php?lang=ru&method=' + method"
                    width="100%"
                    frameborder="0"
                    style="border: 1px solid #ccc"
                    class="resized"
                ></iframe>
            </div>
        </div>
        <div class="col-7 pb-3">
            <Response :response="callResult" />
        </div>
        <div class="loading-overlay" v-show="isLoading"></div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import BaseSelect from 'components/ui/BaseSelect';
import BaseInput from 'components/ui/BaseInput';
import Response from './Response';
import yaml from 'js-yaml';
import methodsByScope from '@/tab/etc/methods';

export default {
    components: {
        BaseSelect,
        BaseInput,
        Response,
    },

    props: {
        queryMethod: String,
        queryCode: [String, Object],
    },

    data() {
        let inputMode = window.localStorage.getItem('console/inputMode') || 'js/json';
        let showManual = window.localStorage.getItem('console/showManual') === 'true';

        return {
            info: {},
            method: this.queryMethod || '',
            chosenMethod: this.queryMethod || '',
            body: this.queryCode ? (typeof this.queryCode === 'object' ? JSON.stringify(this.queryCode, null, 2) : this.queryCode) : '',
            callResult: {},
            runtimeMethods: [],
            showManual: showManual,
            isLoading: false,
            inputMode,
            expertMode: !!this.$route.query.expert,
            httpMethod: 'POST',
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

            /*result = result.concat(this.runtimeMethods.map((item) => ({
                label: item,
                value: item,
                group: 'methods',
            })));*/

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
    },

    mounted() {
        this.setBreadcrumb(['Консоль']);
    },

    methods: {
        async execute() {
            this.isLoading = true;

            try {
                this.callResult = {};
                let requestObject;

                if (this.inputMode === 'yaml') {
                    requestObject = this.yamlToObject(this.body);
                } else {
                    requestObject = this.codeToObject(this.body);
                }

                if (requestObject === false) {
                    this.isLoading = false;
                    return;
                }

                this.addToHistory({ method: this.method, data: this.body });
                this.callResult = await BX24.request(this.method, requestObject, { method: this.httpMethod });
            } finally {
                this.isLoading = false;
            }
        },

        codeToObject(request) {
            if (!request) {
                return {};
            }

            try {
                return Function('"use strict";return (' + request + ');')();
            } catch (ex) {
                alert('Ошибка парсинга кода');
                console.error('Error while convert object', ex);
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

        /**
         * Dirty workaround to be able to use methods, which aren't listed
         * in "methods", but available by scope (sale.* i.e.)
         */
        addCustomMethod(data, tag) {
            data.push(tag);
            this.runtimeMethods = [tag.id];
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

        setFromHistory(index) {
            this.method = this.history[index].method;
            this.body = this.history[index].data;
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

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),

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

.resizer {
    display: flex;
    height: 550px;
    margin: 0;
    padding: 0;
    resize: vertical;
    overflow: hidden;
}

.resizer > .resized {
    flex-grow: 1;
    margin: 0;
    padding: 0;
    border: 0
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
</style>