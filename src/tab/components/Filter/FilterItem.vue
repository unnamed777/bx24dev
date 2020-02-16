<template>
<div class="form-group row">
    <label class="col-6" :class="{'col-form-label': code}">
        <template v-if="code">
            <a href="#">{{ fields[code].label }}</a>
        </template>
        <template v-else>
            <select class="form-control" v-model="code">
                <option></option>
                <option v-for="field in fieldsSorted" v-bind:value="field.code">{{ field.label }} ({{ field.code }})</option>
            </select>
        </template>
    </label>
    <div class="col-6">
        <input type="text" class="form-control" v-model="value" v-bind:disabled="!code">
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
        }
    },

    mounted() {
    },

    methods: {
        notify() {
            this.$emit('change', {
                code: this.code,
                value: this.value
            });
        }
    }
};
</script>