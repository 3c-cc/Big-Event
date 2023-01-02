<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="regForm" :rules="regFormRules" ref="regFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="regForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"
            v-model="regForm.password"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请再次确认密码" prefix-icon="el-icon-lock"
            v-model="regForm.repassword"></el-input>
        </el-form-item>
        <!-- 注册按钮和切换登录按钮 -->
        <el-form-item>
          <el-button @click="doRegister" type="primary" class="btn-reg">注册</el-button>
          <el-link @click="$router.push('/login')" type="info">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      //(1)注册表单的数据对象
      regForm: {
        username: "",
        password: "",
        repassword: ""
      },
      //(2)注册表单的验证规则对象
      regFormRules: {
        // 用户名的规则
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10位的字母数字",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15位的非空字符",
            trigger: "blur"
          }
        ],
        repassword: [
          { required: true, message: "请再次确认密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15位的非空字符",
            trigger: "blur"
          },
          // 使用 validator 属性，来应用自定义的校验规则
          {
            validator: (rule, value, callback) => {
              // 形参中的 value 表示被绑定的元素的值
              if (value !== this.regForm.password) {
                // 校验失败
                callback(new Error("两次密码不一致！"));
              } else {
                // 校验成功
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //点击注册按钮
    doRegister() {
      //1.检查表单是否校验成功
      this.$refs.regFormRef.validate(async valid => {
        // valid 就是表单验证的结果，如果是true，表示通过了
        console.log(valid);
        //2.如果成功,则发送注册ajax
        if (valid) {
          //知识点: (1)await异步函数  (2) 对象解构赋值
          const { data: res } = await this.$axios.post("/api/reg", this.regForm);
          if (res.code !== 0) {
            // 失败了
            this.$message.error(res.message);
          } else {
            // 成功了
            this.$message.success("注册成功，请登录！");
            this.$router.push("/login");
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.reg-container {
  background: url("@/assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url("@/assets/images/login_title.png") center no-repeat;
    }
  }

  .el-form {
    padding: 0 25px;
  }

  .btn-reg {
    width: 100%;
  }
}
</style>
