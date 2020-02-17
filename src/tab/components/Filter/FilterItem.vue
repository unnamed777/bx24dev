<template>
<div class="form-group row">
    <label class="col-6">
        <template>
            <select class="form-control form-control-sm" v-model="code">
                <option></option>
                <option v-for="field in fieldsSorted" v-bind:value="field.code">{{ field.label }} ({{ field.code }})</option>
            </select>
        </template>
        <!--<template v-else>
            <a href="#" v-on:click.prevent="editMode = true">{{ fields[code].label }}</a>
        </template>-->
    </label>
    <div class="col-6">
        <div class="input-group">
            <div class="input-group-prepend" v-show="code">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown">{{ this.operator }}</button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="#" v-on:click="operator = '='">=</a>
                    <a class="dropdown-item" href="#" v-on:click="operator = '<'">&lt;</a>
                    <a class="dropdown-item" href="#" v-on:click="operator = '<='">&lt;=</a>
                    <a class="dropdown-item" href="#" v-on:click="operator = '>'">&gt;</a>
                    <a class="dropdown-item" href="#" v-on:click="operator = '>='">&gt;=</a>
                </div>
            </div>
            <input type="text" class="form-control form-control-sm" v-model="value" v-bind:disabled="!code">
        </div>
    </div>
</div>
</template>

<script>
export default {
    model: {
        prop: 'item',
        event: 'change',
    },

    props: {
        fields: {
            type: Object,
            default: () => { return {}; },
        },
        item: Object,
    },

    data() {
        return {
            code: null,
            value: null,
            operator: '=',
        };
    },

    computed: {
        fieldsSorted() {
            return Object.values(this.fields).sort((a, b) => a.sort - b.sort);
        }
    },

    watch: {
        code() {
            this.notify();
        },
        value() {
            this.notify();
        },
        operator() {
            this.notify();
        }
    },

    mounted() {
        $(this.$el.querySelector('.dropdown-toggle')).dropdown();
    },

    methods: {
        notify() {
            this.$emit('change', {
                code: this.code,
                value: this.value,
                operator: this.operator,
            });
        }
    }
};
</script>