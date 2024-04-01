<template>
    <div class="zone-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="warning" @click="addCategoryDialog = true;">新增</el-button>
                    <el-button type="info" @click="multiDeleteCategoryEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="categoryData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="categoryData.records" 
                    @selection-change="handleSelectionChange"   
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="categoryName" label="分类名称" align="center" />
                    <el-table-column prop="creator" label="创建者" align="center" />
                    <el-table-column prop="updater" label="更新者" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column prop="updateTime" label="更新时间" align="center" />
                    <el-table-column fixed="right" label="选项" align="center" width="250">
                        <template #default="scope">
                            <el-button link type="info" @click="updateDialog(scope.row)">
                                修改
                            </el-button>
                            <el-button link type="danger" @click="simpleDeleteCategoryEvent(scope.row.categoryId)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="categoryData.total"
                            :page-count="categoryData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="pageParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="addCategoryDialog" @close="dialogClose">
            <div class="dialog-title">添加分类</div>
            <div class="dialog-content">
                <el-form :model="addCategoryForm">
                    <el-form-item label="分类名称">
                        <el-input v-model="addCategoryForm.categoryName"/>
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addCategoryEvent">添加</el-button>
                                <el-button @click="addCategoryDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateCategoryDialog" @close="dialogClose">
            <div class="dialog-title">修改分类</div>
            <div class="dialog-content">
                <el-form :model="updateCategoryForm">
                    <el-form-item label="分类名称">
                        <el-input v-model="updateCategoryForm.categoryName"/>
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="updateCategoryEvent">修改</el-button>
                                <el-button @click="updateCategoryDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { getAllCategory, addCategory, updateCategory, deleteCategory } from '@/api/chart';
import { adminStore } from '@/stores/admin';


// 分页参数
const pageParams = ref({
    pageSize: 17,
    currentPage: 1,
})
// 选中分类ID
const categoryIds = ref()
// 分类信息
const categoryData= ref({
    pages: 0,
    total: 0,
    records: [],
})
// 管理员信息
const admin = adminStore()
// 添加分类表单
const addCategoryForm = ref<any>({
    creator: null,
    updater: null,
    categoryName: null
})
// 添加分类对话框
const addCategoryDialog = ref(false)
// 修改分类表单
const updateCategoryForm = ref<any>({
    updater: null,
    categoryId: null,
    categoryName: null
})
// 修改分类对话框
const updateCategoryDialog = ref(false)


// 挂载函数
onMounted(() => {
    // 获取分类
    loadCategory()
}) 

// 弹出框关闭
function dialogClose() {
    addCategoryForm.value.categoryName = null
    updateCategoryForm.value.categoryName = null
}

// 获取分类
function loadCategory() {
    getAllCategory(pageParams.value).then(response => {
        if (response.data.code === 200) {
            categoryData.value = response.data.data
        } else {
            categoryData.value = {
                pages: 0,
                total: 0,
                records: [],
            }
        }
    })
}

// 添加分类事件
function addCategoryEvent() {
    if (addCategoryForm.value.categoryName === null
        || addCategoryForm.value.categoryName === ''
        || addCategoryForm.value.categoryName === undefined) {
        ElMessage.error('分类名称不能为空')
        return
    }
    addCategoryForm.value.creator = admin.nickname
    addCategoryForm.value.updater = admin.nickname
    addCategory(addCategoryForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            addCategoryDialog.value = false
            loadCategory()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 修改分类事件
function updateCategoryEvent() {
    if (updateCategoryForm.value.categoryName === null
        || updateCategoryForm.value.categoryName === ''
        || updateCategoryForm.value.categoryName === undefined) {
        ElMessage.error('分类名称不能为空')
        return
    }
    updateCategoryForm.value.updater = admin.nickname
    updateCategory(updateCategoryForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            updateCategoryDialog.value = false
            loadCategory()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 修改弹出框
function updateDialog(item: any) {
    updateCategoryForm.value.categoryId = item.categoryId
    updateCategoryForm.value.categoryName = item.categoryName
    updateCategoryDialog.value = true
}

// 多选删除类别
function multiDeleteCategoryEvent() {
    if (categoryIds.value == undefined ||
    categoryIds.value == '' || categoryIds.value == null) {
        ElMessage.info('请选择要删除的分类')
        return
    }

    deleteCategory(categoryIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadCategory()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 选中事件
function handleSelectionChange(selection: any) {
    categoryIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        categoryIds.value.push(selection[i].categoryId)
    }
}

// 分页事件 
function handleCurrentChange(currentPage: any) {
    pageParams.value.currentPage = currentPage
    loadCategory()
}

// 单删除分类事件
function simpleDeleteCategoryEvent(categoryId: any) {
    const categoryIds = [ categoryId ]
    deleteCategory(categoryIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadCategory()
        } else {
            ElMessage.error('操作失败')
        }
    })
}
</script>

<style lang="less" scoped>
.zone-view-container {
    height: 96%;

    :deep(.el-card) {
        height: 100%;
    }

    // 顶部容器
    .header-user-container {
        display: flex;
        margin: 1vh 0 2vh 0;
        justify-content: space-between;

    }

    // 底部容器
    .footer-user-container {
        height: 75.5vh;
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