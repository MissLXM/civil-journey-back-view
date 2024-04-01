<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="admin-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-query-container">
                    <div class="input-container">
                        <el-input v-model="queryValue">
                            <template #prepend>
                                <el-select 
                                    v-model="queryId" 
                                    style="width: 120px"
                                    placeholder="查询方式" 
                                >
                                    <el-option label="全部" value="0" />
                                    <el-option label="管理员昵称" value="1" />
                                    <el-option label="管理员邮箱" value="2" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryAdminEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span>角色&nbsp;&nbsp;</span>
                        <el-select v-model="selectRole" placeholder="角色" style="width: 100px">
                            <el-option label="全部" value="0" />
                            <el-option label="普通管理员" value="1" />
                            <el-option label="超级管理员" value="2" />
                        </el-select>
                        <el-button @click="queryAdminByRoleEvent">搜索</el-button>
                    </div>
                    
                </div>
                <div class="header-button-container">
                    <el-button type="info" @click="resetPassword">重置密码</el-button>
                </div>
            </div>

            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="adminData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="adminData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="管理员编号" align="center" width="100"/>
                    <el-table-column prop="username" label="登录名称" align="center" width="200"/>
                    <el-table-column prop="nickname" label="管理员昵称" align="center" width="200"/>
                    <el-table-column prop="adminEmail" label="管理员邮箱" align="center" />
                    <el-table-column prop="adminRole" label="管理员角色" align="center" width="200">
                        <template v-slot="scope">
                            <el-tag v-if="scope.row.adminRole == '普通管理员'" type="info">普通管理员</el-tag>
                            <el-tag v-else-if="scope.row.adminRole == '超级管理员'" type="warning">超级管理员</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="headPortrait" label="管理员头像" align="center" width="100">
                        <template v-slot="scope">
                            <el-image :src="scope.row.headPortrait"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isDelete" label="状态" align="center" width="150">
                        <template v-slot="scope">
                            <el-switch
                                size="small"
                                :active-value="0"
                                active-text="启用"
                                :inactive-value="1"
                                inactive-text="禁用"
                                v-model="scope.row.isDelete"
                                @change="handleSwitch(scope.row)"
                                v-if="scope.row.adminRole == '普通管理员'"
                            />
                            <span v-else /> 
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="选项" width="200" align="center">
                        <template #default="scope">
                            <el-button
                                link 
                                size="small" 
                                type="info" 
                                @click="resetPasswordByUserId(scope.row.adminId)"
                            >
                                重置密码
                            </el-button>
                            <el-button
                                link 
                                size="small" 
                                type="danger" 
                                style="margin-left: 1vw"
                                @click="deleteAdminInfo(scope.row.adminId)"
                                v-if="scope.row.adminRole == '普通管理员'"
                            >
                                删除
                            </el-button>
                            <el-button 
                                link 
                                size="small" 
                                type="primary" 
                                style="margin-left: 1vw"
                                v-if="scope.row.adminRole == '普通管理员'"
                                @click="upgradeSuperAdmin(scope.row.adminId)"
                            >
                                升超管
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="adminData.total"
                            :page-count="adminData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="adminQueryParams.currentPage"
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
import { deleteAdmin, upgradeAdmin, queryAdmin, queryAdminByRole, resetAdminPassword, switchAdmin } from '@/api/user';


const queryId = ref()
const selectRole = ref()
const queryValue = ref()

// 管理员信息
const adminData = ref({
    total: 0,
    pages: 0,
    records: []
})
// 管理员ID
const adminIds = ref<any>([])
// 管理员查询参数
const adminQueryParams = ref<any>({
    pageSize: 7,
    currentPage: 1,
    nickname: null,
    adminEmail: null,
})
// 角色参数
const roleQueryParams = ref({
    pageSize: 7,
    adminRole: '',
    currentPage: 1,
})


// 挂载函数
onMounted(() => {
    // 加载管理员信息
    loadAdminInfo()
})

// 加载管理员信息
function loadAdminInfo() {
    queryAdmin(adminQueryParams.value).then(response => {
        if (response.data.code === 200) {
            adminData.value = response.data.data
        } else {
            adminData.value = {
                total: 0,
                pages: 0,
                records: []
            }
        }
    })
}

// 重置密码
function resetPassword() {
    resetAdminPassword(adminIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('重置密码成功,密码为123456')
        } else {
            ElMessage.error(response.data.message)
        }
    })
}

// 查询管理员信息
function queryAdminEvent() {
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        selectRole.value = "0"
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearAdminParams()
                loadAdminInfo()
            }
        } else {
            if (queryId.value == 1) {
                adminQueryParams.value.nickname = queryValue.value
                adminQueryParams.value.adminEmail = null
                adminQueryParams.value.currentPage = 1
            } else if (queryId.value == 2) {
                adminQueryParams.value.nickname = null
                adminQueryParams.value.adminEmail = queryValue.value
                adminQueryParams.value.currentPage = 1
            } else {
                clearAdminParams()
                queryValue.value = null
            }

            // 重新加载
            loadAdminInfo()
        }
    }
}

// 清空管理员查询参数
function clearAdminParams() {
    adminQueryParams.value.nickname = null
    adminQueryParams.value.adminEmail = null
    adminQueryParams.value.currentPage = 1
}

// 开关事件
function handleSwitch(row: any) {
    // 禁用/启用
    switchAdmin(row.adminId, row.isDelete).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
        } else {
            ElMessage.error(response.data.message)
        }
    })
}

// 查询管理员信息(角色)
function queryAdminByRoleEvent() {
    if (selectRole.value == undefined) {
        ElMessage.info('请选择查询角色')
    } else {
        queryId.value = "0"
        queryValue.value = ""
        if (selectRole.value == 1) {
            roleQueryParams.value.adminRole = '普通管理员'
        } else if (selectRole.value == 2) {
            roleQueryParams.value.adminRole = '超级管理员'
        }
    }
    queryAdminByRole(roleQueryParams.value).then(response => {
        if (response.data.code === 200) {
            adminData.value = response.data.data
        } else {
            adminData.value = {
                total: 0,
                pages: 0,
                records: []
            }
        }
    })
}

// 删除管理员
function deleteAdminInfo(adminId: any) {
    const adminIds = [adminId]
    deleteAdmin(adminIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadAdminInfo()
        } else {
            ElMessage.error(response.data.message)
        }
    })
}

// 分页事件 
function handleCurrentChange(val: any) {
    adminQueryParams.value.currentPage = val
    loadAdminInfo()
}

// 升级超管
function upgradeSuperAdmin(adminId: any) {
    ElMessageBox.confirm('是否升级超级管理员', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        upgradeAdmin(adminId).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('升级成功')
                loadAdminInfo()
            } else {
                ElMessage.error(response.data.message)
            }
        })
    }).catch(() => {
        ElMessage.info('取消升级')
    })
}   

// 单用户重置密码
function resetPasswordByUserId(adminId: any) {
    const adminIds = [adminId]
    resetAdminPassword(adminIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('重置密码成功,密码为123456')
        } else {
            ElMessage.error(response.data.message)
        }
    })
} 

// 选中事件
function handleSelectionChange(selection: any) {
    adminIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        adminIds.value.push(selection[i].adminId)
    }
}
 


</script>

<style lang="less" scoped>
.admin-view-container {
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
</style>