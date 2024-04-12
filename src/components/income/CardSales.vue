<template>
  <div>
    <!-- 表格标题 -->
    <h2>卡销售收入</h2>
    <br>

    <!-- 城市查找按钮 -->
    <el-button type="primary" @click="openCitySearchDialog">城市查找</el-button>

    <!-- 产品查找按钮 -->
    <el-button type="primary" @click="openProductSearchDialog">产品查找</el-button>

<!--    刷新按钮-->
    <el-button type="primary" @click="refresh">刷新</el-button>




    <!-- 表格数据 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="记录月份" prop="entryMonth" :formatter="formatEntryMonth"></el-table-column>
      <el-table-column label="城市编码" prop="cityCode"></el-table-column>
      <el-table-column label="产品编码" prop="productCode"></el-table-column>
      <el-table-column label="计算类型编码" prop="billingTypeCode"></el-table-column>
      <el-table-column label="记录金额" prop="entryAmount"></el-table-column>
      <el-table-column label="稽核状态" prop="auditStatus" :formatter="getAuditStatus"></el-table-column>
    </el-table>

    <!-- 城市查找弹窗 -->
    <el-dialog title="城市查找" v-model="citySearchDialogVisible" @close="closeCitySearchDialog">
      <el-input v-model="citySearchKeyword" placeholder="输入城市名称"></el-input>
      <el-button type="primary" @click="searchByCity">查找</el-button>
    </el-dialog>

    <!-- 产品查找弹窗 -->
    <el-dialog title="产品查找" v-model="productSearchDialogVisible" @close="closeProductSearchDialog">
      <el-input v-model="productSearchKeyword" placeholder="输入产品名称"></el-input>
      <br>
      <el-button type="primary" @click="searchByProduct">查找</el-button>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [], // Initialize as an empty array
      citySearchDialogVisible: false, // 控制城市查找弹窗显示/隐藏
      productSearchDialogVisible: false, // 控制产品查找弹窗显示/隐藏
      citySearchKeyword: '', // 城市查找关键字
      productSearchKeyword: '', // 产品查找关键字
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
      switch (row.auditStatus) {
        case "Pending":
          return '稽核中';
        case "Approved":
          return '稽核通过';
        case "Rejected":
          return '稽核不通过';
      }
      return '';
    },
    openCitySearchDialog() {
      this.citySearchDialogVisible = true;
    },

    closeCitySearchDialog() {
      this.citySearchDialogVisible = false;
    },

    searchByCity() {
      // 发送城市查找请求，使用 this.citySearchKeyword 作为关键字
      const apiUrl = 'http://localhost:8080/income/data_entry/find/by_city';
      axios.get(apiUrl, {
        params: {
          entityType: "BillingIncome",
          name: this.citySearchKeyword
        }
      })
          .then((response) => {
            console.log(response.data.data);
            this.tableData = response.data.data;
            this.closeCitySearchDialog(); // 关闭城市查找弹窗
          })
          .catch((error) => {
            console.error(error);
          });
    },

    openProductSearchDialog() {
      this.productSearchDialogVisible = true;
    },

    closeProductSearchDialog() {
      this.productSearchDialogVisible = false;
    },

    searchByProduct() {
      // 发送产品查找请求，使用 this.productSearchKeyword 作为关键字
      const apiUrl = 'http://localhost:8080/income/data_entry/find/by_product';
      axios.get(apiUrl, {
        params: {
          entityType: "BillingIncome",
          name: this.productSearchKeyword
        }
      })
          .then((response) => {
            console.log(response.data.data);
            this.tableData = response.data.data;
            this.closeProductSearchDialog(); // 关闭产品查找弹窗
          })
          .catch((error) => {
            console.error(error);
          });
    },

    refresh(){
      this.getAll();
    }
  },
  mounted() {
    this.getAll(); // Trigger the search function on component mount
  },
};
</script>

