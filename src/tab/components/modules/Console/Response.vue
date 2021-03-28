<template>
    <div>
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
</template>

<script>
import JSONFormatter from "json-formatter-js";

export default {
    props: {
        response: Object,
    },
    data() {
        return {
            body: this.queryCode ? (typeof this.queryCode === 'object' ? JSON.stringify(this.queryCode, null, 2) : this.queryCode) : '',
            outputView: 'pretty',
            prettyExpanded: true,
            runtimeMethods: [],
        };
    },

    computed: {
        outputJson() {
            return JSON.stringify(this.response, null, 2);
        },
    },

    watch: {
        response() {
            this.prettyExpanded = true;
            this.jsonFormatter();
        }
    },

    methods: {
        jsonFormatter() {
            const $output = this.$refs['output_pretty'];
            $output.children.forEach((item) => $output.removeChild(item));

            const formatter = new JSONFormatter(this.response, this.prettyExpanded ? 4 : 1, {
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
        },

        togglePretty() {
            this.prettyExpanded = !this.prettyExpanded;
            this.jsonFormatter();
        },
    },
};
</script>