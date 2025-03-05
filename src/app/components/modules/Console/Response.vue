<template>
    <div>
        <div class="mb-2">
            <div class="btn-group btn-group-sm btn-group-toggle mr-2">
                <label
                    v-for="key of ['pretty', 'json', 'table']"
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
                    class="btn btn-sm btn-light mr-1"
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
        <div v-if="outputView === 'table'">
            <table v-if="outputTable" class="table table-sm table-hover">
                <thead>
                    <tr>
                        <th v-for="column of outputTable.columns">{{ column }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item of outputTable.items">
                        <td v-for="column of outputTable.columns">{{ print(item[column]) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import JSONFormatter from "json-formatter-js";

export default {
    props: {
        response: Object,
    },

    emits: ['changeView'],

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

        outputTable() {
            let json = this.response;

            if (!json) {
                return null;
            }

            if (json.result === undefined) {
                return null;
            }

            let keys = Object.keys(json.result);

            if (keys.length === 0) {
                return null;
            }

            let items;
            let obj;

            // Try to find items
            if (keys.length === 1) {
                if (Array.isArray(json.result[keys[0]])) {
                    items = json.result[keys[0]];
                } else {
                    obj = json.result[keys[0]];
                }
            } else {
                obj = json.result;
            }

            // Convert object to array
            if (obj !== undefined) {
                items = [];

                for (let [field, data] of Object.entries(obj)) {
                    items.push({
                        null: field,
                    ...data
                    });
                }
            }

            if (items.length === 0) {
                return null;
            }

            let columns = Object.keys(items[0]);

            return {
                columns,
                items,
            };
        },
    },

    watch: {
        response() {
            const objectDepth = (o) => Object (o) === o ? 1 + Math .max (-1, ... Object .values(o) .map (objectDepth)) : 0;
            this.maxDepth = objectDepth(this.response);
            this.expandLevel = this.maxDepth;
            this.prettyExpanded = true;
            this.jsonFormatter();
        },

        outputView() {
            this.$emit('changeView', this.outputView);
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
        },

        print(value) {
            if (value === true) {
                return 'true';
            }

            if (value === false) {
                return 'false';
            }

            if (value === undefined) {
                return 'undefined';
            }

            if (value === null) {
                return 'null';
            }

            return value;
        }
    },
};
</script>