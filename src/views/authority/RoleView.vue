<template>
    <div class="role-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="warning" @click="addRoleDialog = true">新增</el-button>
                    <el-button type="info" @click="multipleDeleteRoleEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="roleData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="roleData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="roleCode" label="角色编码" align="center" />
                    <el-table-column prop="roleName" label="角色名称" align="center" />
                    <el-table-column prop="roleDescribe" label="角色描述" align="center" />
                    <el-table-column prop="creator" label="创建者" align="center" />
                    <el-table-column prop="updater" label="更新者" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column prop="updateTime" label="更新时间" align="center" />
                    <el-table-column fixed="right" label="选项" align="center" width="300">
                        <template #default="scope">
                            <el-button 
                                link 
                                type="info"
                                @click="updateRoleDialogEvent(scope.row)"
                                v-if="scope.row.roleDescribe != '超级管理员'"
                            >
                                修改
                            </el-button>
                            <el-button link 
                                type="danger"
                                @click="simpleDeleteRoleEvent(scope.row.roleId)"
                                v-if="scope.row.roleDescribe != '超级管理员'"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="roleData.total"
                            :page-count="roleData.pages"
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
        <el-dialog v-model="addRoleDialog" @close="dialogClose">
            <div class="dialog-title">添加角色</div>
            <div class="dialog-content">
                <el-form :model="addRoleForm">
                    <el-form-item label="角色编号">
                        <el-input v-model="addRoleForm.roleCode" placeholder="请输入角色编号"/>
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <el-input v-model="addRoleForm.roleName" placeholder="请输入角色名称"/>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="addRoleForm.roleDescribe" placeholder="请输入角色描述"/>
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addRoleEvent">添加</el-button>
                                <el-button @click="addRoleDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateRoleDialog" @close="dialogClose">
            <div class="dialog-title">修改角色</div>
            <div class="dialog-content">
                <el-form :model="updateRoleForm">
                    <el-form-item label="角色编号">
                        <el-input v-model="updateRoleForm.roleCode" placeholder="请输入角色编号"/>
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <el-input v-model="updateRoleForm.roleName" placeholder="请输入角色名称"/>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="updateRoleForm.roleDescribe" placeholder="请输入角色描述"/>
                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="updateRoleEvent">修改</el-button>
                                <el-button @click="updateRoleDialog = false">取消</el-button>
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
import { isNotEmpty } from '@/global';
import { addRole, updateRole, deleteRole, queryAllRole } from '@/api/user';
import { adminStore } from '@/stores/admin';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 角色ID
const roleIds = ref()
// 角色信息
const roleData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 分页参数
const pageParams = ref({
    pageSize: 16,
    currentPage: 1,
})
// 添加角色表单
const addRoleForm = ref({
    creator: null,
    updater: null,
    roleCode: null,
    roleName: null,
    roleDescribe: null,
})
// 管理员信息
const admin = adminStore()
// 修改角色表单
const updateRoleForm = ref({
    roleId: null,
    updater: null,
    roleCode: null,
    roleName: null,
    roleDescribe: null,
})

// 添加角色弹出框
const addRoleDialog = ref(false)
// 修改角色弹出框
const updateRoleDialog = ref(false)

// 挂载函数
onMounted(() => {
    // 加载角色
    loadRole()
})

// 加载菜单
function loadRole() {
    queryAllRole(pageParams.value).then(response => {
        if (response.data.code === 200) {
            roleData.value = response.data.data
        } else {
            roleData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
   
}

// 弹出框关闭事件
function dialogClose() {
    addRoleForm.value = {
        creator: null,
        updater: null,
        roleCode: null,
        roleName: null,
        roleDescribe: null,
    }
    updateRoleForm.value = {
        roleId: null,
        updater: null,
        roleCode: null,
        roleName: null,
        roleDescribe: null,
    }
}

// 添加角色事件
function addRoleEvent() {
    if (isNotEmpty(addRoleForm.value.roleCode) && isNotEmpty(addRoleForm.value.roleName) && isNotEmpty(addRoleForm.value.roleDescribe)) {
        addRoleForm.value.creator = admin.nickname
        addRoleForm.value.updater = admin.nickname

        addRole(addRoleForm.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('操作成功')
                addRoleDialog.value = false
                loadRole()
            } else {
                ElMessage.error('操作失败')
            }
        })
    }
}

// 修改角色事件
function updateRoleEvent() {
    if (isNotEmpty(updateRoleForm.value.roleCode) && isNotEmpty(updateRoleForm.value.roleName) && isNotEmpty(updateRoleForm.value.roleDescribe)) {
        updateRoleForm.value.updater = admin.nickname

        updateRole(updateRoleForm.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('操作成功')
                updateRoleDialog.value = false
                loadRole()
            } else {
                ElMessage.error('操作失败')
            }
        })
    }
}

// 多选删除事件
function multipleDeleteRoleEvent() {
    if (isNotEmpty(roleIds.value)) {
        deleteRole(roleIds.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('操作成功')
                loadRole()
            } else {
                ElMessage.error('操作失败')
            }
        })
    } else {
        ElMessage.info('请选择要删除的角色')
    }
}

// 分页事件
function handleCurrentChange(val: any) {
    pageParams.value.currentPage = val
    loadRole()
}

// 单删除事件
function simpleDeleteRoleEvent(id: any) {
    const roleIds = [ id ]
    deleteRole(roleIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadRole()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 修改角色弹出框
function updateRoleDialogEvent(item: any) {
    updateRoleForm.value.roleId = item.roleId
    updateRoleForm.value.updater = admin.nickname
    updateRoleForm.value.roleCode = item.roleCode
    updateRoleForm.value.roleName = item.roleName
    updateRoleForm.value.roleDescribe = item.roleDescribe

    updateRoleDialog.value = true
}

// 选中事件
function handleSelectionChange(selection: any) {
    roleIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        roleIds.value.push(selection[i].roleId)
    }
}
</script>

<style lang="less" scoped>
.role-view-container {
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