<template>
    <div class="order-view-container">
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
                                    <el-option label="购买者" value="1" />
                                    <el-option label="订单编号" value="2" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                </div>
            </div>

            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="orderData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="orderData.records" 
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="orderId" label="订单编号" align="center" width="150" />
                    <el-table-column prop="courseName" label="课程名称" align="center" :width="flexColumnWidth('courseName', orderData.records)" />
                    <el-table-column prop="courseImage" label="课程封面" align="center" width="200">
                        <template v-slot="scope">
                            <el-image :src="scope.row.courseImage"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="courseDescription" label="课程简介" align="center" :width="flexColumnWidth('courseDescription', orderData.records)" />
                    <el-table-column prop="consignee" label="购买者" align="center" width="140"/>
                    <el-table-column prop="phone" label="手机号" align="center" :width="flexColumnWidth('phone', orderData.records)" />
                    <el-table-column prop="tradeAmount" label="支付金额" align="center" />
                    <el-table-column prop="useFreeNumber" label="使用的免费次数" align="center" width="150"/>
                    <el-table-column prop="tradeTime" label="发布时间" align="center" :width="flexColumnWidth('tradeTime', orderData.records)" />
                    <el-table-column fixed="right" prop="status" label="状态" align="center" width="100">
                        <template v-slot="scope">
                            <el-tag v-if="scope.row.status === 0" type="danger">未支付</el-tag>
                            <el-tag v-if="scope.row.status === 1" type="success">已支付</el-tag>
                            <el-tag v-if="scope.row.status === 2" type="info">已退款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="选项" align="center" width="120">
                        <template #default="scope">
                            <el-button
                                link 
                                type="danger" 
                                v-if="scope.row.status === 1"
                                @click="refundOrderEvent(scope.row)"
                            >
                                退款
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="orderData.total"
                            :page-count="orderData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="orderQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { flexColumnWidth } from '@/global'
import { refundOrder, queryAllOrder } from '@/api/order';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 查询方式
const queryId = ref()
// 订单信息
const orderData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 查询的值
const queryValue = ref()
// 订单查询参数
const orderQueryParams = ref({
    pageSize: 7,
    orderId: null,
    currentPage: 1,
    consignee: null,
})

// 挂载函数
onMounted(() => {
    // 加载订单
    loadOrder()
})

// 加载订单
function loadOrder() {
    queryAllOrder(orderQueryParams.value).then(response => {
        if (response.data.code === 200) {
            orderData.value = response.data.data
            console.log(orderData.value.records)
        } else {
            orderData.value = {
                total: 0,
                pages: 0,
                records: [],
            }
        }
    })
}

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
                loadOrder()
            }
        } else { 
            if (queryId.value == 1) {
                orderQueryParams.value.currentPage = 1
                orderQueryParams.value.orderId = null
                orderQueryParams.value.consignee = queryValue.value 
            } else if (queryId.value == 2) {
                orderQueryParams.value.currentPage = 1
                orderQueryParams.value.orderId = queryValue.value 
                orderQueryParams.value.consignee = null 
            } else {
                clearQueryParams()
            }

            loadOrder()
        }
        
    }
}

// 清空查询参数
function clearQueryParams() {
    orderQueryParams.value.currentPage = 1
    orderQueryParams.value.orderId = null
    orderQueryParams.value.consignee = null 
    queryValue.value = null
}

// 退款事件
function refundOrderEvent(order: any) {
    refundOrder(order).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('退款成功')
            loadOrder()
        } else {
            ElMessage.error('退款失败')
        }
    })
}

// 分页事件
function handleCurrentChange(val: any) {
    orderQueryParams.value.currentPage = val
    loadOrder()
}
</script>

<style lang="less" scoped>
.order-view-container {
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