<template>
    <div class="medal-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="warning" @click="addMedalDialog = true">新增</el-button>
                    <el-button type="info" @click="multipleDeleteMedalEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="medalData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="medalData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="medalName" label="勋章名称" align="center" />
                    <el-table-column prop="medalIcon" label="勋章图标" align="center" width="100">
                        <template #default="scope">
                            <el-image :src="scope.row.medalIcon" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="medalExplain" label="达成条件" align="center" :width="flexColumnWidth('medalExplain', medalData.records)"/>
                    <el-table-column prop="totalHoldNumber" label="持有人数量" align="center" />
                    <el-table-column prop="viewVideoNumber" label="抵扣购买次数" align="center" />
                    <el-table-column prop="medalLevel" label="勋章级别" align="center" />
                    <el-table-column prop="creator" label="创建者" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column fixed="right" label="选项" align="center" width="300">
                        <template #default="scope">
                            <el-button link type="info" @click="updateMedalDialogEvent(scope.row)">
                                修改
                            </el-button>
                            <el-button link type="danger" @click="simpleDeleteMedalEvent(scope.row.medalId)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="medalData.total"
                            :page-count="medalData.pages"
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
        <el-dialog v-model="addMedalDialog" @close="dialogClose">
            <div class="dialog-title">添加勋章</div>
            <div class="dialog-content">
                <el-form :model="addMedalForm">
                    <el-form-item label="勋章名称">
                        <el-input v-model="addMedalForm.medalName" placeholder="请输入勋章名称"/>
                    </el-form-item>
                    <el-form-item label="勋章图标">
                        <el-upload 
                            class="cover-upload"
                            :show-file-list="false"
                            :action="actionMedalIconUrl"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="medalIconUrl.newPath"
                                :src="medalIconUrl.newPath" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加勋章图标</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="勋章级别">
                        <el-input v-model="addMedalForm.medalLevel" placeholder="请输入勋章级别" 
                            type="text"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        />
                    </el-form-item>
                    <el-form-item label="达成条件">
                        <el-input v-model="addMedalForm.medalExplain" placeholder="请输入达成条件"/>
                    </el-form-item>
                    <el-form-item label="抵扣次数">
                        <el-input v-model="addMedalForm.viewVideoNumber" placeholder="请输入抵扣次数" 
                            type="text"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        />
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addMedalEvent">添加</el-button>
                                <el-button @click="addMedalDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateMedalDialog" @close="dialogClose">
            <div class="dialog-title">修改勋章</div>
            <div class="dialog-content">
                <el-form :model="updateMedalForm">
                    <el-form-item label="勋章名称">
                        <el-input v-model="updateMedalForm.medalName" placeholder="请输入勋章名称"/>
                    </el-form-item>
                    <el-form-item label="勋章图标">
                        <el-upload 
                            :data="admin"
                            class="cover-upload"
                            :show-file-list="false"
                            :action="actionMedalIconUrl"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="updateMedalForm.newMedalIcon"
                                :src="updateMedalForm.newMedalIcon" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加勋章图标</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="勋章级别">
                        <el-input v-model="updateMedalForm.medalLevel" placeholder="请输入勋章级别" 
                            type="text"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        />
                    </el-form-item>
                    <el-form-item label="达成条件">
                        <el-input v-model="updateMedalForm.medalExplain" placeholder="请输入达成条件"/>
                    </el-form-item>
                    <el-form-item label="抵扣次数">
                        <el-input v-model="updateMedalForm.viewVideoNumber" placeholder="请输入抵扣次数" 
                            type="text"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        />
                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="updateMedalEvent">修改</el-button>
                                <el-button @click="updateMedalDialog = false">取消</el-button>
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
import { queryAllMedal, addMedal, updateMedal, deleteMedal } from '@/api/user';
import { flexColumnWidth, isNotEmpty } from '@/global';
import { adminStore } from '@/stores/admin';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
 

// 勋章ID
const medalIds = ref()
// 勋章信息
const medalData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 分页参数
const pageParams = ref({
    pageSize: 7,
    currentPage: 1,
})
// 管理员信息
const admin = adminStore()
// 添加勋章表单
const addMedalForm = ref({
    creator: null,
    updater: null,
    medalName: null,
    medalIcon: null,
    medalLevel: null,
    medalExplain: null,
    viewVideoNumber: null,
})
// 回显的勋章图标
const medalIconUrl = ref({
    oldPath: null,
    newPath: null,
})
// 修改勋章表单
const updateMedalForm = ref({
    medalId: null,
    updater: null,
    medalName: null,
    medalIcon: null,
    medalLevel: null,
    medalExplain: null,
    newMedalIcon: null,
    viewVideoNumber: null,
})
// 添加勋章对话框
const addMedalDialog = ref(false)
// 修改勋章对话框
const updateMedalDialog = ref(false)
// 图标上传地址
const actionMedalIconUrl = 'http://localhost:8000/user-center-service/backend/admin/submitMedalIcon'

// 挂载函数
onMounted(() => {
    // 加载角色
    loadMedal()
})

// 加载菜单
function loadMedal() {
    queryAllMedal(pageParams.value).then(response => {
        if (response.data.code === 200) {
            medalData.value = response.data.data
            console.log(medalData.value)
        } else {
            medalData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
   
}

// 关闭对话框
function dialogClose() {
    addMedalForm.value = {
        creator: null,
        updater: null,
        medalName: null,
        medalIcon: null,
        medalLevel: null,
        medalExplain: null,
        viewVideoNumber: null,
    }

    updateMedalForm.value = {
        medalId: null,
        updater: null,
        medalName: null,
        medalIcon: null,
        medalLevel: null,
        medalExplain: null,
        newMedalIcon: null,
        viewVideoNumber: null,
    }

    medalIconUrl.value = {
        oldPath: null,
        newPath: null,
    }
}

// 添加勋章事件
function addMedalEvent() {
    if (!isNotEmpty(addMedalForm.value.medalName)
    || !isNotEmpty(addMedalForm.value.medalLevel)
    || !isNotEmpty(addMedalForm.value.medalExplain)
    || !isNotEmpty(addMedalForm.value.viewVideoNumber)
    || !isNotEmpty(addMedalForm.value.medalIcon)) {
        ElMessage.info('请填写完整信息')
        return
    }
    addMedalForm.value.creator = admin.nickname
    addMedalForm.value.updater = admin.nickname
    
    addMedal(addMedalForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('添加成功')
            addMedalDialog.value = false
            loadMedal()
        } else {
            ElMessage.error('添加失败')
        }
    })
}

// 修改勋章事件
function updateMedalEvent() {
    if (!isNotEmpty(updateMedalForm.value.medalName)
    || !isNotEmpty(updateMedalForm.value.medalIcon)
    || !isNotEmpty(updateMedalForm.value.medalLevel)
    || !isNotEmpty(updateMedalForm.value.medalExplain)
    || !isNotEmpty(updateMedalForm.value.viewVideoNumber)
    || !isNotEmpty(updateMedalForm.value.medalId)) {
        ElMessage.info('请填写完整信息')
        return
    }

    updateMedalForm.value.updater = admin.nickname

    updateMedal(updateMedalForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改成功')
            updateMedalDialog.value = false
            loadMedal()
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 多删除勋章
function multipleDeleteMedalEvent() {
    if (medalIds.value.length === 0) {
        ElMessage.info('请选择要删除的勋章')
        return
    }

    deleteMedal(medalIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadMedal()
        } else {
            ElMessage.error('删除失败')
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
    pageParams.value.currentPage = val
    loadMedal()
}

// 单删除勋章
function simpleDeleteMedalEvent(id: any) {
    const medalIds = [ id ]
    deleteMedal(medalIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadMedal()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 上传图片成功后的回调
function handlerImageSuccess(result: any) {
    // 图片回显
    medalIconUrl.value = result.data
    addMedalForm.value.medalIcon = result.data.oldPath
    updateMedalForm.value.medalIcon = result.data.oldPath
    updateMedalForm.value.newMedalIcon = result.data.newPath
}

// 修改对话框事件
function updateMedalDialogEvent(item: any) {
    updateMedalForm.value = {
        medalId: item.medalId,
        updater: admin.nickname,
        medalName: item.medalName,
        medalIcon: item.medalIcon,
        medalLevel: item.medalLevel,
        newMedalIcon: item.medalIcon,
        medalExplain: item.medalExplain,
        viewVideoNumber: item.viewVideoNumber,
    }

    updateMedalDialog.value = true
}

// 选中事件
function handleSelectionChange(selection: any) {
    medalIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        medalIds.value.push(selection[i].medalId)
    }
}
</script>

<style lang="less" scoped>
.medal-view-container {
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

        // 上传
        :deep(.el-upload) {
            display: unset;
        }

        // 上传容器
        .cover-upload {
            width: 120px;
            height: 120px;
            cursor: pointer;
            border-radius: 6px;
            margin-left: -0.3rem;
            border: 1px dashed var(--el-border-color);

            .cover-image {
                width: 120px;
                height: 120px;
                display: block;
            }

            .cover-icon {
                width: 120px;
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