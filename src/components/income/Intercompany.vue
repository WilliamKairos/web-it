<template>
  <div>
    <!-- 表格标题 -->
    <h2>网间结算收入</h2>

    <br>
    <el-form-item>
      <el-button type="danger" @click="batchAdd">批量添加</el-button>
    </el-form-item>

    <el-dialog title="批量添加记录" v-model="batchAddDialogVisible" :closeOnClickModal="false">
      <el-form :model="batchAddForm" ref="batchAddForm" label-width="100px" :rules="batchAddFormRules">
        <el-row v-for="(record, index) in batchAddForm.batchRecords" :key="index">
          <el-col :span="4">
            <el-date-picker v-model="record.entryMonth" type="date" placeholder="选择日期"></el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.cityCode" placeholder="城市编码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.productCode" placeholder="产品编码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.billingTypeCode" placeholder="出账类型编码"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="record.entryAmount" placeholder="录入金额"></el-input>
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

  </div>
</template>

<script>
import axios from 'axios';
import Pagination from "@/components/Pagination.vue";

export default {
  data() {
    return {
      // queryForm: {
      //   entryMonth: '',
      //   cityCode: '',
      //   productCode: '',
      //   billingTypeCode: '',
      //   entryAmount: ''
      // },
      batchAddDialogVisible: false,
      batchAddFormRules: {
        batchRecords: [{ required: true, message: '请输入批量添加记录', trigger: 'blur' }],
      },
      batchAddForm: {
        batchRecords: [{}], // 初始化为空数组
      },
    };
  },
  methods: {

    submitBatchAddForm() {
      // Validate the batch add form
      const invalidRecords = this.batchAddForm.batchRecords.filter(record => {
        return (
            !record.entryMonth ||
            !record.cityCode ||
            !record.productCode ||
            !record.billingTypeCode ||
            !record.entryAmount
        );
      });

      if (invalidRecords.length > 0) {
        this.$message.error('请填写所有必填字段');
        return;
      }

      console.log(this.batchAddForm.batchRecords);
      // 向后端发送数据
      axios
          .post('http://localhost:8080/income/data_entry/addBatch/billing', this.batchAddForm.batchRecords) // 直接发送数组对象
          .then((response) => {
            if (response.data.code === 200) {
              this.batchAddDialogVisible = false;
              this.$message.success('添加成功');
            } else {
              this.$message.error('添加失败：' + response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error('添加失败，请检查网络连接或联系管理员');
          });
    },


    // submitBatchAddForm() {
    //   // Validate the batch add form
    //   const invalidRecords = this.batchAddForm.batchRecords.filter(record => {
    //     return (
    //         !record.entryMonth ||
    //         !record.cityCode ||
    //         !record.productCode ||
    //         !record.billingTypeCode ||
    //         !record.entryAmount
    //     );
    //   });
    //
    //   if (invalidRecords.length > 0) {
    //     this.$message.error('请填写所有必填字段');
    //     return;
    //   }
    //
    //   console.log(this.batchAddForm.batchRecords);
    //   // 向后端发送数据
    //   axios
    //       .post('http://localhost:8080/income/data_entry/addBatch/billing', {
    //         BillingIncomeList: this.batchAddForm.batchRecords, // 直接发送数组对象
    //       })
    //       .then((response) => {
    //         if (response.data.code === 200) {
    //           this.batchAddDialogVisible = false;
    //           this.$message.success('添加成功');
    //         } else {
    //           this.$message.error('添加失败：' + response.data.message);
    //         }
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //         this.$message.error('添加失败，请检查网络连接或联系管理员');
    //       });
    // },


    // submitBatchAddForm() {
    //   // Validate the batch add form
    //
    //   const invalidRecords = this.batchAddForm.batchRecords.filter(record => {
    //     return (
    //         !record.entryMonth ||
    //         !record.cityCode ||
    //         !record.productCode ||
    //         !record.billingTypeCode ||
    //         !record.entryAmount
    //     );
    //   });
    //
    //   if (invalidRecords.length > 0) {
    //     this.$message.error('请填写所有必填字段');
    //     return;
    //   }
    //
    //   this.$refs.batchAddForm.validate((valid) => {
    //     if (valid) {
    //       // Form is valid, parse and send the batch records to the backend
    //       // const records = this.batchAddForm.batchRecords.split('\n');
    //       const records = this.batchAddForm.batchRecords;
    //
    //       const parsedRecords = [];
    //
    //       for (const record of records) {
    //         const [entryMonth, cityCode, productCode, billingTypeCode, entryAmount] = record.split(',');
    //
    //         // Validate each field for each record
    //         if (!entryMonth || !cityCode || !productCode || !billingTypeCode || !entryAmount) {
    //           this.$message.error('批量添加记录格式不正确，请确保每行都包含记录月份,城市编码,产品编码,出账类型编码, 录入金额');
    //           return;
    //         }
    //
    //         parsedRecords.push({
    //           entryMonth,
    //           cityCode,
    //           productCode,
    //           billingTypeCode,
    //           entryAmount,
    //         });
    //       }
    //       console.log(parsedRecords);
    //       // Send the parsedRecords to the backend using Axios
    //       axios.post('http://localhost:8080/income/data_entry/addBatch/billing', parsedRecords)
    //           // .then((response) => {
    //           //   // Handle success
    //           //   this.batchAddDialogVisible = false;
    //           //   this.$message.success('批量添加成功');
    //           //   // You can also refresh the table by calling this.search() here
    //           // })
    //           // .catch((error) => {
    //           //   console.error(error);
    //           // });
    //           .then((response) => {
    //             // Handle success
    //             console.log(response.data);
    //             console.log(response.data.data);
    //             if (response.data.code === 200) {
    //               this.batchAddDialogVisible = false;
    //               this.$message.success('添加成功');
    //               // You can also refresh the table by calling this.search() here
    //               // this.search();
    //             } else {
    //               this.$message.error('添加失败：' + response.data.message);
    //             }
    //           })
    //           .catch((error) => {
    //             console.error(error);
    //             this.$message.error('添加失败，请检查网络连接或联系管理员');
    //           });
    //     }
    //   });
    // },

    batchAdd() {
      this.batchAddForm.batchRecords = [];

      this.batchAddDialogVisible = true;
    },
    addRow() {
      this.batchAddForm.batchRecords.push({
        entryMonth: '',
        cityCode: '',
        productCode: '',
        billingTypeCode: '',
        entryAmount: '',
      });
    },
    removeRecord(index) {
      this.batchAddForm.batchRecords.splice(index, 1);
    },

  },
  mounted() {
  },
};
</script>
