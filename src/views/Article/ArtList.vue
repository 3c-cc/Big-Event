<template>
    <div>
        <!-- el-card 卡片样式 作为基本布局容器 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文章列表</span>
            </div>
            <!-- 搜索区域 -->
            <div class="search-box">
                <el-form :inline="true">
                    <el-form-item label="文章分类">
                        <el-select placeholder="请选择分类" size="small" v-model="q.cate_id">
                            <!-- 循环渲染可选项 -->
                            <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布状态" style="margin-left: 15px;">
                        <el-select placeholder="请选择状态" size="small" v-model="q.state">
                            <el-option label="已发布" value="已发布"></el-option>
                            <el-option label="草稿" value="草稿"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="initArtList">筛选</el-button>
                        <el-button type="info" size="small" @click="resetList">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 发表文章的按钮 -->
                <el-button type="primary" size="small" class="btn-pub" @click="dialogVisible = true">发表文章</el-button>
            </div>

            <!-- 文章表格区域 -->
            <el-table :data="artList" style="width: 100%;" border stripe>
                <el-table-column label="文章标题">
                    <template v-slot="{ row }">
                        <el-link type="primary" @click="showDetail(row.id)">
                            {{ row.title }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template v-slot="{ row }">
                        {{ formatTime(row.pub_date) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{ row }">
                        <el-button type="danger" size="mini" @click="doDelete(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="q.pagenum"
                :page-sizes="[2, 3, 5, 10]" :page-size="q.pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 发布文章dialog对话框 -->
        <el-dialog title="发表文章" :visible.sync="dialogVisible" fullscreen>
            <!-- 对话框内容 -->
            <el-form label-width="100px">
                <!-- 1.文章标题 -->
                <el-form-item label="文章标题">
                    <el-input placeholder="清输入标题" v-model="pubForm.title"></el-input>
                </el-form-item>
                <!-- 2.文章分类 -->
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择分类" style="width: 100%;" v-model="pubForm.cate_id">
                        <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 3.文章内容 -->
                <el-form-item label="文章内容">
                    <quill-editor v-model="pubForm.content"></quill-editor>
                </el-form-item>
                <!-- 4.文章封面 -->
                <el-form-item label="文章封面">
                    <!-- 用来显示封面的图片 -->
                    <img src="@/assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef">
                    <!-- 文件选择框,默认被隐藏 -->
                    <input type="file" style="display: none;" accept="image/*" ref="iptFile" @change="doChange">
                    <!-- 选择封面de按钮 -->
                    <br>
                    <el-button type="primary" plain @click="$refs.iptFile.click()">+ 选择封面</el-button>
                </el-form-item>
                <!-- 5.底部按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="pubArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="pubArticle('草稿')">存为草稿</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 文章详情的dialog对话框 -->
        <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
            <h1 class="title">{{ artDetail.title }}</h1>
            <div class="info">
                <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
                <span>发布时间：{{ formatTime(artDetail.pub_date) }}</span>
                <span>所属分类：{{ artDetail.cate_name }}</span>
                <span>状态：{{ artDetail.state }}</span>
            </div>
            <el-divider></el-divider>
            <img :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="" />
            <div v-html="artDetail.content"></div>
        </el-dialog>

    </div>
</template>
  
<script>

import moment from 'moment'

export default {
    name: 'ArtList',
    data() {
        return {
            // 文章的详情信息对象
            artDetail: {},
            // 控制文章详情对话框的显示与隐藏
            detailVisible: false,
            // 控制发布文章dialog对话框显示隐藏
            dialogVisible: false,
            // 发布文章数据
            pubForm: {
                // 文章的标题
                title: '',
                // 所属的分类 Id
                cate_id: '',
                // 文章的内容
                content: '',
                // 选中的封面的文件(null 表示没有选中任何的封面文件)
                cover_img: null,
                // 文章的发布状态,可选值只有(草稿 已发布)
                state: '',
            },
            // 文章分类
            cateList: [],
            // 文章的列表数据
            artList: [],
            // 总数据条数
            total: 0,
            // 查询参数对象
            q: {
                // 页码值
                pagenum: 1,
                // 页码数
                pagesize: 2,
                cate_id: '',
                state: '',
            },
        }
    },
    methods: {
        // 1.图片预览
        doChange(e) {
            // 获取刀用户选择的封面
            const file = e.target.files[0];
            if (file) {
                // 绑定到data中
                this.pubForm.cover_img = file
                // 生成url
                const url = URL.createObjectURL(file)
                // const url = URL.createObjectURL(files[0]);
                // 显示到img
                this.$refs.imgRef.setAttribute("src", url);
            }
        },
        // 2.发表文章
        async pubArticle(state) {
            // (1)把文章的发表站台保存到data中
            this.pubForm.state = state
            // (2)使用formdata发送文件数据
            const fd = new FormData()
            // 将data对象参数添加到fd中(因为fd会自动将我们的设置请求头+处理文件二进制)
            for (const key in this.pubForm) {
                fd.append(key, this.pubForm[key])
            }
            // (3)调用接口
            const { data: res } = await this.$axios.post("/my/article/add", fd)
            // debugger
            // (4)提示消息
            if (res.code === 0) {
                this.$message.success(res.message)
                // 关闭对话框
                this.dialogVisible = false;
                // 刷新文章的列表数据
                this.initArtList();
            } else {
                this.$message.error(res.message)
                // 关闭对话框
                this.dialogVisible = false;
                // 刷新文章的列表数据
                this.initArtList();
            }
        },
        // 3.获取文章列表
        async initArtList() {
            const { data: res } = await this.$axios.get('/my/article/list', { params: this.q })

            if (res.code === 0) {
                this.artList = res.data
                this.total = res.total
            }
            // debugger
        },
        // 4.时间格式化
        formatTime(time) {
            return moment(time).format('YYYY-MM-DD HH:mm:ss')
        },
        // 5.pageSize 发生了变化
        handleSizeChange(newSize) {
            // 为 pagesize 赋值
            this.q.pagesize = newSize;
            // 默认展示第一页数据
            this.pagenum = 1;
            // 重新发起请求
            this.initArtList();
        },
        // 6.页码变化
        handleCurrentChange(newPage) {
            // 为页码值赋值
            this.q.pagenum = newPage;
            // 重新发起请求
            this.initArtList();
        },
        // 7.重置筛选
        resetList() {
            // 1. 重置查询参数对象
            this.q = {
                pagenum: 1,
                pagesize: 2,
                cate_id: "",
                state: ""
            };
            // 2. 重新发起请求
            this.initArtList();
        },
        // -9.删除文章
        async doDelete(id) {
            // 1. 询问用户是否要删除
            const confirm = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).catch(err => err);
            console.log(confirm);
            // 2. 点击确认
            if (confirm === 'confirm') {

                const { data: res } = await this.$axios.delete("/my/article/info", { params: { id } })
                //提示
                this.$message(res.message)
            }

            //刷新列表数据
            this.initArtList()
        },
        // +8.文章详情
        async showDetail(id) {
            // 请求详情数据
            const { data: res } = await this.$axios.get("/my/article/info", {
                params: { id }
            })
            // debugger
            if (res.code === 0) {
                // 绑定data中数据
                this.artDetail = res.data
                // 显示对话框
                this.detailVisible = true
                console.log(res);
            }
        }
    },




    async created() {
        // 获取文章分类(不需要反复调用这个接口,可以直接在creatd钩子里面发送ajax)
        // 刷新文章的列表数据
        this.initArtList();
        // debugger
        const { data: res } = await this.$axios.get('/my/cate/list')
        // debugger
        if (res.code === 0) {
            //把数据转存到 data 中
            this.cateList = res.data
        }
    }
}
</script>
  
<style lang="less" scoped>
.search-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .btn-pub {
        margin-top: 5px;
    }
}

/deep/ .ql-editor {
    min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
    width: 400px;
    height: 280px;
    object-fit: cover;
}

.el-pagination {
    margin-top: 15px;
}

.title {
    font-size: 24px;
    text-align: center;
    font-weight: normal;
    color: #000;
    margin: 0 0 10px 0;
}

.info {
    font-size: 12px;

    span {
        margin-right: 20px;
    }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
/deep/ .detail-box {
    img {
        width: 500px;
    }
}
</style>
  