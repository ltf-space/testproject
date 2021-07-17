import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入全局css样式
import './assets/css/global.css'
// 导入阿里图标
import './assets/fonts/iconfont.css'
// 引入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// 引入时间格式
import moment from 'moment'
Vue.prototype.moment = moment
//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器css样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 引入NProgress优化进度条
import NProgress from 'nprogress'
// 引入NProgress 样式
import 'nprogress/nprogress.css'

import axios from 'axios'
Vue.prototype.$axios = axios
// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // 往headers里添加token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  // 显示进度条
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  // 取消进度条
  NProgress.done()
  return config
})
//导入element组件库
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入登录提示框
Vue.prototype.$message = Message

Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
