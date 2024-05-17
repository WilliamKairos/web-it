<template>
  <div>
    <h2>产品编码</h2>
    <br>

    <el-table :data="paginatedData" style="width: 100%">
      <!-- 修改列的prop属性以匹配实体类字段 -->
      <el-table-column label="产品编码" prop="productCode"></el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <!-- 根据需要，您可以取消注释以下列，并在数据中包含这些属性 -->
      <!--
      <el-table-column label="是否使用" prop="isUse"></el-table-column>
      <el-table-column label="是否为计费收入" prop="isBillingIncome"></el-table-column>
      <el-table-column label="是否为卡销售收入" prop="isCardSalesIncome"></el-table-column>
      <el-table-column label="是否为互联收入" prop="isInterconnectIncome"></el-table-column>
      <el-table-column label="是否为通知收入" prop="isNotificationIncome"></el-table-column>
      <el-table-column label="是否为预付款转收入" prop="isPrepaymentToIncome"></el-table-column>
      -->
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
      axios.get('http://localhost:8080/encode/get_all', { params: { entityType: 'Product' } })
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
