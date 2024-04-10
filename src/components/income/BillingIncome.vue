<template>
  <div>
    <!-- 表格标题 -->
    <h2>账单收入</h2>

    <br>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="success" @click="showAddDialog">添加</el-button>
        <el-button type="danger" @click="batchAdd">批量添加</el-button>
      </el-form-item>

<!--    </el-form>-->

    <!-- 表格数据 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="记录月份" prop="recordMonth"></el-table-column>
      <el-table-column label="城市编码" prop="cityCode"></el-table-column>
      <el-table-column label="产品编码" prop="productCode"></el-table-column>
      <el-table-column label="计算类型编码" prop="calculationTypeCode"></el-table-column>
      <el-table-column label="记录金额" prop="recordAmount"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="editRecord(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteRecord(scope.row)">删除</el-button>
          <el-checkbox @change="selectRow(scope.row)" :value="selectedRows.includes(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加记录" v-model="addDialogVisible" :closeOnClickModal="false">
      <el-form :model="addForm" ref="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item label="记录月份" prop="recordMonth">
          <el-date-picker v-model="addForm.recordMonth" type="month" placeholder="选择月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="城市编码" prop="cityCode">
          <el-input v-model="addForm.cityCode" placeholder="城市编码"></el-input>
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="addForm.productCode" placeholder="产品编码"></el-input>
        </el-form-item>
        <el-form-item label="计算类型编码" prop="calculationTypeCode">
          <el-input v-model="addForm.calculationTypeCode" placeholder="计算类型编码"></el-input>
        </el-form-item>
        <br>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量添加记录" v-model="batchAddDialogVisible" :closeOnClickModal="false">
      <el-form :model="batchAddForm" ref="batchAddForm" label-width="100px" :rules="batchAddFormRules">
        <el-row v-for="(record, index) in batchAddForm.batchRecords" :key="index">
          <el-col :span="4">
            <el-date-picker v-model="record.recordMonth" type="month" placeholder="选择月份"></el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.cityCode" placeholder="城市编码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.productCode" placeholder="产品编码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.calculationTypeCode" placeholder="计算类型编码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="removeRecord(index)">移除</el-button>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button type="success" @click="addRow">新增一行</el-button>
    <el-button @click="batchAddDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitBatchAddForm">确认批量添加</el-button>
  </span>
    </el-dialog>


    <!-- 分页 -->

  </div>
</template>

<script>
import axios from 'axios';
import Pagination from "@/components/Pagination.vue";

export default {
  data() {
    return {
      queryForm: {
        recordMonth: '',
        cityCode: '',
        productCode: '',
        calculationTypeCode: '',
      },
      tableData: [],
      addDialogVisible: false,
      addForm: {
        recordMonth: '',
        cityCode: '',
        productCode: '',
        calculationTypeCode: '',
      },
      addFormRules: {
        recordMonth: [{ required: true, message: '请选择记录月份', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请输入城市编码', trigger: 'blur' }],
        productCode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
        calculationTypeCode: [{ required: true, message: '请输入计算类型编码', trigger: 'blur' }],
      },
      batchAddDialogVisible: false,
      batchAddFormRules: {
        batchRecords: [{ required: true, message: '请输入批量添加记录', trigger: 'blur' }],
      },
      batchAddForm: {
        batchRecords: [], // 初始化为空数组
      },
    };
  },
  methods: {
    search() {
      // 定义后端查询接口的URL
      const apiUrl = 'http://localhost:8080/income/get_all';

      // 向查询参数对象添加 entityType
      this.queryForm.entityType = 'BillingIncome';

      // 使用 Axios 发送 GET 请求，并将查询参数传递给后端
      axios.get(apiUrl, {
        params: this.queryForm, // 这里将前端的查询参数传递给后端
      })
          .then((response) => {
            // 请求成功的处理逻辑
            this.tableData = response.data; // 更新前端数据
          })
          .catch((error) => {
            console.error(error);
          });
    },

    showAddDialog() {

      this.addDialogVisible = true;

      this.$nextTick(() => {
        this.$refs.addForm.resetFields(); // 在nextTick回调中调用以确保视图更新完成
      });
    },
    submitAddForm() {
      // Validate the form
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // Form is valid, send a request to the backend using Axios
          console.log(this.addForm);
          axios.post('http://localhost:8080/income/data_entry/add/billing', this.addForm)
              .then((response) => {
                // Handle success
                console.log(response.data);
                console.log(response.data.data());
                if (response.data.code === 200) {
                  this.addDialogVisible = false;
                  this.$message.success('添加成功');
                  // You can also refresh the table by calling this.search() here
                  this.search();
                } else {
                  this.$message.error('添加失败：' + response.data.message);
                }
              })
              .catch((error) => {
                console.error(error);
                this.$message.error('添加失败，请检查网络连接或联系管理员');
              });
        }
      });
    },

    submitBatchAddForm() {
      // Validate the batch add form

      const invalidRecords = this.batchAddForm.batchRecords.filter(record => {
        return (
            !record.recordMonth ||
            !record.cityCode ||
            !record.productCode ||
            !record.calculationTypeCode
        );
      });

      if (invalidRecords.length > 0) {
        this.$message.error('请填写所有必填字段');
        return;
      }


      this.$refs.batchAddForm.validate((valid) => {
        if (valid) {
          // Form is valid, parse and send the batch records to the backend
          // const records = this.batchAddForm.batchRecords.split('\n');
          const records = this.batchAddForm.batchRecords;

          const parsedRecords = [];

          for (const record of records) {
            const [recordMonth, cityCode, productCode, calculationTypeCode] = record.split(',');

            // Validate each field for each record
            if (!recordMonth || !cityCode || !productCode || !calculationTypeCode) {
              this.$message.error('批量添加记录格式不正确，请确保每行都包含记录月份,城市编码,产品编码,计算类型编码');
              return;
            }

            parsedRecords.push({
              recordMonth,
              cityCode,
              productCode,
              calculationTypeCode,
            });
          }

          // Send the parsedRecords to the backend using Axios
          axios.post('/your-batch-api-endpoint', parsedRecords)
              .then((response) => {
                // Handle success
                this.batchAddDialogVisible = false;
                this.$message.success('批量添加成功');
                // You can also refresh the table by calling this.search() here
              })
              .catch((error) => {
                console.error(error);
              });
        }
      });
    },

    batchAdd() {
      this.batchAddForm.batchRecords = [];

      this.batchAddDialogVisible = true;
    },
    addRow() {
      this.batchAddForm.batchRecords.push({
        recordMonth: '',
        cityCode: '',
        productCode: '',
        calculationTypeCode: '',
      });
    },
    removeRecord(index) {
      this.batchAddForm.batchRecords.splice(index, 1);
    },
    addRecord() {
      // 执行添加记录的逻辑，使用this.addForm中的数据
      // 可以根据需求实现
    },
    clearAddForm() {
      this.addForm = {
        recordMonth: '',
        cityCode: '',
        productCode: '',
        calculationTypeCode: '',
      };
    },
    editRecord(record) {
      // 编辑记录的逻辑，跳转到编辑页面或者弹出编辑框
      // 可以根据需求实现
    },
    deleteRecord(record) {
      // 删除记录的逻辑，弹出确认框，发送删除请求
      // 可以根据需求实现
    },
    handleCurrentChange(currentPage) {
      // 处理分页，更新currentPage，然后调用search方法
      this.currentPage = currentPage;
      this.search();
    },
  },
  selectRow(row) {
    if (this.selectedRows.includes(row)) {
      // 如果已选中，则取消选中
      const index = this.selectedRows.indexOf(row);
      this.selectedRows.splice(index, 1);
    } else {
      // 否则选中
      this.selectedRows.push(row);
    }
  },
  mounted() {
    this.search();
  },
};
</script>
