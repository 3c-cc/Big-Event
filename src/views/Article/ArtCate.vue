<template>
    <div>
        <!-- 卡片 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix header-box">
                <span>文章分类</span>
                <el-button type="primary" size="mini" @click="flag = true">添加分类</el-button>
            </div>
            <!-- 表格区域 -->
            <el-table style="width: 100%;" :data="cateList" border stripe>
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="分类名称" prop="cate_name"></el-table-column>
                <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="obj">
                        <el-button type="primary" size="mini" @click="doEdit(obj.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="doDelete(obj.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加分类对话框  弹窗优先级 -->
        <el-dialog :title="dialogText.title" :visible.sync="flag" width="35%" @close="doClose">
            <!-- 添加的表单 -->
            <el-form label-position="left" label-width="100px" :model="addForm" :rules="addRules" ref="addFormRef">
                <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="addForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="addForm.cate_alias"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="$refs.addFormRef.resetFields()">取 消</el-button>
                <el-button size="mini" type="primary" @click="doAddCat">{{ dialogText.btn }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    name: 'ArtCate',
    // 1.数据
    data() {
        return {
            // 文章的分类列表
            cateList: [],
            // 弹窗的显示的布尔属性
            flag: false,
            // 对话框文本
            dialogText: {
                title: '新增分类',
                btn: '新增',
            },
            // 表单的数据对象
            addForm: {
                cate_name: "",
                cate_alias: ""
            },
            // 表单的验证规则对象
            addRules: {
                cate_name: [
                    { required: true, message: "请输入分类名称", trigger: "blur" },
                    {
                        pattern: /^\S{1,10}$/,
                        message: "分类名必须是1-10位的非空字符",
                        trigger: "blur"
                    }
                ],
                cate_alias: [
                    { required: true, message: "请输入分类别名", trigger: "blur" },
                    {
                        pattern: /^[a-zA-Z0-9]{1,15}$/,
                        message: "分类别名必须是1-15位的字母数字",
                        trigger: "blur"
                    }
                ]
            },
        };
    },
    // 2.方法
    methods: {
        //1.获取分类列表
        async initCateList() {
            const { data: res } = await this.$axios.get("/my/cate/list")
            // debugger
            if (res.code === 0) {
                this.cateList = res.data;
            }
        },
        //2.添加分类
        doAddCat() {
            // 表单校验结果
            this.$refs.addFormRef.validate(async valid => {
                //校验成功,发送ajax请求
                if (valid) {
                    // const { data: res } = await this.$axios.post("/my/cate/add", this.addForm)
                    //判断是编辑还是添加
                    let promise = null
                    if (this.dialogText.btn === '新增') {
                        promise = this.$axios.post("/my/cate/add", this.addForm)
                    } else {
                        promise = this.$axios.put("/my/cate/info", this.addForm)
                    }
                    const { data: res } = await promise
                    // debugger
                    if (res.code === 0) {
                        this.$message.success(res.message)
                        // 关闭对话框
                        this.flag = false
                        // 重新请求列表数据
                        this.initCateList()
                    } else {
                        this.$message.error(res.message)
                    }
                }
            })
        },
        //3.修改分类
        doEdit(item) {
            //(1)设置内容
            // this.addForm.cate_name = item.cate_name
            // this.addForm.cate_alias = item.cate_alias
            // this.addForm.id = item.id
            this.addForm = { ...item }
            //(2)弹出弹窗
            this.dialogText = {
                title: '编辑文章分类',
                btn: '编辑'
            }
            this.flag = true
        },
        //5.关闭dialog弹框,默认文本复位
        doClose() {
            //文本复位
            this.dialogText = {
                title: '添加文章分类',
                btn: '添加'
            }
            //输入框清空
            this.addForm.cate_name = ''
            this.addForm.cate_alias = ''
        },
        //6.删除
        async doDelete(id) {
            //(1)弹出确认框
            const confirm = await this.$confirm(
                "此操作将永久删除该分类, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).catch(err => { })
            //(2)点击确定发送ajax请求
            if (confirm) {
                const { data: res } = await this.$axios.delete("/my/cate/del", { params: { id } })
                // debugger
                if (res.code === 0) {
                    this.$message.success(res.message)
                    //重新加载分类列表
                    this.initCateList();
                } else {
                    this.$message.error(res.message)
                }
            }
        }
    },
    // 3.钩子
    created() {
        this.initCateList()
    },
}
</script>
  
<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
  