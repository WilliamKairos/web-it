<template>
  <div>
    <h2>结算操作员编码</h2>
    <br>

    <el-table :data="paginatedData" style="width: 100%">
      <!-- 修改列的prop属性以匹配实体类字段 -->
      <el-table-column label="操作员编码" prop="operatorCode"></el-table-column>
      <el-table-column label="操作员名称" prop="operatorName"></el-table-column>
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
      // ...其他数据...
    };
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:8080/encode/get_all', { params: { entityType: 'SettlementOperator' } })
          .then(response => this.updatePaginationData(response.data.data))
          .catch(error => console.error(error));
    },
    // ...其他方法...
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
