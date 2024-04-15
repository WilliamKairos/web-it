<template>
  <div>
    <!-- 表格标题 -->
    <h2>通知单收入</h2>

    <br>
    <el-form-item>
      <el-button type="success" @click="showAddDialog">添加</el-button>
    </el-form-item>

    <el-dialog title="添加记录" v-model="addDialogVisible" :closeOnClickModal="false">
      <el-form :model="addForm" ref="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item label="记录月份" prop="entryMonth">
          <el-date-picker v-model="addForm.entryMonth" type="date" placeholder="选择月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="城市编码" prop="cityCode">
          <el-input v-model="addForm.cityCode" placeholder="城市编码"></el-input>
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="addForm.productCode" placeholder="产品编码"></el-input>
        </el-form-item>
        <el-form-item label="出账类型编码" prop="billingTypeCode">
          <el-input v-model="addForm.billingTypeCode" placeholder="出账类型编码"></el-input>
        </el-form-item>
        <el-form-item label="记录金额" prop="entryAmount">
          <el-input v-model="addForm.entryAmount" placeholder="记录金额"></el-input>
        </el-form-item>
        <br>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">确认</el-button>
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
      addDialogVisible: false,
      addForm: {
        entryMonth: '',
        cityCode: '',
        productCode: '',
        billingTypeCode: '',
        entryAmount: ''
      },
      addFormRules: {
        entryMonth: [{ required: true, message: '请选择记录月份', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请输入城市编码', trigger: 'blur' }],
        productCode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
        billingTypeCode: [{ required: true, message: '请输入出账类型编码', trigger: 'blur' }],
        entryAmount: [{ required: true, message: '请输入记录金额', trigger: 'blur' }],
      },
    };
  },
  methods: {
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
                console.log(response.data.data);
                if (response.data.code === 200) {
                  this.addDialogVisible = false;
                  this.$message.success('添加成功');
                  // You can also refresh the table by calling this.search() here
                  // this.search();
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
    clearAddForm() {
      this.addForm = {
        entryMonth: '',
        cityCode: '',
        productCode: '',
        billingTypeCode: '',
        entryAmount: ''
      };
    },
  },
  mounted() {
    // this.search();
  },
};
</script>
