<template>
    <div class="exam-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="warning" @click="addExamDialog = true">新增</el-button>
                    <el-button type="info" @click="multipleDeleteExamEvent">删除</el-button>
                </div>
            </div> 

            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="examTimeData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="examTimeData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="examYear" label="年份" align="center" />
                    <el-table-column prop="examProvince" label="考试地点" align="center" />
                    <el-table-column prop="examType" label="考试类型" align="center" />
                    <el-table-column prop="applyTime" label="报名时间" align="center" />
                    <el-table-column prop="examTime" label="考试时间" align="center" />
                    <el-table-column fixed="right" label="选项" align="center" width="250">
                        <template #default="scope">
                            <el-button link type="info" @click="updateExamDialogEvent(scope.row)">
                                修改
                            </el-button>
                            <el-button link type="danger" @click="simpleDeleteExamEvent(scope.row.examTimeId)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="examTimeData.total"
                            :page-count="examTimeData.pages"
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
        <el-dialog v-model="addExamDialog" @close="dialogClose">
            <div class="dialog-title">添加考试信息</div>
            <div class="dialog-content">
                <el-form :model="addExamForm">
                    <el-form-item label="考试年份">
                        <el-date-picker 
                            type="year"
                            value-format="YYYY"
                            placeholder="请选择考试年份"
                            v-model="addExamForm.examYear"
                        />
                    </el-form-item>
                    <el-form-item label="考试类型">
                        <el-radio-group v-model="addExamForm.examType">
                            <el-radio :label="'国考'">国考</el-radio>
                            <el-radio :label="'省考'">省考</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="考试地点" v-if="addExamForm.examType == '省考'">
                        <el-select 
                            placeholder="选择考试地点"
                            v-model="addExamForm.examProvince"
                        >
                            <el-option
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                                v-for="(item, index) in allCityOnChina"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报名时间">
                        <el-date-picker
                            type="datetime"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择报名时间"
                            v-model="addExamForm.applyTime"
                        />
                    </el-form-item>
                    <el-form-item label="考试时间">
                        <el-date-picker
                            type="datetime"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择考试时间"
                            v-model="addExamForm.examTime"
                        />
                    </el-form-item>

                    
                    <el-row>
                        <el-col>
                            <el-form-item style="margin-left: -6rem;">
                                <el-button type="primary" @click="addExamEvent">添加</el-button>
                                <el-button @click="addExamDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateExamDialog" @close="dialogClose">
            <div class="dialog-title">修改考试信息</div>
            <div class="dialog-content">
                <el-form :model="updateExamForm">
                    <el-form-item label="考试年份">
                        <el-date-picker 
                            type="year"
                            value-format="YYYY"
                            placeholder="请选择考试年份"
                            v-model="updateExamForm.examYear"
                        />
                    </el-form-item>
                    <el-form-item label="考试类型">
                        <el-radio-group v-model="updateExamForm.examType">
                            <el-radio :label="'国考'">国考</el-radio>
                            <el-radio :label="'省考'">省考</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="考试地点" v-if="updateExamForm.examType == '省考'">
                        <el-select 
                            placeholder="选择考试地点"
                            v-model="updateExamForm.examProvince"
                        >
                            <el-option
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                                v-for="(item, index) in allCityOnChina"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="报名时间">
                        <el-date-picker
                            type="datetime"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择报名时间"
                            v-model="updateExamForm.applyTime"
                        />
                    </el-form-item>
                    <el-form-item label="考试时间">
                        <el-date-picker
                            type="datetime"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择考试时间"
                            v-model="updateExamForm.examTime"
                        />
                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item style="margin-left: -6rem;">
                                <el-button type="primary" @click="updateExamEvent">修改</el-button>
                                <el-button @click="updateExamDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { allCityOnChina, isNotEmpty } from '@/global'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { getAllExamTime, addExam, updateExam, deleteExam } from '@/api/message';


// 考试ID
const examTimeIds = ref()
// 分页参数
const pageParams = ref({
    pageSize: 17,
    currentPage: 1,
})
// 考试时间信息
const examTimeData= ref({
    pages: 0,
    total: 0,
    records: [],
})
// 添加考试表单
const addExamForm = ref({
    examYear: null,
    examType: null,
    examTime: null,
    applyTime: null,
    examProvince: null,
})
// 修改考试表单
const updateExamForm = ref({
    examYear: null,
    examType: null,
    examTime: null,
    applyTime: null,
    examTimeId: null,
    examProvince: null,
})
// 添加考试对话框
const addExamDialog = ref(false)
// 修改考试对话框
const updateExamDialog = ref(false)




// 挂载函数
onMounted(() => {
    // 加载考试时间
    loadExamTime()
})

// 对话框关闭事件
function dialogClose() {
    addExamForm.value = {
        examYear: null,
        examType: null,
        examTime: null,
        applyTime: null,
        examProvince: null,
    }
    updateExamForm.value = {
        examYear: null,
        examType: null,
        examTime: null,
        applyTime: null,
        examTimeId: null,
        examProvince: null,
    }
}

// 加载考试时间
function loadExamTime() {
    getAllExamTime(pageParams.value).then(response => {
        if (response.data.code === 200) {
            examTimeData.value = response.data.data
        } else {
            examTimeData.value = {
                pages: 0,
                total: 0,
                records: [],
            }
        }
    })
}

// 添加考试事件
function addExamEvent() {
    if (!isNotEmpty(addExamForm.value.examYear) ||
    !isNotEmpty(addExamForm.value.examType) ||
    !isNotEmpty(addExamForm.value.examTime) ||
    !isNotEmpty(addExamForm.value.applyTime)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    if (addExamForm.value.examType == '省考' && !isNotEmpty(addExamForm.value.examProvince)) {
        ElMessage.info('请填写完整信息')
        return 
    }
    
    addExam(addExamForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('添加成功')
            addExamDialog.value = false
            loadExamTime()
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 修改考试事件
function updateExamEvent() {
    if (!isNotEmpty(updateExamForm.value.examYear) ||
    !isNotEmpty(updateExamForm.value.examType) ||
    !isNotEmpty(updateExamForm.value.examTime) ||
    !isNotEmpty(updateExamForm.value.applyTime)  ||
    !isNotEmpty(updateExamForm.value.examTimeId)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    if (addExamForm.value.examType == '省考' && !isNotEmpty(addExamForm.value.examProvince)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    updateExam(updateExamForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改成功')
            updateExamDialog.value = false
            loadExamTime()
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 多选删除考试事件
function multipleDeleteExamEvent() {
    if (examTimeIds.value.length === 0) {
        ElMessage.error('请选择要删除的考试')
        return 
    }

    deleteExam(examTimeIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadExamTime()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 分页事件
function handleCurrentChange(val: any) {
    pageParams.value.currentPage = val
    loadExamTime()
}

// 修改考试对话框事件
function updateExamDialogEvent(item: any) {
    updateExamForm.value = {
        examYear: item.examYear,
        examType: item.examType,
        examTime: item.examTime,
        applyTime: item.applyTime,
        examTimeId: item.examTimeId,
        examProvince: item.examProvince,
    }

    updateExamDialog.value = true
}

// 选中事件
function handleSelectionChange(selection: any) {
    examTimeIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        examTimeIds.value.push(selection[i].examTimeId)
    }
}

// 单删除考试事件
function simpleDeleteExamEvent(examTimeId: any) {
    const examTimeIds = [ examTimeId ]

    deleteExam(examTimeIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadExamTime()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

</script>

<style lang="less" scoped>
.exam-view-container {
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
            margin-left: 6rem;

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