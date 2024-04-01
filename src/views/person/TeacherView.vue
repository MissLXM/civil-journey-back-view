<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="teacher-view-container">
        <el-card>
            <div class="header-user-container">
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
                                <el-option label="讲师昵称" value="2" />
                                <el-option label="讲师邮箱" value="3" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button :icon="Search" @click="queryEvent"/>
                        </template>
                    </el-input>
                </div>
            </div>
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
                    <el-table-column fixed type="index" label="讲师编号" align="center" width="80"/>
                    <el-table-column prop="userEmail" label="讲师邮箱" align="center" width="180"/>
                    <el-table-column prop="nickname" label="讲师昵称" align="center" />
                    <el-table-column prop="username" label="登录名称" align="center" width="140"/>
                    <el-table-column prop="gender" label="性别" align="center" />
                    <el-table-column prop="teacherIntroduction" label="讲师个性签名" align="center" :width="flexColumnWidth('teacherIntroduction', teacherData.records)" />
                    <el-table-column prop="courseNumber" label="课程数量" align="center" width="100" />
                    <el-table-column prop="headPortrait" label="用户头像" align="center" width="100">
                        <template v-slot="scope">
                            <el-image :src="scope.row.headPortrait"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center" width="150"/>
                    <el-table-column fixed="right" label="选项" width="120" align="center">
                        <template #default="scope">
                            <el-button 
                                link 
                                size="small" 
                                type="danger" 
                                @click="regainRole(scope.row.userId)"
                            >
                                回收角色
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { flexColumnWidth } from '@/global';
import { deleteTeacherRole, queryUserByRole } from '@/api/user';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';


// 查询方式
const queryId = ref()
// 查询内容
const queryValue = ref()
// 讲师信息
const teacherData = ref({
    total: 0,
    pages: 0,
    records: []
})
// 查询参数
const teacherQueryParams = ref<any>({
    pageSize: 7,
    currentPage: 1,
    username: null,
    nickname: null,
    userEmail: null,
    userRole: '讲师',
})

// 挂载函数
onMounted(() => {
    // 加载讲师信息
    loadTeacher()
})


// 搜索事件 
function queryEvent() {
    if (queryId.value == undefined) {
        ElMessage.info('请选择查询方式')
    } else {
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearTeacherQueryParams()
                loadTeacher()
            }
        } else {
            if (queryId.value == 1) {
                teacherQueryParams.value.username = queryValue.value
                teacherQueryParams.value.nickname = null
                teacherQueryParams.value.userEmail = null
            } else if (queryId.value == 2) {
                teacherQueryParams.value.username = null
                teacherQueryParams.value.nickname = queryValue.value
                teacherQueryParams.value.userEmail = null
            } else if (queryId.value == 3) {
                teacherQueryParams.value.username = null
                teacherQueryParams.value.nickname = null
                teacherQueryParams.value.userEmail = queryValue.value
            } else {
                clearTeacherQueryParams()
                queryValue.value = null
            }

            // 搜索事件
            queryUserByRole(teacherQueryParams.value).then(response => {
                console.log(response.data)
                if (response.data.code === 200) {
                    teacherData.value = response.data.data
                } else {
                    teacherData.value = {
                        total: 0,
                        pages: 0,
                        records: []
                    }
                }
            })
        }
    }
}

// 加载讲师信息
function loadTeacher() {
    queryUserByRole(teacherQueryParams.value).then(response => {
        if (response.data.code === 200) {
            teacherData.value = response.data.data
        } else {
            teacherData.value = {
                total: 0,
                pages: 0,
                records: []
            }
        }
    })
}

// 回收角色
function regainRole(userId: any) {
    deleteTeacherRole(userId).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('回收成功')
            loadTeacher()
        } else {
            ElMessage.error('回收失败')
        }
    })
}

// 清空
function clearTeacherQueryParams() {
    teacherQueryParams.value.currentPage = 1
    teacherQueryParams.value.username = null
    teacherQueryParams.value.nickname = null
    teacherQueryParams.value.userEmail = null
}
 
// 分页事件
function handleCurrentChange(val: any) {
    teacherQueryParams.value.currentPage = val
    loadTeacher()
}
</script>

<style lang="less" scoped>
// 讲师视图容器
.teacher-view-container {
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
</style>