<template>
    <div class="menu-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="warning" @click="addMenuDialog = true">新增</el-button>
                    <el-button type="info" @click="multipleDeleteMenuEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="menuData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="menuData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="menuName" label="菜单名称" align="center" />
                    <el-table-column prop="menuParentName" label="父菜单名称" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.menuParentName">
                                {{ scope.row.menuParentName }}
                            </span>
                            <span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="menuIcon" label="菜单图标" align="center">
                        <template #default="scope">
                            <el-icon>
                                <component  
                                    v-if="scope.row.menuIcon" 
                                    :is="scope.row.menuIcon"
                                />
                            </el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column prop="routerPath" label="路由路径" align="center" :width="flexColumnWidth('routerPath', menuData.records) "/>
                    <el-table-column prop="isDelete" label="状态" align="center">
                        <template v-slot="scope">
                            <el-tag
                                type="success"
                                v-if="scope.row.isDelete === 0"
                            >
                                可见
                            </el-tag>
                            <el-tag
                                type="warning"
                                v-if="scope.row.isDelete === 1"
                            >
                                隐藏
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建者" align="center" />
                    <el-table-column prop="updater" label="更新者" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column prop="updateTime" label="更新时间" align="center" />
                    <el-table-column fixed="right" label="选项" align="center" width="300">
                        <template #default="scope">
                            <el-button
                                link 
                                type="primary" 
                                v-if="scope.row.isDelete === 0"
                                @click="hiddenMenuEvent(scope.row.menuId)"
                            >
                                隐藏
                            </el-button>
                            <el-button
                                link 
                                v-else
                                type="success" 
                                @click="showMenuEvent(scope.row.menuId)"
                            >
                                可见
                            </el-button>
                            <el-button link type="info" @click="updateDialogEvent(scope.row)">
                                修改
                            </el-button>
                            <el-button link type="danger" @click="simpleDeleteMenuEvent(scope.row.menuId)">
                                删除
                            </el-button>
                            <el-button link type="success" @click="giveRoleMenuDialog(scope.row.menuId)">
                                赋予角色此权限
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="menuData.total"
                            :page-count="menuData.pages"
                            @current-change="handleCurrentChange"
                            :current-page="pageParams.currentPage"
                            layout="total, prev, pager, next, jumper"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="addMenuDialog" @close="dialogClose">
            <div class="dialog-title">添加菜单</div>
            <div class="dialog-content">
                <el-form :model="addMenuForm">
                    <el-form-item label="菜单名称">
                        <el-input v-model="addMenuForm.menuName" placeholder="请输入菜单名称"/>
                    </el-form-item>
                    <el-form-item label="父菜单名">
                        <el-select v-model="addMenuForm.menuParentId" placeholder="选择父菜单">
                            <el-option 
                                :key="index"
                                :value="item.menuId" 
                                :label="item.menuName" 
                                v-for="(item, index) in oneLevelMenu"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单图标">
                        <el-input v-model="addMenuForm.menuIcon" placeholder="仅支持 element-plus 的图标名称"/>
                    </el-form-item>
                    <el-form-item label="路由路径">
                        <el-input v-model="addMenuForm.routerPath" placeholder="自定义菜单路径"/>
                    </el-form-item>
                    <el-form-item label="状&emsp;&emsp;态">
                        <el-radio-group v-model="addMenuForm.isDelete">
                            <el-radio label="0" size="small">可见</el-radio>
                            <el-radio label="1" size="small">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addMenuEvent">添加</el-button>
                                <el-button @click="addMenuDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateMenuDialog" @close="dialogClose">
            <div class="dialog-title">修改菜单</div>
            <div class="dialog-content">
                <el-form :model="updateMenuForm">
                    <el-form-item label="菜单名称">
                        <el-input v-model="updateMenuForm.menuName" placeholder="请输入菜单名称"/>
                    </el-form-item>
                    <el-form-item label="父菜单名">
                        <el-select 
                            placeholder="选择父菜单"
                            v-model="updateMenuForm.menuParentId" 
                            v-if="updateMenuForm.menuParentId != 0"
                        >
                            <el-option 
                                :key="index"
                                :value="item.menuId" 
                                :label="item.menuName" 
                                v-for="(item, index) in oneLevelMenu"
                            />
                        </el-select>
                        <el-select 
                            v-else
                            placeholder="目前为一级菜单"
                            v-model="updateMenuForm.menuParentId" 
                        >
                            <el-option 
                                :key="index"
                                :value="item.menuId" 
                                :label="item.menuName" 
                                v-for="(item, index) in oneLevelMenu"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单图标">
                        <el-input v-model="updateMenuForm.menuIcon" placeholder="仅支持 element-plus 的图标名称"/>
                    </el-form-item>
                    <el-form-item label="路由路径">
                        <el-input v-model="updateMenuForm.routerPath" placeholder="自定义菜单路径"/>
                    </el-form-item>
                    <el-form-item label="状&emsp;&emsp;态">
                        <el-radio-group v-model="updateMenuForm.isDelete">
                            <el-radio :label="0">可见</el-radio>
                            <el-radio :label="1">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="updateMenuEvent">修改</el-button>
                                <el-button @click="updateMenuDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div>


    <div class="dialog-container">
        <el-dialog v-model="roleMenuDialog">
            <div class="dialog-title">赋予角色菜单权限</div>
            <div class="dialog-content">
                <el-form :model="roleMenuForm">
                    <el-form-item label="角色名称">
                        <el-radio-group v-model="roleMenuForm.roleId">
                            <el-radio :label="1">超级管理员</el-radio>
                            <el-radio :label="2">普通管理员</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="giveRoleMenuEvent">赋予</el-button>
                                <el-button @click="roleMenuDialog = false">取消</el-button>
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
import { adminStore } from '@/stores/admin';
import { flexColumnWidth, isNotEmpty } from '@/global';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { addMenu, updateMenu, hiddenMenu, deleteMenu, queryAllMenu, giveRoleMenu, getLevelMenuInfo } from '@/api/menu';


// 菜单ID
const menuIds = ref()
// 菜单信息
const menuData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 分页参数
const pageParams = ref({
    pageSize: 16,
    currentPage: 1,
})
// 管理员信息
const admin = adminStore()
// 添加菜单表单
const addMenuForm = ref<any>({
    creator: null,
    updater: null,
    menuName: null,
    isDelete: null,
    menuIcon: null,
    routerPath: null,
    menuParentId: null,
})
// 一级菜单
const oneLevelMenu = ref<any>()
// 角色菜单表单
const roleMenuForm = ref<any>({
    roleId: null,
    menuId: null,
    updater: null
})
// 添加菜单对话框
const addMenuDialog = ref(false)
// 修改菜单表单
const updateMenuForm = ref<any>({
    menuId: null,
    updater: null,
    menuName: null,
    menuIcon: null,
    isDelete: null,
    routerPath: null,
    menuParentId: null,
})
// 角色菜单对话框
const roleMenuDialog = ref(false)
// 修改菜单对话框
const updateMenuDialog = ref(false)



// 挂载函数
onMounted(() => {
    // 加载菜单
    loadMenu()
    // 加载一级菜单
    loadOneLevelMenu()
})

// 加载菜单
function loadMenu() {
    queryAllMenu(pageParams.value).then(response => {
        if (response.data.code === 200) {
            menuData.value = response.data.data
        } else {
            menuData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

// 对话框关闭事件
function dialogClose() {
    addMenuForm.value = {
        creator: null,
        updater: null,
        menuName: null,
        menuIcon: null,
        isDelete: null,
        routerPath: null,
        menuParentId: null,
    }

    updateMenuForm.value = {
        updater: null,
        menuName: null,
        menuIcon: null,
        isDelete: null,
        routerPath: null,
        menuParentId: null,
    }

}

// 添加菜单事件
function addMenuEvent() {
    if (
        isNotEmpty(addMenuForm.value.menuName) &&
        isNotEmpty(addMenuForm.value.menuIcon) &&
        isNotEmpty(addMenuForm.value.routerPath) &&
        isNotEmpty(addMenuForm.value.isDelete)
    ) {
        if (!isNotEmpty(addMenuForm.value.menuParentId)) {
            addMenuForm.value.menuParentId = 0
        }
        
        addMenuForm.value.creator = admin.nickname
        addMenuForm.value.updater = admin.nickname

        addMenu(addMenuForm.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('添加成功')
                addMenuDialog.value = false
                loadMenu()
            } else {
                ElMessage.error('添加失败')
            }
        })
    } else {
        ElMessage.info('请填写完整信息')
    }
}

// 修改菜单事件
function updateMenuEvent() {
    if (
        isNotEmpty(updateMenuForm.value.menuName) &&
        isNotEmpty(updateMenuForm.value.menuIcon) &&
        isNotEmpty(updateMenuForm.value.routerPath) &&
        isNotEmpty(updateMenuForm.value.isDelete)
    ) {
        if (!isNotEmpty(updateMenuForm.value.menuParentId)) {
            updateMenuForm.value.menuParentId =0
        }

        addMenuForm.value.updater = admin.nickname

        updateMenu(updateMenuForm.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('修改成功')
                updateMenuDialog.value = false
                loadMenu()
            } else {
                ElMessage.error('修改失败')
            }
        })
    } else {
        ElMessage.info('请填写完整信息')
    }
}

// 加载一级菜单
function loadOneLevelMenu() {
    getLevelMenuInfo().then(response => {
        if (response.data.code === 200) {
            oneLevelMenu.value = response.data.data
            oneLevelMenu.value = oneLevelMenu.value.filter((item: any) => {
                return item.menuName != '首页'
            })
        } else {
            oneLevelMenu.value = []
        }
    })
}

// 赋予角色菜单事件
function giveRoleMenuEvent() {
    if (isNotEmpty(roleMenuForm.value.roleId)) {
        
        roleMenuForm.value.updater = admin.nickname

        giveRoleMenu(roleMenuForm.value).then(response => {
            if (response.data.code === 200) {
                roleMenuDialog.value = false
                ElMessage.success('赋予成功')
            } else {
                ElMessage.error('赋予失败')
            }
        })
        
    } else {
        ElMessage.info('请选择角色')
    }
}

// 多删除菜单事件
function multipleDeleteMenuEvent() {
    deleteMenu(menuIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadMenu()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 显示菜单事件
function showMenuEvent(menuId: any) {
    hiddenMenu(menuId, 0).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改成功')
            loadMenu()
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 赋予角色菜单对话框
function giveRoleMenuDialog(id: any) {
    roleMenuForm.value.menuId = id
    roleMenuDialog.value = true
}

// 隐藏菜单事件
function hiddenMenuEvent(menuId: any) {
    hiddenMenu(menuId, 1).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改成功')
            loadMenu()
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 修改弹出框
function updateDialogEvent(item: any) {
    // 赋值
    updateMenuForm.value.menuId = item.menuId
    updateMenuForm.value.menuName = item.menuName
    updateMenuForm.value.menuIcon = item.menuIcon
    updateMenuForm.value.isDelete = item.isDelete
    updateMenuForm.value.routerPath = item.routerPath
    if (item.menuParentId != 0) {
        updateMenuForm.value.menuParentId = item.menuParentId
    }
    updateMenuDialog.value = true
}

// 分页事件
function handleCurrentChange(val: any) {
    pageParams.value.currentPage = val
    loadMenu()
}

// 单删除菜单事件
function simpleDeleteMenuEvent(menuId: any) {
    const menuIds = [ menuId ]
    deleteMenu(menuIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除成功')
            loadMenu()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 选中事件
function handleSelectionChange(selection: any) {
    menuIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        menuIds.value.push(selection[i].menuId)
    }
}

</script>

<style lang="less" scoped>
.menu-view-container {
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