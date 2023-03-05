<template>
<!-- 版心  -->
  <el-container class="main-container">


    <!-- 1.左侧菜单栏 -->
    <el-aside width="200px">
      <div class="user-box">
        <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="">
        <img v-else src="@/assets/logo.png" alt="">
        <span>欢迎{{ userInfo.nickname || userInfo.username }} </span>
      </div>
      <!-- 左侧菜单 -->
      <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" background-color="#23262E"
        text-color="#fff" active-text-color="#409EFF" unique-opened router>
        <template v-for="item in memu">
          <!-- 1.如果children为空则渲染el-menu-item -->
          <el-menu-item :index="item.indexPath" :key="item.indexPath" v-if="!item.children"><i
              :class="item.icon"></i>{{ item.title }}</el-menu-item>
          <!-- 2.如果children不为空则渲染el-sunmenu -->
          <el-submenu :index="item.indexPath" :key="item.indexPath1" v-else>
            <!-- 一级标题 -->
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <!-- 继续使用v-for渲染children生成多个二级菜单 -->
            <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
              <i :class="subItem.icon"></i>{{ subItem.title }}</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>


    <!-- 2.右侧内容 -->
    <el-container>
      <!-- 2.1 右侧顶部栏 -->
      <el-header>
        <!-- 右侧logo -->
        <div class="logo"></div>
        <!-- 右侧菜单 -->
        <el-menu class="el-menu-top" mode="horizontal" text-color="#5c5c5c" active-text-color="#409EFF" router>

          <el-submenu index="1">
            <template slot="title">
              <!-- 头像 -->
              <!-- <img src="@/assets/logo.png" alt="" class="avatar"> -->
              <img v-if="userInfo.user_pic" :src="userInfo.user_pic" alt="" class="avatar">
              <img v-else src="@/assets/logo.png" alt="" class="avatar">
              <span>个人中心</span>
            </template>
            <el-menu-item index="/user-info">
              <i class="el-icon-s-operation"></i>基本资料
            </el-menu-item>
            <el-menu-item index="/user-avatar">
              <i class="el-icon-camera"></i>更换头像
            </el-menu-item>
            <el-menu-item index="/user-pwd">
              <i class="el-icon-key"></i>重置密码
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="2" @click="doLogout"><i class="el-icon-switch-button"></i>退出</el-menu-item>

        </el-menu>

      </el-header>



      
      <!-- 2.2 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 2.3 右侧底部 -->
      <!-- <el-footer>© www.itheima.com - 黑马程序员</el-footer> -->
    </el-container>


  </el-container>
</template>

<script>
export default {
  name: "Main",
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  data() {
    return {
      memu: []
    };

  },
  methods: {
    async doLogout() {
      const res = await this.$confirm("您确认退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => { })
      // 1. 清空 token
      // 2. 跳转到登录页面
      // console.log(res);
      if (res) {
        this.$store.commit('setToken', '')
        this.$router.push('/login')
      } else {
        this.$router.push('/')
      }
    }
  },
  async created() {
    this.$store.dispatch("initUserInfo")
    const { data: res } = await this.$axios.get('/my/menus')
    // console.log(res.data)
    this.memu = res.data


  },
};
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;

  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

//右侧样式
.el-header {
  .logo {
    height: 45px;
    width: 150px;
    padding: 8px 0px;
    user-select: none;
    text-align: center;
    background: url('@/assets/images/logo.png') center center / 100px no-repeat rgb(85, 85, 85);
    border-radius: 3px;
    margin-left: 15px;
  }
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {

  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
