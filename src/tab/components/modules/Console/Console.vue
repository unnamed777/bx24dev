<template>
    <div class="row">
        <div class="col-5">
            <BaseSelect
                :options="availableMethods"
                :search="true"
                v-model="method"
            />
            <div class="mt-2">
                <textarea
                    class="form-control textarea-data"
                    rows="10"
                    v-model="request"
                >
                </textarea>
            </div>
            <div class="mt-2 d-flex justify-content-end">
                <button class="btn btn-primary" @click="execute()">Выполнить</button>
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

export default {
    components: {
        BaseSelect,
    },

    data() {
        return {
            info: {},
            method: 'crm.lead.fields',
            request: '',
            outputView: 'pretty',
            callResult: {},
            prettyExpanded: true,
        };
    },

    computed: {
        availableMethods() {
            return this.methods.map(item => ({ label: item, value: item }));
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

            const formatter = new JSONFormatter(this.callResult, 2, {
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
            let requestObject = this.requestToObject(this.request);
            this.callResult = await BX24.call(this.method, requestObject);
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
}

pre {
    font-size: 12px;
}
</style>