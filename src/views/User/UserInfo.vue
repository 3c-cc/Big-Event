<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>基本资料</span>
        </div>
        <!-- 表单 -->
        <el-form label-width="100px" :model="user" :rules="userRules" ref="userFormRef">
            <el-form-item label="登录名称">
                <el-input disabled v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="user.nickname"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doChange">提交修改</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'UserInfo',
    data() {
        return {
            user: { ...this.$store.state.userInfo },
            // 表单的验证规则对象
            userRules: {
                nickname: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        doChange() {
            // 1. 验证表单是否全部校验通过
            this.$refs.userFormRef.validate(async valid => {
                // debugger
                if (valid) {
                    // 2. 验证通过，发起请求
                    const { data: res } = await this.$axios.put("/my/userinfo", this.user)
                    // debugger
                    if (res.code === 0) {
                        //弹窗提示
                        this.$message.success("更新用户信息成功！")
                        //提交vuex的actions更新用户信息
                        this.$store.dispatch("initUserInfo")
                    } else {
                        this.$message.error("更新用户信息失败！")
                    }
                }
            })
        }
    }

}
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>