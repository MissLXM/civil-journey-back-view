<template>
    <div class="message-view-container">
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
                                    <el-option label="通知标题" value="2" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span style="">通知类型&nbsp;&nbsp;</span>
                        <el-select v-model="selectNoticeType" placeholder="选中类型" style="width: 120px">
                            <el-option label="全部" value="0" />
                            <el-option label="系统通知" value="1" />
                            <el-option label="邮箱通知" value="2" />
                        </el-select>
                        <el-button @click="selectNoticeTypeEvent">搜索</el-button>
                    </div>
                    
                </div>
                <div class="header-button-container">
                    <el-button type="warning" @click="addMessageDialogEvent">发布</el-button>
                    <el-button type="info" @click="multipleDeleteMessageEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="noticeData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="noticeData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="通知编号" align="center" width="80" />
                    <el-table-column fixed prop="noticeType" label="通知类型" align="center" width="150">
                        <template v-slot="scope">
                            <el-tag :type="scope.row.noticeType === '系统通知' ? 'success' : 'warning'">
                                {{ scope.row.noticeType === '系统通知' ? '系统通知' : '邮箱通知' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="noticeTitle" label="通知标题" align="center" :width="flexColumnWidth('noticeTitle', noticeData.records)"/>
                    <el-table-column prop="noticeContent" label="通知内容" align="center" :width="flexColumnWidth('noticeContent', noticeData.records)"/>
                    <el-table-column prop="senderName" label="发布者" align="center" width="150" />
                    <el-table-column prop="senderAvatar" label="发布者头像" align="center" width="100">
                        <template v-slot="scope">
                            <el-image :src="scope.row.senderAvatar"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="acceptName" label="接收者" align="center" width="150" />
                    <el-table-column prop="acceptEmail" label="接收者邮箱" align="center" width="180" />
                    <el-table-column prop="acceptAvatar" label="接收者头像" align="center" width="100">
                        <template v-slot="scope">
                            <el-image :src="scope.row.acceptAvatar"/>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="选项" align="center" width="120">
                        <template #default="scope">
                            <el-button
                                link 
                                type="danger" 
                                @click="simpleDeleteMessageEvent(scope.row.noticeUserId)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="noticeData.total"
                            :page-count="noticeData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="noticeQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="addMessageDialog" @close="dialogClose">
            <div class="dialog-title">发布信息</div>
            <div class="dialog-content">
                <el-form :model="addMessageForm">
                    <el-form-item label="通知类型">
                        <el-radio-group v-model="addMessageForm.noticeType">
                            <el-radio :label="'系统通知'">系统通知</el-radio>
                            <el-radio :label="'邮箱通知'">邮箱通知</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="通知标题">
                        <el-input v-model="addMessageForm.noticeTitle" placeholder="请输入通知标题"/>
                    </el-form-item>
                    <el-form-item label="通知内容">
                        <el-input v-model="addMessageForm.noticeContent" placeholder="请输入通知内容" type="textarea" :rows="10"/>
                    </el-form-item>
                    <el-form-item label="接&ensp;收&ensp;者">
                        <el-transfer 
                            :data="user" 
                            v-model="accepter" 
                            :titles="['所有用户', '需发送的用户']"
                        />
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addMessageEvent">发布</el-button>
                                <el-button @click="addMessageDialog = false">取消</el-button>
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
import { adminStore } from '@/stores/admin';
import { Search } from '@element-plus/icons-vue'
import { getUserIdAndNickname } from '@/api/user'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { flexColumnWidth, isNotEmpty } from '@/global'
import { getAllNotice, releaseNotice, deleteNotice } from '@/api/notice';


// 用户信息
const user = ref()
// 查询方式
const queryId = ref()
// 接收者
const accepter = ref()
// 查询的值
const queryValue = ref()
// 通知数据
const noticeData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 管理员信息
const admin = adminStore()
// 通知id
const noticeUserIds = ref()
// 发布消息表单
const addMessageForm = ref({
    accepter: null,
    noticeType: null,
    senderName: null,
    noticeTitle: null,
    noticeContent: null,
})
// 选择类型
const selectNoticeType = ref()
// 通知查询参数
const noticeQueryParams = ref({
    pageSize: 7,
    typeId: null,
    currentPage: 1,
    senderName: null,
    noticeTitle: null,
})
// 发布消息对话框
const addMessageDialog = ref(false)


// 挂载函数
onMounted(() => {
    // 加载通知
    loadNotice()
})

// 查询事件
function queryEvent() {
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearQueryParams()
                loadNotice()
            }
        } else {
            selectNoticeType.value = "0"
            if (queryId.value == 1) {
                noticeQueryParams.value.currentPage = 1
                noticeQueryParams.value.senderName = queryValue.value
                noticeQueryParams.value.noticeTitle = null
            } else if (queryId.value == 2) {
                noticeQueryParams.value.currentPage = 1
                noticeQueryParams.value.senderName = null
                noticeQueryParams.value.noticeTitle = queryValue.value
            } else {
                clearQueryParams()
                queryValue.value = null
                noticeQueryParams.value.typeId = null
            }

            loadNotice()
        }
    }
}

// 加载通知 
function loadNotice() {
    getAllNotice(noticeQueryParams.value).then(response => {
        if (response.data.code === 200) {
            noticeData.value = response.data.data
        } else {
            noticeData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

// 关闭对话框
function dialogClose() {
    addMessageForm.value = {
        accepter: null,
        noticeType: null,
        senderName: null,
        noticeTitle: null,
        noticeContent: null,
    }

    user.value = []
    accepter.value = []
}

// 发布信息事件
function addMessageEvent() {
    if (!isNotEmpty(addMessageForm.value.noticeType) ||
    !isNotEmpty(addMessageForm.value.noticeTitle) ||
    !isNotEmpty(addMessageForm.value.noticeContent)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    addMessageForm.value.accepter = accepter.value
    if (addMessageForm.value.accepter == null) {
        ElMessage.info('请选择接收者')
        return
    }

    addMessageForm.value.senderName = admin.nickname

    releaseNotice(addMessageForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('发布成功')
            addMessageDialog.value = false
            loadNotice()
        } else {
            ElMessage.error('发布失败')
        }
    })
    
}

// 清空查询条件
function clearQueryParams() {
    noticeQueryParams.value.typeId = null
    noticeQueryParams.value.currentPage = 1
    noticeQueryParams.value.senderName = null
    noticeQueryParams.value.noticeTitle = null
}

// 发布消息对话框事件
function addMessageDialogEvent() {
    // 加载用户id和昵称
    getUserIdAndNickname().then(response => {
        if (response.data.code === 200) {
            user.value = response.data.data
            addMessageDialog.value = true
        }
    })
    
}

// 选择通知类型事件
function selectNoticeTypeEvent() {
    queryId.value = "0"
    queryValue.value = null
    clearQueryParams()

    if (selectNoticeType.value != 0) {
        noticeQueryParams.value.typeId = selectNoticeType.value
    }
    loadNotice()
}

// 多删除通知事件
function multipleDeleteMessageEvent() {
    deleteNotice(noticeUserIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadNotice()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 分页事件
function handleCurrentChange(val: any) {
    noticeQueryParams.value.currentPage = val
    loadNotice()
}

// 选中事件
function handleSelectionChange(selection: any) {
    noticeUserIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        noticeUserIds.value.push(selection[i].noticeUserId)
    }
}

// 单删除通知事件
function simpleDeleteMessageEvent(noticeUserId: any) {
    const noticeUserIds = [ noticeUserId ]
    deleteNotice(noticeUserIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadNotice()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

</script>

<style lang="less" scoped>
.message-view-container {
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

// 弹出框样式
.dialog-container {
    // 对话框
    :deep(.el-dialog) {
        width: 45%; 
        top: -2rem;
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
            width: 40rem;

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

:deep(.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label) {
    font-size: 12px
}
</style>