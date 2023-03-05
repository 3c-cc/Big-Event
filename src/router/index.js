import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 1.导入组件
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import Main from "@/views/Main.vue";
//导入二级路由
import Home from "@/views/Home/Home.vue";
import UserInfo from "@/views/User/UserInfo.vue";
import UserAvatar from "@/views/User/UserAvatar.vue";
import UserPwd from "@/views/User/UserPwd.vue";
import ArtCate from "@/views/Article/ArtCate.vue";
import ArtList from "@/views/Article/ArtList.vue";

// 2.配置路由规则
const routes = [
  {
    path: "/",
    component: Main,
    children: [
      //二级路由配置
      { path: "/", component: Home },
      { path: "/home", component: Home },
      { path: "/user-info", component: UserInfo },
      { path: "/user-avatar", component: UserAvatar },
      { path: "/user-pwd", component: UserPwd },
      { path: "/art-cate", component: ArtCate },
      { path: "/art-list", component: ArtList },
    ],
  },
  { path: "/Register", component: Register },
  { path: "/Login", component: Login },
];

// 3.路由对象
const router = new VueRouter({
  routes,
});

export default router;
