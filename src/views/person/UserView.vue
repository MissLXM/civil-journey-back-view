<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="user-view-container">
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
                                    <el-option label="用户昵称" value="2" />
                                    <el-option label="用户邮箱" value="3" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span style="">角色&nbsp;&nbsp;</span>
                        <el-select v-model="selectRole" placeholder="角色" style="width: 100px">
                            <el-option label="全部" value="0" />
                            <el-option label="用户" value="1" />
                            <el-option label="讲师" value="2" />
                        </el-select>
                        <el-button @click="roleQueryEvent">搜索</el-button>
                    </div>
                    
                </div>
                <div class="header-button-container">
                    <el-button type="info" @click="resetPasswordEvent">重置密码</el-button>
                </div>
            </div> 
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="userData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="userData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column prop="userEmail" label="用户邮箱" align="center" width="180"/>
                    <el-table-column prop="nickname" label="用户昵称" align="center" />
                    <el-table-column prop="username" label="登录名称" align="center" width="140"/>
                    <el-table-column prop="gender" label="性别" align="center" />
                    <el-table-column prop="signature" label="个性签名" align="center" :width="flexColumnWidth('signature', userData.records)" />
                    <el-table-column prop="userRole" label="用户角色" align="center" :width="flexColumnWidth('userRole', userData.records)">
                        <template v-slot="scope">
                            <el-tag v-if="scope.row.userRole == '用户'" type="info">用户</el-tag>
                            <el-tag v-else-if="scope.row.userRole == '讲师'" type="warning">讲师</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="headPortrait" label="用户头像" align="center" width="100">
                        <template v-slot="scope">
                            <el-image :src="scope.row.headPortrait"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
                    <el-table-column fixed="right" label="选项" width="300" align="center">
                        <template v-slot="scope" #default>
                            <el-switch
                                size="small"
                                :active-value="0"
                                active-text="启用"
                                :inactive-value="1"
                                inactive-text="禁用"
                                v-model="scope.row.isDelete"
                                @change="handleSwitch(scope.row)"
                            />
                            <el-button
                                link 
                                type="info" 
                                size="small" 
                                style="margin-left: 1vw;" 
                                @click="loadUserMedal(scope.row.userId)"
                            >
                                拥有勋章
                            </el-button>
                            <el-button 
                                link 
                                size="small" 
                                type="primary" 
                                style="margin-left: 1vw;" 
                                @click="resetPasswordByUserId(scope.row.userId)"
                            >
                                重置密码
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="userData.total"
                            :page-count="userData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="userQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="medalDialog">
            <div class="medal-info-title">已拥有勋章</div>
            <el-empty description="无数据" v-if="userMedal.length === 0"/>
            <div 
                v-else
                class="medal-item-container"
            >
                <el-tooltip 
                    :key="index"
                    effect="light"
                    placement="bottom" 
                    v-for="(item, index) in userMedal"
                >
                    <template #content>
                        <span class="tooltip-text">{{ item.medalName }}-{{ item.medalLevel }}</span>
                    </template>
                    <el-image :src="item.medalIcon"/> 
                </el-tooltip>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { flexColumnWidth } from '@/global';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { queryUser, queryUserByRole, queryUserMedal, resetUserPassword, switchUser } from '@/api/user';


// 查询方式
const queryId = ref()
// 用户信息
const userData = ref({
    total: 0,
    pages: 0,
    records: []
})
// 选择角色
const selectRole = ref()
// 查询的值
const queryValue = ref()
// 用户ID
const userIds = ref<any>([])

// 分页参数 
const userQueryParams = ref({
    pageSize: 7,
    username: null,
    nickname: null,
    userEmail: null, 
    currentPage: 1,
})
// 角色参数
const roleQueryParams = ref({
    pageSize: 7,
    userRole: '',
    currentPage: 1,
})
// 弹出勋章
const medalDialog = ref(false)
// 用户勋章
const userMedal = ref<any>([])


// 挂载函数  
onMounted(() => {
    // 加载用户信息
    queryUser(
        {
            currentPage: 1,
            pageSize: 7
        } 
    ).then(response => {
        if (response.data.code === 200) {
            userData.value = response.data.data
        }
    })
})

// 搜索事件  
function queryEvent() {
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        selectRole.value = "0"
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearUserQueryParams()
                queryUser(userQueryParams.value).then(response => {
                    if (response.data.code === 200) {
                        userData.value = response.data.data
                    } else {
                        userData.value.total = 0
                        userData.value.pages = 0
                        userData.value.records = []
                    }
                })
            }
        } else {
            if (queryId.value == 1) {
                userQueryParams.value.username = queryValue.value
                userQueryParams.value.nickname = null
                userQueryParams.value.userEmail = null
                userQueryParams.value.currentPage = 1
            } else if (queryId.value == 2) {
                userQueryParams.value.username = null
                userQueryParams.value.nickname = queryValue.value
                userQueryParams.value.userEmail = null
                userQueryParams.value.currentPage = 1
            } else if (queryId.value == 3) {
                userQueryParams.value.username = null
                userQueryParams.value.nickname = null
                userQueryParams.value.userEmail = queryValue.value
                userQueryParams.value.currentPage = 1
            } else {
                clearUserQueryParams()
                queryValue.value = null
            }

            // 搜索事件
            queryUser(userQueryParams.value).then(response => {
                if (response.data.code === 200) {
                    userData.value = response.data.data
                } else {
                    userData.value.total = 0
                    userData.value.pages = 0
                    userData.value.records = []
                }
            })
        }
    }
}

// 用户勋章
function loadUserMedal(userId: any) {
    queryUserMedal(userId).then(response => {
        medalDialog.value = true
        if (response.data.code === 200) {
            userMedal.value = response.data.data
        } else {
            userMedal.value = []
        }
    })
}

// 角色查询 
function roleQueryEvent() {
    if (selectRole.value == '' || selectRole.value == null) {
        ElMessage.info('请选择角色')
    } else {
        if (selectRole.value == 1) {
            roleQueryParams.value.userRole = '用户'
        } else if (selectRole.value == 2) {
            roleQueryParams.value.userRole = '讲师'
        } else {
            roleQueryParams.value.userRole = ''
        }

        queryId.value = "0"
        queryValue.value = ""
        queryUserByRole(roleQueryParams.value).then(response => {
            if (response.data.code === 200) {
                userData.value = response.data.data
            } else {
                userData.value.total = 0
                userData.value.pages = 0
                userData.value.records = []
            }
        })
    }
}

// 多选重置密码 
function resetPasswordEvent() {
    if (userIds.value.length == 0) {
        ElMessage.info('请选择需要重置密码的用户')
    } else {
        resetUserPassword(userIds.value).then(response => {
        console.log(response.data)
        if (response.data.code === 200) {
            ElMessage.success('重置密码成功,密码为123456')
        } else {
            ElMessage.error(response.data.message)
        }
    })
    }
} 

// 清空
function clearUserQueryParams() {
    userQueryParams.value.currentPage = 1
    userQueryParams.value.username = null
    userQueryParams.value.nickname = null
    userQueryParams.value.userEmail = null
}
  
// 禁用/启用
function handleSwitch(row: any) {
    // 禁用/启用
    switchUser(row.userId, row.isDelete).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
        } else {
            ElMessage.error(response.data.message)
        }
    })
}

// 分页事件 
function handleCurrentChange(val: any) {
    userQueryParams.value.currentPage = val
    queryUser(userQueryParams.value).then(response => {
        if (response.data.code === 200) {
            userData.value = response.data.data
        }
    })
}

// 单用户重置密码
function resetPasswordByUserId(userId: any) {
    const userIds = [userId]
    resetUserPassword(userIds).then(response => {
        console.log(response.data)
        if (response.data.code === 200) {
            ElMessage.success('重置密码成功,密码为123456')
        } else {
            ElMessage.error(response.data.message)
        }
    })
} 

// 选中事件
function handleSelectionChange(selection: any) {
    userIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        
        userIds.value.push(selection[i].userId)
    }
}

</script>

<style lang="less" scoped>
// 用户视图容器
.user-view-container {
    height: 96%;
    font-style: normal;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;

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