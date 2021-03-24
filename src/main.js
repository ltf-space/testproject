import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入全局css样式
import './assets/css/global.css'

//导入element组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
