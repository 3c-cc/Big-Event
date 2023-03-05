<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>重置密码</span>
        </div>
        <!-- 表单 -->
        <el-form label-width="100px" :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef">
            <el-form-item label="原密码">
                <el-input show-password v-model="pwdForm.old_pwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input show-password v-model="pwdForm.new_pwd"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="re_pwd">
                <el-input show-password v-model="pwdForm.re_pwd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updatePwd">修改密码</el-button>
                <el-button @click="$refs.pwdFormRef.resetFields()">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'UserPwd',
    data() {
        return {
            // 表单的数据对象
            pwdForm: {
                old_pwd: "",
                new_pwd: "",
                re_pwd: "",
            },
            // 表单的验证规则对象
            pwdFormRules: {
                old_pwd: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        pattern: /^\S{6,15}$/,
                        message: "密码长度必须是6-15位的非空字符串",
                        trigger: "blur"
                    }
                ],
                new_pwd: [
                    { required: true, message: "请输入新密码", trigger: "blur" },
                    {
                        pattern: /^\S{6,15}$/,
                        message: "密码长度必须是6-15位的非空字符串",
                        trigger: "blur"
                    }
                ],
                re_pwd: [
                    { required: true, message: "请再次确认新密码", trigger: "blur" },
                    {
                        pattern: /^\S{6,15}$/,
                        message: "密码长度必须是6-15位的非空字符串",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.pwdForm.new_pwd) {
                                return callback(new Error("两次新密码不一致！"));
                            }
                            callback();
                        },
                        trigger: "blur"
                    }
                ]
            }
        }
    },
    methods: {
        //更新密码
        updatePwd() {
            //1.验证表单是否全部校验通过
            this.$refs.pwdFormRef.validate(async valid => {
                if (!valid) return;
                //2.验证通过,发送ajax请求
                if (valid) {
                    const { data: res } = await this.$axios.patch(
                        "/my/updatepwd",
                        this.pwdForm
                    );
                    //更新成功,清空表单
                    /*
                    密码不需要提交vuex,因为代码是通过token来判断是否登录的
                    密码是给用户手动登录用的
                    */
                    if (res.code === 0) {
                        this.$message.success("更新密码成功！");
                        this.$refs.pwdFormRef.resetFields();
                    } else {
                        this.$message.error(res.message);
                    }
                }
            });
        }
    }


}
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
