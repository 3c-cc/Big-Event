import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 1.导入全局样式表
import "@/assets/global.less";

// 2.导入 element-ui
// (1)导入+注册 组件
import ElementUI from "element-ui";
Vue.use(ElementUI);
// (2)导入css样式
import "element-ui/lib/theme-chalk/index.css";

// 3.导入axios
import axios from "axios";
//挂载到vue原型中
Vue.prototype.$axios = axios;

//设置基地址
axios.defaults.baseURL = "http://big-event-vue-api-t.itheima.net";

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    //请求发送之前做点什么
    // 判断本次请求是否以 /my 开头，决定是否添加身份认证的字段
    if (config.url.startsWith("/my") && store.state.token) {
      config.headers.Authorization = store.state.token;
    }
    return config;
  },
  function (error) {
    //请求错误做点什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (res) {
    // 响应成功之后
    return res;
  },
  function (error) {
    // 响应失败之后做点什么
    //判断是不是token无效导致
    if (error.response.status === 401) {
      // 1. 立即清空无效的 token
      store.commit("setToken", "");
      // 2. 跳转到登录页面
      alert("请先登录");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入vue(在main.js中这行可以省略。 )
// import Vue from 'vue'
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
