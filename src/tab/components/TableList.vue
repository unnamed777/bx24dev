<template>
    <div class="row mb-3">
        <div class="col">
            <table class="table table-sm table-hover">
                <thead>
                    <tr>
                        <th v-for="field in fields" v-bind:title="field.code">{{ field.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items">
                        <td v-for="field in fields">{{ item[field.code] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    props: ['fields', 'items'],
}
</script>