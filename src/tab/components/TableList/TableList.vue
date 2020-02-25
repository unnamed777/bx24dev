<template>
    <div class="mb-3">
        <table class="table table-sm table-hover">
            <thead>
                <tr>
                    <th v-for="field in columns" v-bind:title="field.code" @click="sort = field.code">{{ field.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemsSorted">
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

    data() {
        return {
            sort: null,
        };
    },

    computed: {
        itemsSorted() {
            if (!this.sort) {
                return this.items;
            }

            return this.items.sort((a, b) => {
                return a[this.sort] < b[this.sort] ? -1 : 1;
            });
        }
    }
}
</script>

<style lang="scss" scoped="">
table th {
    cursor: pointer;
}
</style>