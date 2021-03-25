import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入全局css样式
import './assets/css/global.css'
// 导入阿里图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
Vue.prototype.$axios = axios
// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//导入element组件库
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入登录提示框
Vue.prototype.$message = Message
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
