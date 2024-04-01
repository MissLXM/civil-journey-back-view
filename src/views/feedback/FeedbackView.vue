<template>
    <div class="feedback-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="info" @click="multipleDeleteOpinionEvent">删除</el-button>
                </div>
            </div>
            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="opinionData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="opinionData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="反馈编号" align="center"  width="80"/>
                    <el-table-column prop="opinionContent" label="通知类型" align="center" show-overflow-tooltip="false" :width="850" />
                    <el-table-column prop="creator" label="意见提出者" align="center" width="120"/>
                    <el-table-column prop="createTime" label="意见提出时间" align="center" />
                    <el-table-column fixed="right" label="选项" align="center" width="200">
                        <template #default="scope">
                            <el-button
                                link 
                                type="primary" 
                                @click="acceptOpinionEvent(scope.row)"
                            >
                                采纳
                            </el-button>
                            <el-button
                                link 
                                type="danger" 
                                @click="simpleDeleteOpinionEvent(scope.row.opinionId)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="opinionData.total"
                            :page-count="opinionData.pages"
                            @current-change="handleCurrentChange"
                            :current-page="pageParams.currentPage"
                            layout="total, prev, pager, next, jumper"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAllOpinion, deleteOpinion, acceptOpinion } from '@/api/notice';
import zhCn from 'element-plus/es/locale/lang/zh-cn';


// 意见ID
const opinionIds = ref()
// 分页参数
const pageParams = ref({
    pageSize: 17,
    currentPage: 1,
})
// 反馈数据
const opinionData = ref({
    total: 0,
    pages: 0,
    records: [],
})



// 挂载函数
onMounted(() => {
    // 加载通知
    loadOpinion()
})

// 加载通知
function loadOpinion() {
    getAllOpinion(pageParams.value).then(response => {
        if (response.data.code === 200) {
            opinionData.value = response.data.data
        } else {
            opinionData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

// 多删除意见
function multipleDeleteOpinionEvent() {

}

// 分页事件
function handleCurrentChange(val: any) {
    pageParams.value.currentPage = val
    loadOpinion()
}

// 采纳意见
function acceptOpinionEvent(item: any) {
    acceptOpinion(item.opinionId, item.creator).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('采纳成功')
            loadOpinion()
        } else {
            ElMessage.error('采纳失败')
        }
    })
}

// 选中事件
function handleSelectionChange(selection: any) {
    opinionIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        opinionIds.value.push(selection[i].opinionId)
    }
}

// 单删除意见
function simpleDeleteOpinionEvent(opinionId: any) {
    const opinionIds = [ opinionId ]
    deleteOpinion(opinionIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadOpinion()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

</script>

<style lang="less" scoped>
.feedback-view-container {
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

:deep(.cell.el-tooltip) {
    cursor: pointer;
}

:deep(.el-popper.is-dark) {
    max-width: 500px;
}

</style>