<template>
    <div class="row position-relative">
        <div class="col-5">
            <BaseSelect
                :options="availableMethods"
                :search="true"
                :select2Options="{
                    //tags: true,
                    //insertTag: addCustomMethod,
                }"
                v-model="method"
            />
            <div class="mt-2">
                <textarea
                    class="form-control textarea-data"
                    rows="10"
                    v-model="request"
                    @keydown="onKeyPress"
                >
                </textarea>
            </div>
            <div class="mt-2 d-flex justify-content-end">
                <div class="form-check mr-auto">
                    <small>
                        <input
                            class="form-check-input"
                            id="showManual"
                            type="checkbox"
                            style="margin-top: 6px;"
                            v-model="showManual"
                        />
                        <label class="form-check-label" for="showManual">Показать документацию</label>
                    </small>
                </div>
                <div class="btn-group" role="group">
                    <button class="btn btn-primary" @click="execute()">Выполнить</button>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="#" @click.prevent="exportAll" title="Все элементы будут получены с помощью постраничной навигации, а результат будет отдан в виде JSON-файла с массивом">Выгрузить всё в JSON...</a>
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
        <div class="col-7">
            <div class="mb-2">
                <div class="btn-group btn-group-sm btn-group-toggle">
                    <label
                        v-for="key of ['pretty', 'json']"
                        class="btn btn-light"
                        :class="{active: outputView === key}"
                    >
                        <input
                            type="radio"
                            v-model="outputView"
                            autocomplete="off"
                            :value="key"
                        />
                        {{ key }}
                    </label>
                </div>

                <button v-if="outputView === 'pretty'" class="btn btn-sm btn-light" @click="togglePretty()">
                    <span style="opacity: 0.7; font-size: 0.7rem;">► / <span style="display: inline-block; transform: rotate(90deg);">►</span></span>
                </button>
            </div>
            <div v-show="outputView === 'pretty'" ref="output_pretty"></div>
            <pre v-if="outputView === 'json'">{{ outputJson }}</pre>
        </div>

        <div class="loading-overlay" v-show="isLoading"></div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import BaseSelect from 'components/ui/BaseSelect.vue';
import JSONFormatter from 'json-formatter-js';
import Vue from 'vue';

export default {
    components: {
        BaseSelect,
    },

    data() {
        return {
            info: {},
            method: '',
            request: '',
            outputView: 'pretty',
            callResult: {},
            prettyExpanded: true,
            runtimeMethods: [],
            showManual: false,
            isLoading: false,
        };
    },

    computed: {
        availableMethods() {
            return this.methods.concat(this.runtimeMethods).map(item => ({ label: item, value: item }));
        },

        outputJson() {
            return JSON.stringify(this.callResult, null, 2);
        },

        ...mapState({
            methods: state => state.availableMethods,
        }),
    },

    watch: {
        callResult() {
            const $output = this.$refs['output_pretty'];
            $output.children.forEach((item) => $output.removeChild(item));

            const formatter = new JSONFormatter(this.callResult, 3, {
                animateOpen: false,
                animateClose: false,
            });

            let renderResult = formatter.render();

            // Get rid of links
            renderResult.querySelectorAll('.json-formatter-url').forEach(el => {
                let span = document.createElement('span');
                span.setAttribute('class', 'json-formatter-string');
                span.innerHTML = el.innerHTML;
                el.replaceWith(span);
            });

            this.$refs['output_pretty'].appendChild(renderResult);

            // Reset state after result re-render
            this.prettyExpanded = true;
        }
    },

    mounted() {
        this.prepareData();
    },

    methods: {
        async prepareData() {
            this.setBreadcrumb(['Консоль']);
        },

        async execute() {
            this.callResult = {};
            let requestObject = this.requestToObject(this.request);
            this.callResult = await BX24.request(this.method, requestObject);
        },

        requestToObject(request) {
            if (!request) {
                return {};
            }

            try {
                return Function('"use strict";return (' + request + ');')();
            } catch (ex) {
                console.error('Error while convert object', ex);
                return {};
            };
        },

        togglePretty() {
            this.prettyExpanded = !this.prettyExpanded;

            let selector = '.json-formatter-row';

            if (this.prettyExpanded) {
                selector += ':not(.json-formatter-open)';
            } else {
                selector += '.json-formatter-open';
            }

            selector += ' > .json-formatter-toggler-link';

            const event = new Event('click');

            this.$refs['output_pretty'].querySelector(':scope .json-formatter-children').querySelectorAll(selector).forEach((item) => {
                item.dispatchEvent(event);
            });
        },

        /**
         * Dirty workaround to be able to use methods, which aren't listed
         * in "methods", but available by scope (sale.* i.e.)
         */
        addCustomMethod(data, tag) {
            data.push(tag);
            this.runtimeMethods = [tag];
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

        async exportAll() {
            this.isLoading = true;

            try {
                let requestObject = this.requestToObject(this.request);
                let result = await BX24.fetchAll(this.method, requestObject);

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

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
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

    background-color: #FFFFFF99;
}
</style>