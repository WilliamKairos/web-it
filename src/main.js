import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'normalize.css'
import './assets/css/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App).use(ElementPlus).use(router)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }

// //挂载全局
// import echarts from './Plugin/echarts'
// app.config.globalProperties.$echarts = echarts
app.mount('#app')

// app.use(ElementPlus, {
//     locale: zhCn,
// })