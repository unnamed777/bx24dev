<template>
    <div class="row">
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
                <button class="btn btn-primary" @click="execute()">Выполнить</button>
            </div>

            <div v-if="method" class="mt-4 mb-4">
                <div></div>
                <iframe
                    v-if="method"
                    :src="'https://util.bitrixsoft.com/example_b24/redirect.php?lang=ru&method=' + method"
                    width="100%"
                    height="600"
                    frameborder="0"
                    style="border: 1px solid #ccc"
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

            this.$refs['output_pretty'].appendChild(formatter.render());

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
</style>