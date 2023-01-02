<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form>
        <!-- 用户名 -->
        <el-form-item>
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"
            v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 登录按钮和切换注册按钮 -->
        <el-form-item>
          <el-button @click="doLogin" type="primary" class="btn-login">登录</el-button>
          <el-link @click="$router.push('/Register')" type="info">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // (1)登录表单数据对象
      loginForm: {
        username: "",
        password: ""
      }
      // (2)表单验证对象
    };
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background: url("@/assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url("@/assets/images/login_title.png") center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
