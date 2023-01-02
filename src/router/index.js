import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 1.导入组件
import Register from "@/views/Register.vue"
import Login from "@/views/Login.vue"
import Main from "@/views/Main.vue"

// 2.配置路由规则
const routes = [
  {path: '/' , component: Main },
  {path: '/register' , component: Register },
  {path: '/login' , component: Login },

]

// 3.路由对象
const router = new VueRouter({
  routes
})

export default router
