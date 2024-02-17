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
            const pages = [];
            let start;
            let end;

            if (this.current <= 4) {
                start = -1 * (this.current + 1);
                end = 7 - this.current;
            } else if (this.current > this.total - 4) {
                start = -1 * (7 - (this.total - this.current + 1));
                end = this.total - this.current;
            } else {
                start = -2;
                end = 2;
            }

            for (let i = start; i <= end; i++) {
                if (this.current + i > 0 && this.current + i <= this.total) {
                    pages.push(this.current + i);
                }
            }

            if (pages[0] !== 1) {
                pages.unshift(null);
                pages.unshift(1);
            }

            if (pages[pages.length - 1] !== this.total) {
                pages.push(null);
                pages.push(this.total);
            }

            return pages;
        },
    },
}
</script>
