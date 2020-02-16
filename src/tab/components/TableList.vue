<template>
    <div class="mb-3">
        <table class="table table-sm table-hover">
            <thead>
                <tr>
                    <th v-for="field in columns" v-bind:title="field.code">{{ field.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items">
                    <td v-for="field in columns">{{ item[field.code] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props: {
        columns: Array,
        items: Array,
    },
}
</script>