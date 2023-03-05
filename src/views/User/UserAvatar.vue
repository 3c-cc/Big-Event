<template>
    <div>
        <!-- 卡片盒子 -->
        <el-card class="box-card">
            <!-- 1.头部插槽 -->
            <div slot="header" class="clearfix">
                <span>更换头像</span>
            </div>
            <!-- 2.内容盒子 -->
            <div>
                <!-- 图片，用来展示用户选择的头像 -->
                <img v-if="avatar" :src="avatar" alt="" class="preview" />
                <img v-else src="@/assets/images/avatar.jpg" alt="" class="preview" />

                <!-- 按钮区域 -->
                <div class="btn-box">
                    <!-- 渲染一个被隐藏的文件选择框，只允许选中图片文件 -->
                    <input type="file" style="display: none" accept="image/*" ref="iptRef" @change="onFileChange" />
                    <el-button type="primary" icon="el-icon-plus" @click="$refs.iptRef.click()">选择图片</el-button>
                    <el-button :disabled="avatar === ''" type="success" icon="el-icon-upload" @click="uploadAvatar">上传头像
                    </el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
  
<script>
export default {
    name: "UserAvatar",
    data() {
        return {
            //用户头像  base64字符串
            avatar: ''
        }
    },
    /*
    开发中图片的处理传输主要有两种方式。二进制 + base64字符串
    1.文件预览
    1.1 二进制
    (1)给file表单注册onchange事件
    (2)获取文件对象: this.files[@]this.$refs.file表单.files[@](3)将文件对象转成 urlURL.createObjectURL(file对象)(4)url设置给img标签src
    1.2 base64字符串
    (1)给file表单注册onchange事件
    (2)获取文件对象: this.files[o]
    (3)使用FileReader对象 读取文件数据，生成base64字符串(4)base64字符串设置给img标签src
    2。文件提交
    1.1 二进制
    (1)创建FormData :const fd = new FormData()
    (2)添加文件参数:fd.append('接口参数名识，文件对象)(3)将formdata作为参数传递给服务器
    */
    methods: {
        //1.头像预览
        onFileChange(e) {
            //(1)获取选中的文件
            const file = e.target.files[0]
            if (file) {
                //(2) 创建 FileReader 对象
                const fr = new FileReader()
                //(3)调用 readAsDataURL 函数，读取文件内容
                fr.readAsDataURL(file)
                //(4)监听 fr 的 onload 事件
                fr.onload = e => {
                    // 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
                    this.avatar = e.target.result;
                }
            }
        },
        //2.头像提交
        async uploadAvatar() {
            // 1. 调接口上传头像
            const { data: res } = await this.$axios.patch("/my/update/avatar", { avatar: this.avatar })
            // debugger
            //2.成功之后，提交actions更新个人信息
            if (res.code === 0) {
                this.$message.success(res.message)
                this.$store.dispatch('initUserInfo')
            } else {
                this.$message.error('更新用户头像失败!')
            }
        }
    }
};
</script>
  
<style lang="less" scoped>
.btn-box {
    margin-top: 10px;
}

.preview {
    object-fit: cover;
    width: 350px;
    height: 350px;
}
</style>
  