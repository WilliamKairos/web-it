// paginationMixin.js
export const paginationMixin = {
    data() {
        return {
            total: 0,
            pageSize: 10,
            currentPage: 1,
            allData: []
        };
    },
    computed: {
        paginatedData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.allData.slice(start, end);
        }
    },
    methods: {
        handlePageChange(page) {
            this.currentPage = page;
        },
        updatePaginationData(allData) {
            this.allData = allData;
            this.total = allData.length;
        },
    },
};
