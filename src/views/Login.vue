<template>
  <div class="login-container">
    <h1 class="title">电信报表系统</h1>
    <div class="login-form">
      <el-input v-model="username" placeholder="请输入账号" class="input-field"></el-input>
      <el-input v-model="password" placeholder="请输入密码" show-password class="input-field"></el-input>
      <div class="login-button-container">
        <el-button type="primary" @click="login" class="login-button">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const token = ref('');
    const route = useRoute();
    const router = useRouter();

    const login = async () => {
      // 检查账号是否包含非法字符
      if (!/^[A-Za-z0-9!@#$%^&*()_+.,;:<>?{}\[\]~`"'|\\/]+$/.test(username.value)) {
        alert('不能使用非法字符，请重新输入');
        username.value = ''; // 清空账号
        password.value = ''; // 清空密码
        return;
      }

      // 检查密码是否包含非法字符
      if (!/^[A-Za-z0-9!@#$%^&*()_+.,;:<>?{}\[\]~`"'|\\/]+$/.test(password.value)) {
        alert('不能使用非法字符，请重新输入');
        password.value = ''; // 清空密码
        return;
      }

      try {
        const response = await axios.post(
            'http://localhost:8080/user/login',
            {
              username: username.value,
              password: password.value,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
        );

        if (response.status === 200) {
          const user = response.data.data; // 获取用户信息
          console.log(response);
          console.log(user);
          console.log(user.userType);
          console.log(token);
          localStorage.setItem('userType', user.userType);
          localStorage.setItem('studentId', user.id);
          localStorage.setItem('token', user.token)
          token.value = user.token;

          const redirect = route.query.redirect;

          switch (user.userType) {
            case 'SuperAdmin':
              router.push(redirect || '/super_admin');
              break;
            case 'Admin':
              router.push(redirect || '/admin');
              break;
            case 'Auditor':
              router.push(redirect || '/employee');
              break;
            case 'Finance':
              router.push(redirect || '/employee');
              break;
            case 'DataEntry':
              router.push(redirect || '/employee');
              break;
            default:
              alert('未知用户身份');
          }
        } else {
          // 登录失败
          alert('登录失败');
        }
      } catch (error) {
        console.error(error);
        if (error.response.status === 401) {
          alert('登录失败, 请检查账号密码');
        } else {
          alert('发生错误');
        }
      }
    };

    return {
      username,
      password,
      token,
      login,
    };
  },
};
</script>

<style>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 200px;
  margin-bottom: 10px;
}

.login-button-container {
  display: flex;
  justify-content: center;
}

.login-button {
  width: 100px;
}
</style>
