<template>
    <table class="enumeration-values table table-sm table-borderless mt-1 mb-0">
        <tbody>
            <tr v-for="(item) of enums">
                <td>{{ item.ID }}</td>
                <td>{{ item.VALUE }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        enums: {
            type: Array,
            required: true,
        },
    }
};
</script>

<style lang="scss" scoped>
.enumeration-values {
    font-size: 0.9rem;

    tr td:first-of-type {
        width: 70px;
    }

    td {
        padding: 0.15rem;
        white-space: normal;
    }
}
</style>
