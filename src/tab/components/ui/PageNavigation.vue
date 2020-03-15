<template>
<ul class="pagination justify-content-end">
    <li class="page-item">
        <a v-if="current > 1" class="page-link" href="#" @click.prevent="$emit('change', current - 1)">&nbsp;←&nbsp;</a>
        <a v-else class="page-link">&nbsp;←&nbsp;</a>
    </li>

    <li
        v-for="page of pages"
        class="page-item"
        :class="{ active: page === current }"
    >
        <a v-if="page !== null" class="page-link" href="#" @click.prevent="$emit('change', page)">{{ page }}</a>
        <a v-else class="page-link">&hellip;</a>
    </li>

    <li class="page-item">
        <a v-if="current < total" class="page-link" href="#" @click.prevent="$emit('change', current + 1)">&nbsp;→&nbsp;</a>
        <a v-else class="page-link">&nbsp;→&nbsp;</a>
    </li>
</ul>
</template>

<script>
export default {
    props: {
        total: Number,
        current: Number,
    },

    computed: {
        pages() {
            const pages = [1];

            if (this.total > 1) {
                pages.push(2);
            }

            if (this.total > 2) {
                pages.push(3);
            }

            if (this.current - 1 > 3 && this.current - 1 < this.total - 2) {
                if (this.current - 1 - pages[pages.length - 1] > 1) {
                    pages.push(null);
                }

                pages.push(this.current - 1);
            }

            if (this.current > 3 && this.current < this.total - 2) {
                pages.push(this.current);
            }

            if (this.current + 1 > 3 && this.current < this.total - 3) {
                pages.push(this.current + 1);
            }

            if (this.total - 2 > 3) {

                if (this.total - 2 - pages[pages.length - 1] > 1) {
                    pages.push(null);
                }

                pages.push(this.total - 2);
            }

            if (this.total - 1 > 3) {
                pages.push(this.total - 1);
            }

            if (this.total > 3) {
                pages.push(this.total);
            }

            return pages;
        },
    },
}
</script>
