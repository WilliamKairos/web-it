<template>
  <div>
    <div class="header">
      <div class="icon">
        <el-icon v-if="isClose" @click="change">
          <Expand />
        </el-icon>
        <el-icon v-else @click="change">
          <Fold />
        </el-icon>
      </div>
      <div class="right">
        <div class="time">{{ time }}</div>
        <div class="line">|</div>
        <div class="loginout" @click="logout"><el-icon><SwitchButton /></el-icon></div>
      </div>
    </div>
    <div class="wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import router from '@/router';
import { Expand, Fold, SwitchButton } from "@element-plus/icons-vue";

export default {
  components: { Fold, SwitchButton, Expand },
  props: ['isClose'],
  emits: ['change'],
  setup(props, { emit }) {
    let time = ref(null);

    const change = () => {
      emit('change');
    }

    const updateTime = () => {
      time.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }

    const logout = () => {
      // 清空用户信息，包括 token
      localStorage.clear();

      // 跳转到登录页面
      router.push('/login');
    }

    // 生命周期函数
    onMounted(() => {
      updateTime(); // 初始化时间

      // 设置定时器，每秒更新时间
      setInterval(updateTime, 1000);
    })

    return {
      change,
      time,
      logout
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  line-height: 50px;
  background: #1e78bf;
  color: #fff;
  display: flex;

  .icon {
    font-size: 24px;
    flex: 1;

    i {
      cursor: pointer;
    }
  }

  .right {
    padding-right: 20px;
    display: flex;
    .time {
      font-size: 12px;
    }
    .line{
      padding-right: 10px;
      padding-left: 10px;
    }
    .loginout{
      margin-top: 2px;
      cursor: pointer;
    }
  }
}

.wrapper {
  margin: 10px;
}
</style>