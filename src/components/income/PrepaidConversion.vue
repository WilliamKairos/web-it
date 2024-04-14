<template>
  <div>
    <!-- 表格标题 -->
    <h2>卡销售收入</h2>
    <br>

    <!-- 表格数据 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="记录月份" prop="entryMonth" :formatter="formatEntryMonth"></el-table-column>
      <el-table-column label="城市编码" prop="cityCode"></el-table-column>
      <el-table-column label="产品编码" prop="productCode"></el-table-column>
      <el-table-column label="计算类型编码" prop="billingTypeCode"></el-table-column>
      <el-table-column label="记录金额" prop="entryAmount"></el-table-column>
      <el-table-column label="稽核状态" prop="auditStatus" :formatter="getAuditStatus"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [], // Initialize as an empty array
    }
  },
  methods: {
    getAll() {
      // Define the back-end API URL
      const apiUrl = 'http://localhost:8080/income/get_all';

      // Use Axios to send a GET request to the back-end
      axios.get(apiUrl, {
        params: {
          entityType: "BillingIncome"
        }
      })
          .then((response) => {
            // Request successful handling
            console.log(response.data.data);
            this.tableData = response.data.data; // Update the front-end data
          })
          .catch((error) => {
            console.error(error);
          });
    },
    formatEntryMonth(row, column) {
      if (row.entryMonth) {
        const date = new Date(row.entryMonth);
        return date.toISOString().split('T')[0];
      }
      return '';
    },
    getAuditStatus(row, column) {
      switch (row.auditStatus){
        case "Pending":
          return '稽核中';
        case "Approved":
          return '稽核通过';
        case "Rejected":
          return '稽核不通过';
      }
      return '';
    }
  },
  mounted() {
    this.getAll(); // Trigger the search function on component mount
  },
};
</script>