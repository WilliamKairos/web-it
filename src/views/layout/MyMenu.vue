<template>
  <el-menu :default-active="route.path" class="el-menu-vertical-demo" :collapse="isClose" background-color="#112f50"
           text-color="#fff" active-text-color="#ffd04b" router>
    <el-menu-item>
      <template #title>
        <span>电信报表系统</span>
      </template>
    </el-menu-item>
    <el-sub-menu index="/income">
      <template #title>
        <el-icon>
          <ScaleToOriginal />
        </el-icon>
        <span>录入表</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/employee/billing">出账收入</el-menu-item>
        <el-menu-item index="/employee/card_sales">卡销售收入</el-menu-item>
        <el-menu-item index="/employee/notification">网间结算收入</el-menu-item>
        <el-menu-item index="/employee/intercompany">预存转收入</el-menu-item>
        <el-menu-item index="/employee/prepaid_conversion_income">通知单收入</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="/encode">
      <template #title>
        <el-icon>
          <ScaleToOriginal />
        </el-icon>
        <span>编码表</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/goods/list">产品列表</el-menu-item>
        <el-menu-item index="/goods/category">产品分类</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { ref } from "vue"
import { useRoute } from "vue-router"
import {ScaleToOriginal} from "@element-plus/icons-vue";

export default {
  components: {ScaleToOriginal},
  props:['isClose'],
  setup() {
    const route = useRoute()

    return {
      route
    };
  },
};
</script>

<style scoped lang="less">
.el-menu {
  border-right: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
