<template>
    <div class="technical-view-container">
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
                                    <el-option label="资讯标题" value="2" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span style="">角色&nbsp;&nbsp;</span>
                        <el-select v-model="selectCategory" placeholder="角色" style="width: 100px">
                            <el-option 
                                :key="index"
                                :value="item.categoryId" 
                                :label="item.categoryName" 
                                v-for="(item, index) in category"
                            />
                        </el-select>
                        <el-button @click="categoryQuery">搜索</el-button>
                    </div>
                    
                </div>
                <div class="header-button-container">
                    <el-button type="warning" @click="addTechnicalDialog = true">发布</el-button>
                    <el-button type="info" @click="multipleDeleteTechnicalEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="technicalData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else 
                    :data="technicalData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="资讯编号" align="center"  width="80"/>
                    <el-table-column prop="technicalTitle" label="资讯标题" align="center" :width="flexColumnWidth('technicalTitle', technicalData.records)" />
                    <el-table-column prop="technicalCover" label="资讯封面" align="center" width="120">
                        <template #default="scope">
                            <el-image :src="scope.row.technicalCover" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="technicalContent" label="资讯内容" align="center" show-overflow-tooltip="false" :width="600" />
                    <el-table-column prop="categoryName" label="资讯分类" align="center" width="120"/>
                    <el-table-column prop="creatorName" label="发布者" align="center" width="120"/>
                    <el-table-column prop="creatorAvatar" label="发布者头像" align="center" width="100">
                        <template #default="scope">
                            <el-image :src="scope.row.creatorAvatar" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发布时间" align="center" width="120"/>
                    <el-table-column fixed="right" label="选项" align="center" width="200">
                        <template #default="scope">
                            <el-button
                                link 
                                type="info" 
                                @click="updateTechnicalDialogEvent(scope.row)"
                            >
                                修改
                            </el-button>
                            <el-button
                                link 
                                type="danger" 
                                @click="simpleDeleteTechnicalEvent(scope.row.technicalId)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="technicalData.total"
                            :page-count="technicalData.pages"
                            @current-change="handleCurrentChange"
                            :current-page="technicalQueryParams.currentPage"
                            layout="total, prev, pager, next, jumper"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>


    <div class="dialog-container">
        <el-dialog v-model="addTechnicalDialog" @close="dialogClose">
            <div class="dialog-title">发布资讯</div>
            <div class="dialog-content">
                <el-form :model="addTechnicalForm">
                    <el-form-item label="资讯标题">
                        <el-input v-model="addTechnicalForm.technicalTitle" placeholder="请输入资讯标题"/>
                    </el-form-item>
                    <el-form-item label="资讯封面">
                        <el-upload 
                            class="cover-upload"
                            :show-file-list="false"
                            :action="actionTechnicalUrl"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="technicalImageUrl.newPath"
                                :src="technicalImageUrl.newPath" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加资讯封面</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="资讯内容">
                        <el-input v-model="addTechnicalForm.technicalContent" placeholder="请输入资讯内容" type="textarea" :rows="10"/>
                    </el-form-item>
                    <el-form-item label="资讯分类">
                        <el-select 
                            placeholder="选择资讯分类"
                            v-model="checkCategory"
                        >
                            <el-option
                                :key="index"
                                :value="item.categoryId"
                                :label="item.categoryName"
                                v-for="(item, index) in category"
                            />
                        </el-select>
                    </el-form-item>

                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addTechnicalEvent">添加</el-button>
                                <el-button @click="addTechnicalDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateTechnicalDialog" @close="dialogClose">
            <div class="dialog-title">修改资讯</div>
            <div class="dialog-content">
                <el-form :model="updateTechnicalForm">
                    <el-form-item label="资讯标题">
                        <el-input v-model="updateTechnicalForm.technicalTitle" placeholder="请输入资讯标题"/>
                    </el-form-item>
                    <el-form-item label="勋章图标">
                        <el-upload 
                            :data="admin"
                            class="cover-upload"
                            :show-file-list="false"
                            :action="actionTechnicalUrl"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="updateTechnicalForm.newTechnicalCover"
                                :src="updateTechnicalForm.newTechnicalCover" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加资讯封面</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="资讯内容">
                        <el-input v-model="updateTechnicalForm.technicalContent" placeholder="请输入资讯内容" type="textarea" :rows="10"/>
                    </el-form-item>
                    <el-form-item label="资讯分类">
                        <el-select 
                            placeholder="选择资讯分类"
                            v-model="checkCategory"
                        >
                            <el-option
                                :key="index"
                                :value="item.categoryId"
                                :label="item.categoryName"
                                v-for="(item, index) in category"
                            />
                        </el-select>
                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="updateTechnicalEvent">修改</el-button>
                                <el-button @click="updateTechnicalDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
 
<script setup lang="ts">
import { isNotEmpty } from '@/global'
import { onMounted, ref } from 'vue';
import { getCategory } from '@/api/chart';
import { flexColumnWidth } from '@/global';
import { adminStore } from '@/stores/admin';
import { getAllTechnical, addMessage, updateMessage, deleteMessage } from '@/api/message';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 查询方式
const queryId = ref()
// 分类信息
const category = ref()
// 查询的值
const queryValue = ref()
// 管理员信息
const admin = adminStore()
// 资讯ID
const technicalIds = ref()
// 资讯信息
const technicalData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 选中的类别
const checkCategory = ref()
// 分类查询
const selectCategory = ref()
// 回显的资讯封面
const technicalImageUrl = ref({
    oldPath: null,
    newPath: null,
})
// 添加资讯表单
const addTechnicalForm = ref({
    userId: null,
    categoryId: null,
    categoryName: null,
    technicalTitle: null,
    technicalCover: null,
    technicalContent: null,
})
// 资讯查询参数
const technicalQueryParams = ref({
    pageSize: 7,
    currentPage: 1,
    categoryId: null,
    creatorName: null,
    technicalTitle: null,
})
// 修改资讯表单
const updateTechnicalForm = ref({
    technicalId: null,
    categoryId: null,
    categoryName: null,
    technicalTitle: null,
    technicalCover: null,
    technicalContent: null,
    newTechnicalCover: null,
})
// 发布资讯弹出框
const addTechnicalDialog = ref(false)
// 修改资讯弹出框
const updateTechnicalDialog = ref(false)
const actionTechnicalUrl = 'http://localhost:8000/message-center-service/backend/message/submitTechnicalImage'



// 挂载函数
onMounted(() => {
    // 加载分类
    loadCategory()
    // 加载资讯
    loadTechnical()
})

// 查询事件
function queryEvent() {
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        selectCategory.value = 0
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearQueryEvent()
                loadTechnical()
            }
        } else { 
            if (queryId.value == 1) {
                technicalQueryParams.value.currentPage = 1
                technicalQueryParams.value.categoryId = null
                technicalQueryParams.value.creatorName = queryValue.value
                technicalQueryParams.value.technicalTitle = null
            } else if (queryId.value == 2) {
                technicalQueryParams.value.currentPage = 1
                technicalQueryParams.value.categoryId = null
                technicalQueryParams.value.creatorName = null
                technicalQueryParams.value.technicalTitle = queryValue.value
            } else {
                clearQueryEvent()
                queryId.value = "0"
                queryValue.value = null
            }

            loadTechnical()
        }
    }
}

// 弹出框关闭
function dialogClose() {
    checkCategory.value = null

    technicalImageUrl.value = {
        oldPath: null,
        newPath: null
    }

    addTechnicalForm.value = {
        userId: null,
        categoryId: null,
        categoryName: null,
        technicalTitle: null,
        technicalCover: null,
        technicalContent: null,
    }

    updateTechnicalForm.value = {
        technicalId: null,
        categoryId: null,
        categoryName: null,
        technicalTitle: null,
        technicalCover: null,
        technicalContent: null,
        newTechnicalCover: null,
    }
}

// 加载分类
function loadCategory() {
    getCategory().then(response => {
        if (response.data.code === 200) {
            category.value = response.data.data
            category.value = category.value.filter((item: any) => {
                return item.categoryName != '全部'
            })
        } 
    })
}

// 分类查询
function categoryQuery() {
    clearQueryEvent()
    queryId.value = "0"
    queryValue.value = null

    if (selectCategory.value != undefined) {
        // 赋值
        technicalQueryParams.value.currentPage = 1
        if (selectCategory.value != "0") {
            technicalQueryParams.value.categoryId = selectCategory.value
        }

        loadTechnical()
    } else {
        ElMessage.info('请选择分类')
    }
    
}

// 加载资讯
function loadTechnical() {
    getAllTechnical(technicalQueryParams.value).then(response => {
        if (response.data.code === 200) {
            technicalData.value = response.data.data
        } else {
            technicalData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

// 清空查询参数
function clearQueryEvent() {
    technicalQueryParams.value.currentPage = 1
    technicalQueryParams.value.categoryId = null
    technicalQueryParams.value.creatorName = null
    technicalQueryParams.value.technicalTitle = null
}

// 发布资讯事件
function addTechnicalEvent() {
    addTechnicalForm.value.categoryId = checkCategory.value
    if (!isNotEmpty(addTechnicalForm.value.categoryId) || 
    !isNotEmpty(addTechnicalForm.value.technicalTitle) || 
    !isNotEmpty(addTechnicalForm.value.technicalCover) ||
    !isNotEmpty(addTechnicalForm.value.technicalContent)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    addMessage(addTechnicalForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('发布成功')
            loadTechnical()
            addTechnicalDialog.value = false
        } else {
            ElMessage.error('发布失败')
        }
    })
}

// 修改资讯事件
function updateTechnicalEvent() {
    updateTechnicalForm.value.categoryId = checkCategory.value
    if (!isNotEmpty(updateTechnicalForm.value.categoryId) || 
    !isNotEmpty(updateTechnicalForm.value.technicalTitle) || 
    !isNotEmpty(updateTechnicalForm.value.technicalCover) ||
    !isNotEmpty(updateTechnicalForm.value.technicalContent)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    updateMessage(updateTechnicalForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改成功')
            loadTechnical()
            updateTechnicalDialog.value = false
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 上传图片前的回调 
function beforeImageUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 5) {
        ElMessage.info('图片大小不能超过5MB')
        return false;
    }

    // 判断文件类型
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持jpg、jpeg、png')
        return false;
    }

    return true;
}

// 分页事件
function handleCurrentChange(val: any) {
    technicalQueryParams.value.currentPage = val
    loadTechnical()
}

// 多删除资讯事件
function multipleDeleteTechnicalEvent() {
    deleteMessage(technicalIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadTechnical()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 上传图片成功后的回调
function handlerImageSuccess(result: any) {
    // 图片回显
    technicalImageUrl.value = result.data
    addTechnicalForm.value.technicalCover = result.data.oldPath
    updateTechnicalForm.value.technicalCover = result.data.oldPath
    updateTechnicalForm.value.newTechnicalCover = result.data.newPath
}

// 修改资讯弹出框事件
function updateTechnicalDialogEvent(item: any) {
    updateTechnicalForm.value = {
        technicalId: item.technicalId,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        technicalTitle: item.technicalTitle,
        technicalCover: item.technicalCover,
        newTechnicalCover: item.technicalCover,
        technicalContent: item.technicalContent,
    }

    checkCategory.value = item.categoryName

    updateTechnicalDialog.value = true
}

// 选中事件
function handleSelectionChange(selection: any) {
    technicalIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        technicalIds.value.push(selection[i].technicalId)
    }
}

// 单删除资讯事件
function simpleDeleteTechnicalEvent(technicalId: any) {
    const technicalIds = [ technicalId ]
    deleteMessage(technicalIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadTechnical()
        } else {
            ElMessage.error('删除失败')
        }
    })
}
</script>
 
<style lang="less" scoped> 
 .technical-view-container {
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
                margin:  0 2vw;
                font-size: 14px;
                font-weight: 700;
                color: #606266;
                line-height: 32px;

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

:deep(.cell.el-tooltip) {
    cursor: pointer;
}

:deep(.el-popper.is-dark) {
    max-width: 500px;
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

    // 标题
    .dialog-title {
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    // 内容
    .dialog-content {
        display: flex;
        justify-content: center;

        // 上传
        :deep(.el-upload) {
            display: unset;
        }

        // 上传容器
        .cover-upload {
            width: 333px;
            height: 120px;
            cursor: pointer;
            border-radius: 6px;
            margin-left: -0.3rem;
            border: 1px dashed var(--el-border-color);

            .cover-image {
                width: 333px;
                height: 120px;
                display: block;
            }

            .cover-icon {
                width: 333px;
                height: 95px;
                font-size: 28px;
                color: #8c939d;
                text-align: center;
                margin-bottom: 0.5rem;
            }

            .cover-text {
                height: 5.5vh;
                font-size: 10px;
                color: #8c939d;
                margin-top: -3vh;
                text-align: center;
            }
        }

        .cover-upload:hover {
            border-color: var(--el-color-primary);
        }

        // 表单
        .el-form {
            width: 25rem;

            // 表单单行居中
            .el-row {
                text-align: center;

                .el-col {

                    .el-form-item {
                        display: inline-block;

                        .el-button {
                            width: 5rem;
                            margin: 0 2rem; 
                            margin-top: 1rem;
                            border-radius: 0.8rem;
                        }
                    }
                }
            }
        }
    }
}
</style>