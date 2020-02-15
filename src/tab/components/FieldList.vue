<template>
    <div class="row mb-3">
        <div class="col">
            <table class="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>Код</th>
                        <th>Название</th>
                        <th>Тип</th>
                        <th>Множ</th>
                        <th>Обяз</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(field, code) in items">
                        <td>{{ code }}</td>
                        <td>{{ field.formLabel || field.title }}</td>
                        <td>{{ field.type }}</td>
                        <td>{{ field.isMultiple ? '●' : '' }}</td>
                        <td>{{ field.isRequired ? '●' : '' }}</td>
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