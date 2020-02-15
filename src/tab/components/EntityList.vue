<template>
    <div class="row mb-3">
        <div class="col">
            <table class="table">
                <thead>
                    <tr>
                        <th>Код</th>
                        <th>Название</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="entity in items">
                        <td>{{ entity.ENTITY }}</td>
                        <td>{{ entity.NAME }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    props: ['items'],
}
</script>