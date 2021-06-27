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

            <template v-if="outputView === 'pretty'">
                <button
                    class="btn btn-sm btn-light"
                    :title="'Правый клик – -1 уровень глубины'"
                    @mouseup="collapse"
                    @contextmenu.prevent
                >
                    <span style="opacity: 0.7; font-size: 0.7rem;">►</span>
                </button>

                <button
                    class="btn btn-sm btn-light"
                    :title="'Правый клик – +1 уровень глубины'"
                    @mouseup="expand"
                    @contextmenu.prevent
                >
                    <span style="opacity: 0.7; font-size: 0.7rem; display: inline-block; transform: rotate(90deg);">►</span>
                </button>
            </template>
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
            expandLevel: 4,
            maxDepth: 10,
        };
    },

    computed: {
        outputJson() {
            return JSON.stringify(this.response, null, 2);
        },
    },

    watch: {
        response() {
            const objectDepth = (o) => Object (o) === o ? 1 + Math .max (-1, ... Object .values(o) .map (objectDepth)) : 0;
            this.maxDepth = objectDepth(this.response);
            this.expandLevel = this.maxDepth;
            this.prettyExpanded = true;
            this.jsonFormatter();
        }
    },

    methods: {
        jsonFormatter() {
            const $output = this.$refs['output_pretty'];

            for (let item of $output.children) {
                $output.removeChild(item);
            }

            const formatter = new JSONFormatter(this.response, this.expandLevel, {
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

        togglePretty(e) {
            //this.prettyExpanded = this.prettyExpanded;
            if (e.button === 2) {
                if (e.metaKey === true || e.ctrlKey === true) {
                    this.expandLevel--;
                } else {
                    this.expandLevel++;
                }
            } else {
                this.expandLevel = this.expandLevel === 1 ? 10 : 1;
            }

            this.jsonFormatter();
        },

        expand(e) {
            this.expandLevel = e.button === 2 ? Math.min(this.maxDepth, this.expandLevel + 1) : this.maxDepth;
            this.jsonFormatter();
        },

        collapse(e) {
            this.expandLevel = e.button === 2 ? Math.max(1, this.expandLevel - 1) : 1;
            this.jsonFormatter();
        }
    },
};
</script>