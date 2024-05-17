User
<template>
  <div>
    <h2>出账收入类型编码</h2>
    <br>

    <el-table :data="paginatedData" style="width: 100%">
      <el-table-column label="出帐收入类型编码" prop="billingCode" ></el-table-column>
      <el-table-column label="出帐收入类型名称" prop="billingTypeName"></el-table-column>
    </el-table>

    <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios';
import { paginationMixin } from '../paginationMixin';

export default {
  mixins: [paginationMixin],
  data() {
    return {
    };
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:8080/encode/get_all', { params: { entityType: 'BillingType' } })
          .then(response => this.updatePaginationData(response.data.data))
          .catch(error => console.error(error));
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style>
.rejected-row .el-table__cell {
  color: red;
}
</style>