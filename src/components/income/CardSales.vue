User
<template>
  <div>
    <h2>卡销售收入</h2>
    <br>



    <el-button type="success" v-if="userType === 'Admin' || userType === 'DataEntry'" @click="openAddDialog">添加</el-button>
    <el-button type="success" v-else @click="showPermissionDenied">添加</el-button>


    <el-button type="primary" v-if="userType === 'Admin' || userType === 'DataEntry'"  @click="$refs.fileInput.click()">批量添加</el-button>
    <el-button type="primary" v-else @click="showPermissionDenied">批量添加</el-button>

    <el-button type="primary" @click="openSearchDialog('city')">城市查找</el-button>
    <el-button type="primary" @click="openSearchDialog('product')">产品查找</el-button>

    <el-button type="primary" @click="freshData">刷新</el-button>
    <el-button type="warning" @click="exportToExcel">下载</el-button>
    <!-- 模板中的按钮，点击时触发隐藏的文件输入 -->

    <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;">

    <el-table :data="paginatedData" style="width: 100%" :row-class-name="getRowClass">
      <el-table-column label="记录月份" prop="entryMonth" :formatter="formatEntryMonth"></el-table-column>
      <el-table-column label="城市名称" :formatter="(row) => getNameByCode(row.cityCode, 'city')"></el-table-column>
      <el-table-column label="产品名称" :formatter="(row) => getNameByCode(row.productCode, 'product')"></el-table-column>
      <el-table-column label="计算类型名称" :formatter="(row) => getNameByCode(row.billingTypeCode, 'billingType')"></el-table-column>
      <el-table-column label="记录金额" prop="entryAmount"></el-table-column>
      <el-table-column label="稽核状态" prop="auditStatus" :formatter="getAuditStatus"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="danger" size="default" v-if="userType === 'Admin' || userType === 'DataEntry'" @click="handleDelete(row)">删除</el-button>
          <el-button type="danger" size="default" v-else @click="showPermissionDenied">删除</el-button>
          <el-button type="primary" size="default" v-if="userType === 'Admin' || userType === 'DataEntry'" @click="handleModify(row)">修改</el-button>
          <el-button type="primary" size="default" v-else @click="showPermissionDenied">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="稽核操作" width="200">
        <template #default="{ row }">
          <el-button type="success" size="default" v-if="userType === 'Admin' || userType === 'Auditor'" @click="handleAudit(row)">稽核</el-button>
          <el-button type="success" size="default" v-else @click="showPermissionDenied">稽核</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange">
    </el-pagination>

    <!-- 搜索对话框 -->
    <el-dialog :title="searchDialogTitle" v-model="searchDialogVisible" @close="closeSearchDialog">
      <el-select v-model="searchSelectedCode" placeholder="选择城市" v-if="searchType === 'city'">
        <el-option v-for="(city, code) in cityCodeMap" :key="code" :label="city" :value="city"></el-option>
      </el-select>
      <el-select v-model="searchSelectedCode" placeholder="选择产品" v-if="searchType === 'product'">
        <el-option v-for="(product, code) in productCodeMap" :key="code" :label="product" :value="product"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSearchDialog">取消</el-button>
        <el-button type="primary" @click="searchData">确定</el-button>
      </span>
    </el-dialog>

    <!-- 添加对话框 -->
    <el-dialog title="添加记录" v-model="addDialogVisible" @close="closeAddDialog">
      <el-form :model="addFormData" :rules="addFormRules" ref="addForm">
        <el-form-item label="记录日期" prop="entryMonth">
          <el-date-picker
              v-model="addFormData.entryMonth"
              type="date"
              placeholder="选择日期"
          ></el-date-picker>

        </el-form-item>
        <el-form-item label="城市名称" prop="cityCode">
          <el-select v-model="addFormData.cityCode" placeholder="选择城市">
            <el-option v-for="(city, code) in cityCodeMap" :key="code" :label="city" :value="city"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productCode">
          <el-select v-model="addFormData.productCode" placeholder="选择产品">
            <el-option v-for="(product, code) in productCodeMap" :key="code" :label="product" :value="product"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计算类型名称" prop="billingTypeCode">
          <el-select v-model="addFormData.billingTypeCode" placeholder="选择类型">
            <el-option v-for="(type, code) in billingTypeCodeMap" :key="code" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录金额" prop="entryAmount">
          <el-input v-model="addFormData.entryAmount" placeholder="输入金额"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取消</el-button>
        <el-button type="primary" @click="addData">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改记录" v-model="showEditDialog" @close="cancelEdit">
      <el-form v-if="editingRecord" :model="editingRecord" label-width="120px" :rules="rules" ref="editForm">
        <el-form-item label="记录月份" prop="entryMonth">
          <el-date-picker v-model="editingRecord.entryMonth" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="城市名称" prop="cityCode">
          <el-select v-model="selectedCityName">
            <el-option v-for="(name, code) in cityCodeMap" :key="code" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productCode">
          <el-select v-model="selectedProductName">
            <el-option v-for="(name, code) in productCodeMap" :key="code" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计算类型名称" prop="billingTypeCode">
          <el-select v-model="selectedBillingTypeName">
            <el-option v-for="(name, code) in billingTypeCodeMap" :key="code" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录金额" prop="entryAmount">
          <el-input v-model.number="editingRecord.entryAmount"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="稽核状态修改" v-model="showAuditDialog" @close="cancelAudit">
      <div>
        <el-button type="success" @click="confirmAudit('Approved')">稽核通过</el-button>
        <el-button type="danger" @click="confirmAudit('Rejected')">稽核不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx'
import { paginationMixin } from '../paginationMixin';

export default {
  mixins: [paginationMixin],
  data() {
    return {
      userType: '',
      showAuditDialog: false, // 控制稽核弹窗的显示
      selectedCityName: '',
      selectedProductName: '', // 新增产品名称
      selectedBillingTypeName: '', // 新增计算类型名称
      showEditDialog: false,
      editingRecord: null,
      rules: {
        entryMonth: [{ required: true, message: '请输入记录月份', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请输入城市名称', trigger: 'blur' }],
        productCode: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        billingTypeCode: [{ required: true, message: '请输入计算类型名称', trigger: 'blur' }],
        entryAmount: [{ required: true, message: '请输入记录金额', trigger: 'blur' }],
      },
      searchDialogVisible: false,
      searchDialogTitle: '',
      searchType: '',
      searchSelectedCode: '',
      addDialogVisible: false,
      addFormData: {
        entryMonth: '',
        cityCode: '',
        productCode: '',
        billingTypeCode: '',
        entryAmount: ''
      },
      addFormRules: {
        entryMonth: [{ required: true, message: '请选择记录日期', trigger: 'change' }],
        cityCode: [{ required: true, message: '请选择城市名称', trigger: 'change' }],
        productCode: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        billingTypeCode: [{ required: true, message: '请选择计算类型名称', trigger: 'change' }],
        entryAmount: [
          { required: true, message: '请输入记录金额', trigger: 'blur' },
          { validator: this.validateEntryAmount, trigger: 'blur' }
        ]
      },

      cityCodeMap: {
        '0': '江西本部',
        '740': '江西景德镇',
        '750': '江西南昌',
        '751': '江西吉安',
        '752': '江西赣州',
        '753': '江西新余',
        '754': '江西鹰潭',
        '755': '江西九江',
        '756': '江西宜春',
        '757': '江西上饶',
        '758': '江西萍乡',
        '759': '江西抚州'
      },
      productCodeMap: {
        '110101': '固话-基础业务-普通电话',
        '110503': '固话-基础业务-公用电话-公话超市电话',
        '120502': '固话-增值业务-800-国内',
        '320113': '卡类-IP卡-省内IP电话卡-200卡',
        '320114': '卡类-IP卡-省内IP电话卡-300卡',
        '420201': '数据业务-互联网接入服务-宽带接入-ADSL虚拟拨号',
        '420301': '数据业务-互联网接入服务-互联网普通专线接入',
        '430101': '数据业务-平台业务-IDC-主机托管'
      },
      billingTypeCodeMap: {
        '4001': '主营业务收入-公众客户-月租费收入',
        '4002': '主营业务收入-公众客户-本地区内通话费',
        '4003': '主营业务收入-公众客户-本地区间通话费',
        '4004': '主营业务收入-公众客户-本地拨号上网通信费',
        '4005': '主营业务收入-公众客户-国内长途通信费',
        '4006': '主营业务收入-公众客户-国际长途通信费',
        '4007': '主营业务收入-公众客户-港澳台长途通信费',
        '4008': '主营业务收入-公众客户-IP国内长途通信费',
        '4009': '主营业务收入-公众客户-IP国际长途通信费',
        '4010': '主营业务收入-公众客户-IP港澳台长途通信费',
        '4011': '主营业务收入-公众客户-装移机工料费收入',
        '4012': '主营业务收入-公众客户-开户费收入',
        '4013': '主营业务收入-公众客户-网络使用费',
        '4014': '主营业务收入-公众客户-一次性费用',
        '4015': '主营业务收入-公众客户-标准资费收入',
        '4020': '主营业务收入-公众客户-增值业务收入',
        '4021': '主营业务收入-公众客户-其他类收入',
        '4022': '主营业务收入-公众客户-折扣与折让'
      }
    };
  },
  methods: {
    showPermissionDenied() {
      alert('您没有权限执行此操作');
    },

    fetchData() {
      axios.get('http://localhost:8080/income/get_all', { params: { entityType: 'BillingIncome' } })
          .then(response => this.updatePaginationData(response.data.data))
          .catch(error => console.error(error));
    },
    freshData() {
      console.log(this.userType)
      axios.get('http://localhost:8080/income/get_all', { params: { entityType: 'BillingIncome' } })
          .then(response => {
            // 更新表格数据
            this.paginatedData = response.data.data;
            // 重置分页到第一页
            this.currentPage = 1;
            // 更新总条目数
            this.total = response.data.data.length;
          })
          .catch(error => console.error(error));
    },
    formatEntryMonth(row) {
      if (row.entryMonth) {
        const date = new Date(row.entryMonth);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return '';
    },
    validateEntryAmount(rule, value, callback) {
      if (value === '' || !isNaN(value)) {
        callback();
      } else {
        callback(new Error('记录金额必须为数字'));
      }
    },

    getAuditStatus(row) {
      const statusMap = {
        'Pending': '稽核中',
        'Approved': '稽核通过',
        'Rejected': '稽核不通过'
      };
      return statusMap[row.auditStatus] || '';
    },
    openSearchDialog(type) {
      this.searchDialogVisible = true;
      this.searchType = type;
      this.searchDialogTitle = `${type === 'city' ? '城市' : '产品'}查找`;
      this.searchSelectedCode = '';
    },
    closeSearchDialog() {
      this.searchDialogVisible = false;
      this.searchSelectedCode = '';
    },
    searchData() {
      const apiUrl = `http://localhost:8080/income/find/by_${this.searchType}`;
      const params = { entityType: 'BillingIncome', name: this.searchSelectedCode };
      console.log(params)
      axios.get(apiUrl, { params })
          .then(response => {
            this.updatePaginationData(response.data.data);
            this.closeSearchDialog();
          })
          .catch(error => console.error(error));
    },
    openAddDialog() {
      this.addDialogVisible = true;
      this.addFormData = {
        entryMonth: '',
        cityCode: '',
        productCode: '',
        billingTypeCode: '',
        entryAmount: ''
      };
    },
    closeAddDialog() {
      this.addDialogVisible = false;
      this.$nextTick(() => {
        this.$refs.addForm.resetFields();
        this.addFormData = {
          entryMonth: '',
          cityCode: '',
          productCode: '',
          billingTypeCode: '',
          entryAmount: ''
        };
      });
    },

    addData() {
      if (isNaN(this.addFormData.entryAmount)) {
        console.error('记录金额必须为数字');
        return;
      }

      if (this.addFormData.entryMonth && !(this.addFormData.entryMonth instanceof Date)) {
        console.error('Entry month is not a valid date object');
        return;
      }

      if (this.addFormData.entryMonth instanceof Date && !isNaN(this.addFormData.entryMonth)) {
        const formattedDate = this.addFormData.entryMonth.getFullYear() + '-' +
            ('0' + (this.addFormData.entryMonth.getMonth() + 1)).slice(-2) + '-' +
            ('0' + this.addFormData.entryMonth.getDate()).slice(-2);
        this.addFormData.entryMonth = formattedDate;
      }


      // 将城市、产品和计算类型的名称转换为编码
      this.addFormData.cityCode = Object.keys(this.cityCodeMap).find(key => this.cityCodeMap[key] === this.addFormData.cityCode);
      this.addFormData.productCode = Object.keys(this.productCodeMap).find(key => this.productCodeMap[key] === this.addFormData.productCode);
      this.addFormData.billingTypeCode = Object.keys(this.billingTypeCodeMap).find(key => this.billingTypeCodeMap[key] === this.addFormData.billingTypeCode);
      console.log(this.addFormData)
      // 表单验证
      this.$refs.addForm.validate(valid => {
        if (valid) {
          axios.post('http://localhost:8080/income/data_entry/add/billing', this.addFormData)
              .then(response => {
                this.fetchData();
                this.closeAddDialog();
              })
              .catch(error => console.error(error));
        } else {
          console.log('表单验证失败');
        }
      });
    },

    getNameByCode(code, type) {
      const map = {
        city: this.cityCodeMap,
        product: this.productCodeMap,
        billingType: this.billingTypeCodeMap
      };
      return map[type][code] || code;
    },
    getRowClass({ row }) {
      return row.auditStatus === 'Rejected' ? 'rejected-row' : '';
    },
    handleDelete(row) {
      if (!row) {
        console.error('row 参数为空或未定义');
        return;
      }

      console.log('要删除的记录:', row);

      if (!row.id) {
        console.error('row.id 为空或未定义');
        return;
      }

      console.log('要删除的记录ID:', row.id);

      this.$confirm('确认删除这条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确认删除:', row);
        axios.delete('http://localhost:8080/income/data_entry/delete/billing', {data: {id: row.id}})
            .then(response => {
              console.log('删除响应:', response);
              if (response.data.code === 200) {
                this.$message.success('删除成功');
                this.fetchData();
              } else {
                this.$message.error('删除失败: ' + response.data.message);
              }
            })
            .catch(error => {
              console.error('删除错误:', error);
              this.$message.error('删除失败: ' + error.message);
            });
      }).catch(() => {
        console.log('取消删除');
      });
    },
    handleModify(row) {
      this.editingRecord = {...row};
      this.selectedCityName = this.getNameByCode(row.cityCode, 'city');
      this.selectedProductName = this.getNameByCode(row.productCode, 'product'); // 设置产品名称
      this.selectedBillingTypeName = this.getNameByCode(row.billingTypeCode, 'billingType'); // 设置计算类型名称
      this.showEditDialog = true;
    },


    confirmEdit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 将选中的城市名称转换回编码
          this.editingRecord.cityCode = this.getKeyByValue(this.cityCodeMap, this.selectedCityName);
          this.editingRecord.productCode = this.getKeyByValue(this.productCodeMap, this.selectedProductName); // 转换产品编码
          this.editingRecord.billingTypeCode = this.getKeyByValue(this.billingTypeCodeMap, this.selectedBillingTypeName); // 转换计算类型编码

          axios.put('http://localhost:8080/income/data_entry/update/billing', this.editingRecord)
              .then(response => {
                if (response.data.code === 200) {
                  this.$message.success('修改成功');
                  this.showEditDialog = false;
                  this.fetchData();
                } else {
                  this.$message.error('修改失败: ' + response.data.message);
                }
              })
              .catch(error => {
                console.error('修改错误:', error);
                this.$message.error('修改失败: ' + error.message);
              });
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    cancelEdit() {
      this.editingRecord = null;
      this.showEditDialog = false;
      this.$refs.editForm.resetFields();
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    },
    handleAudit(row) {
      this.editingRecord = {...row};
      this.showAuditDialog = true; // 控制稽核弹窗的显示
    },

    confirmAudit(status) {
      // 设置稽核状态
      this.editingRecord.auditStatus = status;

      // 发送更新请求
      axios.put('http://localhost:8080/income/update_audit/billing', this.editingRecord)
          .then(response => {
            if (response.data.code === 200) {
              this.$message.success('稽核状态更新成功');
              this.showAuditDialog = false;
              this.fetchData(); // 重新获取数据以更新表格
            } else {
              this.$message.error('稽核状态更新失败: ' + response.data.message);
            }
          })
          .catch(error => {
            this.$message.error('稽核状态更新失败: ' + error.message);
          });
    },
    exportToExcel() {
      // 1. 将表格数据转换为适合导出的格式
      const data = this.paginatedData.map(row => ({
        记录月份: this.formatEntryMonth(row),
        城市名称: this.getNameByCode(row.cityCode, 'city'),
        产品名称: this.getNameByCode(row.productCode, 'product'),
        计算类型名称: this.getNameByCode(row.billingTypeCode, 'billingType'),
        记录金额: row.entryAmount,
      }));

      // 2. 创建工作表
      const ws = XLSX.utils.json_to_sheet(data);

      // 3. 创建工作簿并添加工作表
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '出账收入');

      // 4. 生成Excel文件
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      // 5. 创建Blob对象
      const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' });

      // 6. 创建下载链接并模拟点击
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '出账收入.xlsx';
      link.click();

      // 7. 清理URL对象
      URL.revokeObjectURL(url);
    },

    // 辅助方法：将字符串转换为ArrayBuffer
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        this.bulkAddRecords(json);
      };
      reader.readAsBinaryString(file);
    },

    bulkAddRecords(records) {
      // 转换名称为编码
      const transformedRecords = records.map(record => ({
        entryMonth: record['记录月份'],
        cityCode: this.getKeyByValue(this.cityCodeMap, record['城市名称']),
        productCode: this.getKeyByValue(this.productCodeMap, record['产品名称']),
        billingTypeCode: this.getKeyByValue(this.billingTypeCodeMap, record['计算类型名称']),
        entryAmount: record['记录金额']
      }));


      console.log(transformedRecords)
      // 处理records数据并发送到服务器
      axios.post('http://localhost:8080/income/data_entry/addBatch/billing', transformedRecords)
          .then(response => {
            if (response.data.code === 200) {
              this.$message.success('批量添加成功');
              this.fetchData(); // 重新获取数据以更新表格
            } else {
              this.$message.error('批量添加失败: ' + response.data.message);
            }
          })
          .catch(error => {
            this.$message.error('批量添加失败: ' + error.message);
          });
    }

  },
  mounted() {
    this.fetchData();
    this.userType = localStorage.getItem('userType');
  }
};
</script>
<style>
.rejected-row .el-table__cell {
  color: red;
}
</style>