import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

// 导入vuex持久化插件
import persisted from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  // 使用插件
  plugins: [persisted()],
  // 负责存储数据
  state: {
    // 登录成功之后的 token 值
    token: "",
    // 用户的基本信息
    userInfo: {},
  },
  // state数据的计算属性
  getters: {},
  // 负责同步更新数据(直接更新)
  mutations: {
    //设置token
    setToken(state, token) {
      state.token = token;
    },
    // 更新用户基本信息
    updateUserInfo(state, obj) {
      state.userInfo = obj;
    },
  },
  // 负责异步更新数据(见解更新)
  actions: {
    // context:当前的vuex实例对象store
    async initUserInfo(context) {
      const {data:res} = await axios.get("/my/userinfo")
      // console.log(123);
      // console.log(res);
      // 获取成功,调用mutations更新数据
      if(res.code === 0){
        context.commit("updateUserInfo",res.data)
      }
    },
  },
  // 模块化处理数据 模块化state中的数据
  modules: {},
});
