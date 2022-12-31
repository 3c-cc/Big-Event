import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


// 1.导入全局样式表
import '@/assets/global.less'

// 2.导入 element-ui
// (1)导入+注册 组件
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// (2)导入css样式
import 'element-ui/lib/theme-chalk/index.css'

// 3.导入axios
import axios from 'axios'
//挂载到vue原型中
Vue.prototype.$axios = axios

//设置基地址
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
