<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="teacher-apply-view-container">
        <el-card>
            <!-- <div class="header-user-container"></div> -->
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="teacherData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="teacherData.records" 
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="index" label="申请编号" align="center" width="100"/>
                    <el-table-column prop="username" label="讲师账号" align="center" />
                    <el-table-column prop="nickname" label="讲师昵称" align="center" />
                    <el-table-column prop="userEmail" label="讲师邮箱" align="center" />
                    <el-table-column prop="certificateNumber" label="教师资格证编号" align="center" />
                    <el-table-column prop="certificatePhoto" label="教师资格证照片" align="center" width="150">
                        <template v-slot="scope">
                            <el-tooltip 
                                effect="light"
                                placement="bottom" 
                            >
                                <template #content>
                                    <span>点击查看图片详情</span>
                                </template>
                                <el-image :src="scope.row.certificatePhoto" @click="showImage(scope.row.certificatePhoto)"/>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="选项" width="200" align="center">
                        <template v-slot="scope" #default>
                            <el-button
                                link 
                                size="small" 
                                type="primary" 
                                @click="agreeApply(scope.row.teacherAuditId)"
                            >
                                同意申请
                            </el-button>
                            <el-button
                                link 
                                size="small" 
                                type="danger" 
                                @click="unAgreeApplyDialog(scope.row.teacherAuditId)"
                            >
                                不同意申请
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="teacherData.total"
                            :page-count="teacherData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="teacherQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="imageDialog">
            <el-image :src="image"/> 
        </el-dialog>
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
import { onMounted, ref } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { agreeTeacherApply, disagreeTeacherApply, queryTeacherApply } from '@/api/user';

// 选中图片
const image = ref()
// 讲师信息
const teacherData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 图片弹出框
const imageDialog = ref(false) 
// 不同意弹出框
const unAgreeDialog = ref(false)
// 讲师查询参数
const teacherQueryParams = ref({
    pageSize: 7,
    currentPage: 1,
})
// 拒绝原因参数
const unAgreeApplyParams = ref<any>({
    userId: null,
    auditFailureReason: null,
})


// 挂载函数
onMounted(() => {
    // 加载讲师申请信息
    loadTeacherApply()
})

// 加载讲师申请信息
function loadTeacherApply() {
    queryTeacherApply(teacherQueryParams.value).then(response => {
        if (response.data.code === 200) {
            teacherData.value = response.data.data
        } else {
            teacherData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

// 同意讲师申请
function agreeApply(id: any) {
    agreeTeacherApply(id).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadTeacherApply()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 不同意讲师申请操作
function unAgreeApply() {
    if (unAgreeApplyParams.value.auditFailureReason === null || 
    unAgreeApplyParams.value.auditFailureReason === '' ||
    unAgreeApplyParams.value.auditFailureReason === undefined) {
        ElMessage.error('请填写拒绝原因')
        return
    }

    disagreeTeacherApply(unAgreeApplyParams.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            unAgreeDialog.value = false
            loadTeacherApply()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 图片详情
function showImage(imageUrl: any) {
    image.value = imageUrl
    imageDialog.value = true
}

// 不同意讲师申请弹出框
function unAgreeApplyDialog(id: any) {
    unAgreeApplyParams.value.userId = id
    unAgreeDialog.value = true
}

// 分页事件 
function handleCurrentChange(val: any) {
    teacherQueryParams.value.currentPage = val
    loadTeacherApply()
}
</script>

<style lang="less" scoped>
.teacher-apply-view-container {
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
        height: 82vh;
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