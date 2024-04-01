<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="article-apply-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-query-container">
                    <div class="input-container">
                        <el-input v-model="queryValue">
                            <template #prepend>
                                <el-select 
                                    v-model="queryId" 
                                    style="width: 100px"
                                    placeholder="查询方式" 
                                >
                                    <el-option label="全部" value="0" />
                                    <el-option label="发布者" value="1" />
                                    <el-option label="文章标题" value="2" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span style="">分类&nbsp;&nbsp;</span>
                        <el-select 
                            placeholder="分类" 
                            style="width: 120px"
                            v-model="selectCategory" 
                        >
                            <el-option
                                :key="index"
                                :value="item.categoryId" 
                                :label="item.categoryName" 
                                v-for="(item, index) in category"
                             />
                        </el-select>
                        <el-button @click="categoryQuery">搜索</el-button>
                    </div>

                    <div class="select-container">
                        <span style="">类型&nbsp;&nbsp;</span>
                        <el-select v-model="selectType" placeholder="类型" style="width: 120px">
                            <el-option label="全部" value="0" />
                            <el-option label="解题技巧" value="1" />
                            <el-option label="学习笔记" value="2" />
                        </el-select>
                        <el-button @click="typeQuery">搜索</el-button>
                    </div>
                    
                </div>
            </div>

            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="articleData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="articleData.records" 
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="index" label="文章编号" align="center" width="80" />
                    <el-table-column prop="articleTitle" label="文章标题" align="center" :width="flexColumnWidth('articleTitle', articleData.records)"/>
                    <el-table-column prop="articleImage" label="文章封面" align="center" width="150">
                        <template v-slot="scope">
                            <el-image :src="scope.row.articleImage"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="所属分类" align="center" width="140"/>
                    <el-table-column prop="articleType" label="所属类型" align="center" width="140"/>
                    <el-table-column prop="likeNumber" label="点赞量" align="center" />
                    <el-table-column prop="browseNumber" label="浏览量" align="center" />
                    <el-table-column prop="collectionNumber" label="收藏量" align="center" />
                    <el-table-column prop="creatorName" label="发布者" align="center" />
                    <el-table-column prop="creatorAvatar" label="发布者头像" align="center" width="100">
                        <template v-slot="scope">
                            <el-image :src="scope.row.creatorAvatar"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发布时间" align="center"  width="120"/>
                    <el-table-column fixed="right" label="选项" align="center" width="280">
                        <template v-slot="scope" #default>
                            <el-button
                                link 
                                type="warning" 
                                @click="agreeReleaseArticle(scope.row.articleId)"
                            >
                                同意发布
                            </el-button>
                            <el-button
                                link 
                                type="danger" 
                                @click="unAgreeReleaseDialog(scope.row.articleId)"
                            >
                                不同意发布
                            </el-button>
                            <el-button
                                link 
                                type="success" 
                                @click="showArticleInfo(scope.row)"
                            >
                                查看文章详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="articleData.total"
                            :page-count="articleData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="articleQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="unAgreeDialog">
            <div style="font-size: 24px; text-align: center;">拒绝原因</div>
            <el-input 
                rows="5"
                type="textarea"
                style="margin: 0.8rem 0;"
                v-model="unAgreeApplyParams.auditFailureReason" 
            />
            
            <div style="text-align: center;">
                <el-button @click="unAgreeApply" type="danger">不同意</el-button>
            </div>
            
        </el-dialog>
    </div> 
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, ref } from 'vue';
import { getCategory } from '@/api/chart';
import { flexColumnWidth } from '@/global'
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { queryApplyArticle, articleAuditSuccess, articleAuditFail } from '@/api/article';


// 查询方式
const queryId = ref()
// 分类信息
const category = ref()
// 查询的值
const queryValue = ref()
// 类型查询
const selectType = ref()
// 分类查询
const selectCategory = ref()
// 文章信息
const articleData = ref<any>({
    total: 0,
    pages: 0,
    records: [],
})
// 不同意弹出框
const unAgreeDialog = ref(false)
// 不同意参数
const unAgreeApplyParams = ref({
    articleId: null,
    auditFailureReason: null,
})
// 文章查询参数 
const articleQueryParams = ref<any>({
    pageSize: 7,
    zoneId: null,
    currentPage: 1,
    categoryId: null,
    creatorName: null,
    articleTitle: null,
})



// 挂载函数
onMounted(() => {
    // 加载分类
    loadCategory()
    // 加载文章信息
    loadArticle()
})


// 类型查询
function typeQuery() {
    clearQueryEvent()
    queryId.value = "0"
    queryValue.value = null
    selectCategory.value = "0"

    if (selectType.value != undefined) {
        // 赋值
        articleQueryParams.value.currentPage = 1
        articleQueryParams.value.zoneId = selectType.value

        loadArticle()
    } else {
        ElMessage.info('请选择类型')
    }
}

// 查询事件
function queryEvent() {
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        selectType.value = "0"
        selectCategory.value = 0
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearQueryEvent()
                loadArticle()
            }
        } else {
            if (queryId.value == 1) {
                articleQueryParams.value.zoneId = null
                articleQueryParams.value.categoryId = null
                articleQueryParams.value.creatorName = queryValue.value
                articleQueryParams.value.articleTitle = null
                articleQueryParams.value.currentPage = 1
            } else if (queryId.value == 2) {
                articleQueryParams.value.zoneId = null
                articleQueryParams.value.categoryId = null
                articleQueryParams.value.creatorName = null
                articleQueryParams.value.articleTitle = queryValue.value
                articleQueryParams.value.currentPage = 1
            } else {
                clearQueryEvent()
                queryValue.value = null
            }

            loadArticle()
        }
    }
}

// 加载文章信息 
function loadArticle() {
    queryApplyArticle(articleQueryParams.value).then(response => {
        if (response.data.code === 200) {
            articleData.value = response.data.data
        } else {
            console.log(response.data)
            articleData.value = {
                total: 0,
                pages: 0, 
                records: [],
            }
        }
    })
}

// 加载分类
function loadCategory() {
    getCategory().then(response => {
        if (response.data.code === 200) {
            category.value = response.data.data
        } 
    })
}

// 不同意发布
function unAgreeApply() {
    if (unAgreeApplyParams.value.auditFailureReason === null || 
    unAgreeApplyParams.value.auditFailureReason === '' ||
    unAgreeApplyParams.value.auditFailureReason === undefined) {
        ElMessage.error('请填写拒绝原因')
        return
    }

    articleAuditFail(unAgreeApplyParams.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            unAgreeDialog.value = false
            loadArticle()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 分类查询
function categoryQuery() {
    clearQueryEvent()
    queryId.value = "0"
    selectType.value = "0"
    queryValue.value = null

    if (selectCategory.value != undefined) {
        // 赋值
        articleQueryParams.value.currentPage = 1
        if (selectCategory.value != "0") {
            articleQueryParams.value.categoryId = selectCategory.value
        }

        loadArticle()
    } else {
        ElMessage.info('请选择分类')
    }
    
}

// 清空参数事件
function clearQueryEvent() {
    articleQueryParams.value.zoneId = null
    articleQueryParams.value.categoryId = null
    articleQueryParams.value.creatorName = null
    articleQueryParams.value.articleTitle = null
    articleQueryParams.value.currentPage = 1
}

// 查看文章详情
function showArticleInfo(row: any) {
    router.push({
        name: 'articleInfo',
        params: {
            articleInfo: JSON.stringify(row),
        }
    })
}

// 分页事件
function handleCurrentChange(val: any) {
    articleQueryParams.value.currentPage = val
    loadArticle()
}

// 同意文章发布
function agreeReleaseArticle(articleId: any) {
    articleAuditSuccess(articleId).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadArticle()
        } else {
            ElMessage.error('操作成功')
        }
    })
}

// 不同意发布弹出框
function unAgreeReleaseDialog(articleId: any) {
    unAgreeApplyParams.value.articleId = articleId
    unAgreeDialog.value = true
}
</script>

<style lang="less" scoped>
// 文章申请视图容器
.article-apply-view-container {
    height: 96%;

    :deep(.el-card) {
        height: 100%;
    }

    // 顶部容器
    .header-user-container {
        display: flex;
        margin: 1vh 0 2vh 0;
        justify-content: space-between;


        // 顶部查询容器
        .header-query-container {
            display: flex;
            align-items: center;

            // 输入框容器
            .input-container {
                width: 20vw;

            }

            // 下拉菜单容器
            .select-container {
                font-size: 14px;
                font-weight: 700;
                color: #606266;
                line-height: 32px;
                margin:  0 0 0 2vw;

                .el-button {
                    margin-left: 0.5vw;
                }
            }
        }
    }

    // 底部容器
    .footer-user-container {
        height: 75vh;
        position: relative;

        :deep(.el-empty) {
            height: 100%;
        }

        .page-helper-container {
            bottom: 0;
            width: 100%;
            display: flex;
            position: absolute;
            justify-content: center;
        }
    }
}

// 弹出框样式
.dialog-container {
    // 对话框
    :deep(.el-dialog) {
        width: 42%; 
        border-radius: 0.8rem;
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0.5rem;
    }

    // 对话框内容
    :deep(.el-dialog__body) {
        padding: 2rem;
    }

}
</style>