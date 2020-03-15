import PageNavigation from "components/ui/PageNavigation";

export default {
    components: {
        PageNavigation,
    },

    data() {
        return {
            currentPage: 1,
            totalPages: 0,
        };
    },

    methods: {
        onPageChange(page) {
            this.currentPage = page;
            this.loadEntries();
        },
    }
};