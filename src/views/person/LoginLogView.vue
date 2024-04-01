<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="login-log-view-container">
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
                                    <el-option label="登录名称" value="1" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span style="">角色&nbsp;&nbsp;</span>
                        <el-select v-model="selectRole" placeholder="角色" style="width: 130px">
                            <el-option label="全部" value="0" />
                            <el-option label="用户" value="1" />
                            <el-option label="讲师" value="2" />
                            <el-option label="普通管理员" value="3" />
                            <el-option label="超级管理员" value="4" />
                        </el-select>
                        <el-button @click="roleQueryEvent">搜索</el-button>
                    </div>
                    
                </div>
                <div class="header-button-container">
                    <el-button type="info" @click="clearAllLoginLogEvent">清空日志</el-button>
                    <el-button type="info" @click="deleteLoginLogEvent">删除日志</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="loginLogData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="loginLogData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55"/>
                    <el-table-column prop="username" label="登录账号" align="center" />
                    <el-table-column prop="ipAddress" label="IP地址" align="center" />
                    <el-table-column prop="ipLocation" label="IP位置" align="center" />
                    <el-table-column prop="createTime" label="登录时间" align="center" />
                    <el-table-column prop="loginType" label="用户角色" align="center">
                        <template v-slot="scope" #default>
                            <el-tag v-if="scope.row.loginType == '用户'" type="info">用户</el-tag>
                            <el-tag v-if="scope.row.loginType == '讲师'" type="warning">讲师</el-tag>
                            <el-tag v-if="scope.row.loginType == '普通管理员'" type="success">普通管理员</el-tag>
                            <el-tag v-if="scope.row.loginType == '超级管理员'" type="danger">超级管理员</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="选项" width="200" align="center">
                        <template v-slot="scope" #default>
                            <el-button
                                link
                                size="small" 
                                type="danger" 
                                @click="deleteLoginLogOneEvent(scope.row.loginLogId)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="loginLogData.total"
                            :page-count="loginLogData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="loginLogQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { queryLoginLog, deleteLoginLog, clearAllLoginLog } from '@/api/user';

// 查询方式
const queryId = ref()
// 查询的值
const queryValue = ref()
// 选中角色
const selectRole = ref()
// 登录日志ID
const loginLogIds = ref()
// 登录日志数据
const loginLogData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 日志查询参数
const loginLogQueryParams = ref<any>({
    pageSize: 16,
    username: null,
    userRole: null,
    currentPage: 1,
})


// 挂载函数
onMounted(() => {
    // 加载日志
    loadLoginLog()
})

// 查询事件
function queryEvent() {
    selectRole.value = "0"
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        selectRole.value = "0"
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                loginLogQueryParams.value.username = null
                loginLogQueryParams.value.currentPage = 1
                loginLogQueryParams.value.userRole = null
                loadLoginLog()
            }
        } else {
            if (queryId.value === '1') {
                loginLogQueryParams.value.username = queryValue.value
                loginLogQueryParams.value.currentPage = 1
                loginLogQueryParams.value.userRole = null
            } else {
                loginLogQueryParams.value.username = null
                loginLogQueryParams.value.currentPage = 1
                loginLogQueryParams.value.userRole = null
                queryValue.value = null
            }
        }
        
    }
    
    // 加载数据
    loadLoginLog()
}

// 加载登录日志
function loadLoginLog() {
    queryLoginLog(loginLogQueryParams.value).then(response => {
        if (response.data.code === 200) {
            loginLogData.value = response.data.data
        } else {
            loginLogData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

// 角色查询 
function roleQueryEvent() {
    queryId.value = "0"
    queryValue.value = null


    if (selectRole.value == 1) {
        loginLogQueryParams.value.userRole = "用户"
    } else if (selectRole.value == 2) {
        loginLogQueryParams.value.userRole = "讲师"
    } else if (selectRole.value == 3) {
        loginLogQueryParams.value.userRole = "普通管理员"
    } else if (selectRole.value == 4) {
        loginLogQueryParams.value.userRole = "超级管理员"
    } else {
        ElMessage.info('请选择角色')
    }

    loadLoginLog()
}

// 多选删除登录记录
function deleteLoginLogEvent() {
    deleteLoginLog(loginLogIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadLoginLog()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 清空日志
function clearAllLoginLogEvent() {
    clearAllLoginLog().then(response => {
        if (response.data.code === 200) {
            ElMessage.success('清空成功')
            loadLoginLog()
        } else {
            ElMessage.error('清空失败')
        }
    })
}

// 分页事件 
function handleCurrentChange(val: any) {
    loginLogQueryParams.value.currentPage = val;
    // 加载数据
    loadLoginLog()
}

// 选中事件
function handleSelectionChange(selection: any) {
    loginLogIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        loginLogIds.value.push(selection[i].loginLogId)
    }
}

// 删除登录记录(单个)
function deleteLoginLogOneEvent(loginLogId: any) {
    const loginLogIds = [ loginLogId ]

    deleteLoginLog(loginLogIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadLoginLog()
        } else {
            ElMessage.error('删除失败')
        }
    })
}


</script>

<style lang="less" scoped>
// 登录日志容器
.login-log-view-container {
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

    // 文本
    .medal-info-title {
        margin-bottom: 1rem;
        padding: 0 0 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    // 列表容器
    .medal-item-container {
        display: flex;
        margin-left: 1.8rem;

        // 图片大小
        :deep(.el-image__inner) {
            width: 80px;
            height: 80px;
            margin-right: 2rem;
            
        }
    }   
}
</style>