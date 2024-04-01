<template>
    <div class="carousel-view-container">
        <el-card>
            <div class="header-user-container">
                <div class="header-button-container">
                    <el-button type="warning" @click="addBannerDialog = true">新增</el-button>
                    <el-button type="info" @click="multipleDeleteBannerEvent">删除</el-button>
                </div>
            </div>

            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="carouselData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    :data="carouselData.records" 
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                 >
                    <el-table-column fixed type="selection" align="center" width="55" />
                    <el-table-column fixed type="index" label="编号" align="center" width="80" />
                    <el-table-column prop="bannerSort" label="优先级" align="center" />
                    <el-table-column prop="bannerUrl" label="轮播图图片" align="center" width="300">
                        <template v-slot="scope">
                            <el-image :src="scope.row.bannerUrl"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isDelete" label="状态" align="center">
                        <template v-slot="scope">
                            <el-tag
                                type="success"
                                v-if="scope.row.isDelete === '0'"
                            >
                                可见
                            </el-tag>
                            <el-tag
                                type="warning"
                                v-if="scope.row.isDelete === '1'"
                            >
                                隐藏
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="选项" align="center" width="250">
                        <template #default="scope">
                            <el-button link style="color: #409eff;" @click="moveUpBannerEvent(scope.row.bannerId)">
                                上移
                            </el-button>
                            <el-button link style="color: #409eff;" @click="moveDownBannerEvent(scope.row.bannerId)">
                                下移
                            </el-button>
                            <el-button link type="info" @click="updateBannerDialogEvent(scope.row)">
                                修改
                            </el-button>
                            <el-button
                                link 
                                type="warning" 
                                v-if="scope.row.isDelete === '0'"
                                @click="hiddenOrShowBanner(scope.row.bannerId, 1)"
                            >
                                隐藏
                            </el-button>
                            <el-button
                                link 
                                v-else
                                type="success" 
                                @click="hiddenOrShowBanner(scope.row.bannerId, 0)"
                            >
                                可见
                            </el-button>
                            <el-button link type="danger" @click="simpleDeleteBannerEvent(scope.row.bannerId)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="carouselData.total"
                            :page-count="carouselData.pages"
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
        <el-dialog v-model="addBannerDialog" @close="dialogClose">
            <div class="dialog-title">添加轮播图</div>
            <div class="dialog-content">
                <el-form :model="addBannerForm">
                    <el-form-item label="优先级">
                        <el-input 
                            type="text"
                            placeholder="请输入轮播图优先级(数值越小优先级越大)"
                            v-model="addBannerForm.bannerSort" 
                            oninput="value=value.replace(/[^\d]/g,'')"
                        />
                    </el-form-item>
                    <el-form-item label="轮播图">
                        <el-upload 
                            class="cover-upload"
                            :show-file-list="false"
                            :action="actionBannerUrl"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="bannerUrl.newPath"
                                :src="bannerUrl.newPath" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加轮播图</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="可见性">
                        <el-radio-group v-model="addBannerForm.isDelete">
                            <el-radio :label="0">可见</el-radio>
                            <el-radio :label="1">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="addBannerEvent">添加</el-button>
                                <el-button @click="addBannerDialog = false">取消</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div> 

    <div class="dialog-container">
        <el-dialog v-model="updateBannerDialog" @close="dialogClose">
            <div class="dialog-title">修改轮播图</div>
            <div class="dialog-content">
                <el-form :model="updateBannerForm">
                    <el-form-item label="轮播图">
                        <el-upload 
                            :data="admin"
                            class="cover-upload"
                            :show-file-list="false"
                            :action="actionBannerUrl"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="updateBannerForm.newBannerUrl"
                                :src="updateBannerForm.newBannerUrl" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加轮播图</div>
                            </div>
                        </el-upload>
                    </el-form-item>

                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-button type="primary" @click="updateBannerEvent">修改</el-button>
                                <el-button @click="updateBannerDialog = false">取消</el-button>
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
import { isNotEmpty } from '@/global';
import { adminStore } from '@/stores/admin';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { getAllBanner, addBanner, updateBanner, deleteBanner, moveUpBanner, moveDownBanner } from '@/api/chart';


// 轮播图id
const bannerIds = ref()
// 轮播图图片地址
const bannerUrl = ref({
    newPath: null,
    oldPath: null,
})
// 分页参数
const pageParams = ref({
    pageSize: 5, 
    currentPage: 1,
})
// 轮播图信息
const carouselData= ref({
    pages: 0,
    total: 0,
    records: [],
})
// 管理员信息
const admin = adminStore()
// 添加轮播图表单
const addBannerForm = ref({
    isDelete: null,
    bannerUrl: null,
    bannerSort: null,
})
// 修改轮播图表单
const updateBannerForm = ref({
    bannerId: null,
    bannerUrl: null,
    newBannerUrl: null,
})
// 添加轮播图对话框
const addBannerDialog = ref(false)
// 修改轮播图对话框
const updateBannerDialog = ref(false)
// 轮播图上传地址
const actionBannerUrl = 'http://localhost:8000/chart-center-service/backend/banner/submitBanner'

// 挂载函数
onMounted(() => {
    // 加载轮播图
    loadCarousel()
})

// 弹出框关闭事件
function dialogClose() {
    addBannerForm.value = {
        isDelete: null,
        bannerUrl: null,
        bannerSort: null,
    }

    updateBannerForm.value = {
        bannerId: null,
        bannerUrl: null,
        newBannerUrl: null,
    }

    bannerUrl.value = {
        newPath: null,
        oldPath: null,
    }

}

// 加载轮播图
function loadCarousel() {
    getAllBanner(pageParams.value).then(response => {
        if (response.data.code === 200) {
            carouselData.value = response.data.data
            console.log(carouselData.value)
        } else {
            carouselData.value = {
                pages: 0,
                total: 0,
                records: [],
            }
        }
    })
}

// 添加轮播图事件
function addBannerEvent() {
    if (!isNotEmpty(addBannerForm.value.bannerUrl) ||
    !isNotEmpty(addBannerForm.value.bannerSort) ||
    !isNotEmpty(addBannerForm.value.isDelete)) {
        ElMessage.info('请填写完整信息')
        return 
    }
    
    addBanner(addBannerForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('添加轮播图成功')
            addBannerDialog.value = false
            loadCarousel()
        } else {
            ElMessage.error('添加轮播图失败')
        }
    })
}

// 修改轮播图事件
function updateBannerEvent() {
    if (!isNotEmpty(updateBannerForm.value.bannerId) ||
    !isNotEmpty(updateBannerForm.value.bannerUrl)) {
        ElMessage.info('请填写完整信息')
        return 
    }

    updateBanner(updateBannerForm.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改轮播图成功')
            updateBannerDialog.value = false
            loadCarousel()
        } else {
            ElMessage.error('修改轮播图失败')
        }
    })
}

// 多选删除轮播图事件
function multipleDeleteBannerEvent() {
    if (bannerIds.value.length === 0) {
        ElMessage.info('请选择要删除的轮播图')
        return 
    }

    deleteBanner(bannerIds.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除轮播图成功')
            loadCarousel()
        } else {
            ElMessage.error('删除轮播图失败')
        }
    })
}

// 上传图片前的回调 
function beforeImageUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 5) {
        ElMessage.info('图片大小不能超过5MB')
        return false;
    }

    // 判断文件类型
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持jpg、jpeg、png')
        return false;
    }

    return true;
}

// 分页事件
function handleCurrentChange(val: any) {
    pageParams.value.currentPage = val
    loadCarousel()
}

// 上移轮播图优先级 
function moveUpBannerEvent(bannerId: any) {
    moveUpBanner(bannerId).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadCarousel()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 上传图片成功后的回调
function handlerImageSuccess(result: any) {
    // 图片回显
    bannerUrl.value = result.data
    addBannerForm.value.bannerUrl = result.data.oldPath
    updateBannerForm.value.bannerUrl = result.data.oldPath
    updateBannerForm.value.newBannerUrl = result.data.newPath
}

// 下移轮播图优先级
function moveDownBannerEvent(bannerId: any) {
    moveDownBanner(bannerId).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadCarousel()
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 修改轮播图对话框事件
function updateBannerDialogEvent(item: any) {
    updateBannerForm.value = {
        newBannerUrl: null,
        bannerId: item.bannerId,
        bannerUrl: item.bannerUrl,
    }

    updateBannerDialog.value = true
}

// 选中事件
function handleSelectionChange(selection: any) {
    bannerIds.value = []
    // 封装成只有ID
    for (var i = 0; i < selection.length; i++) {
        bannerIds.value.push(selection[i].bannerId)
    }
}

// 单删除轮播图事件
function simpleDeleteBannerEvent(bannerId: any) {
    const bannerIds = [ bannerId ]

    deleteBanner(bannerIds).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('删除轮播图成功')
            loadCarousel()
        } else {
            ElMessage.error('删除轮播图失败')
        }
    })
}

// 隐藏/显示轮播图
function hiddenOrShowBanner(bannerId: any, isDelete: any) {
    const updateParams = {
        bannerId: bannerId,
        isDelete: isDelete,
    }

    updateBanner(updateParams).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            loadCarousel()
        } else {
            ElMessage.error('操作失败')
        }
    })
}
</script>

<style lang="less" scoped>
.carousel-view-container {
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

        // 上传
        :deep(.el-upload) {
            display: unset;
        }

        // 上传容器
        .cover-upload {
            width: 345px;
            height: 120px;
            cursor: pointer;
            border-radius: 6px;
            margin-left: -0.3rem;
            border: 1px dashed var(--el-border-color);

            .cover-image {
                width: 345px;
                height: 120px;
                display: block;
            }

            .cover-icon {
                width: 345px;
                height: 95px;
                font-size: 28px;
                color: #8c939d;
                text-align: center;
                margin-bottom: 0.5rem;
            }

            .cover-text {
                height: 5.5vh;
                font-size: 10px;
                color: #8c939d;
                margin-top: -3vh;
                text-align: center;
            }
        }

        .cover-upload:hover {
            border-color: var(--el-color-primary);
        }

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