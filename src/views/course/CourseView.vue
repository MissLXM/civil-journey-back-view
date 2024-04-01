<template>
    <div class="course-view-container">
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
                                    <el-option label="文章标题" value="2" />
                                </el-select>
                            </template>
                            <template #append>
                                <el-button :icon="Search" @click="queryEvent"/>
                            </template>
                        </el-input>
                    </div>
                    
                    <div class="select-container">
                        <span style="">分类&nbsp;&nbsp;</span>
                        <el-select 
                            placeholder="分类" 
                            style="width: 120px"
                            v-model="selectCategory" 
                        >
                            <el-option
                                :key="index"
                                :value="item.categoryId" 
                                :label="item.categoryName" 
                                v-for="(item, index) in category"
                             />
                        </el-select>
                        <el-button @click="categoryQuery">搜索</el-button>
                    </div>
                </div>
            </div>

            <div class="footer-user-container">
                <el-empty 
                    description="无数据"
                    v-if="courseData.records.length === 0"
                />
                <el-table
                    fit 
                    v-else
                    height="750"
                    :data="courseData.records" 
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                >
                    <el-table-column fixed type="expand">
                        <template #default="props">
                            <el-table :data="props.row.videoList">
                                <el-table-column label="视频编号" prop="videoSort" align="center" width="80" />
                                <el-table-column label="视频名称" prop="videoName" align="center" :width="flexColumnWidth('videoName', props.row.videoList)"/>
                                <el-table-column label="视频简介" prop="videoDescription" align="center" show-overflow-tooltip width="450"/>
                                <el-table-column label="点赞量" prop="likeNumber" align="center" />
                                <el-table-column label="浏览量" prop="browseNumber" align="center" />
                                <el-table-column label="视频图片" prop="videoImage" align="center" width="150">
                                    <template #default="props">
                                        <el-tooltip 
                                            effect="light"
                                            placement="bottom" 
                                        >
                                            <template #content>
                                                <span>点击查看图片详情</span>
                                            </template>
                                            <el-image
                                                :src="props.row.videoImage"
                                                @click="showImage(props.row.videoImage)"
                                            />
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column label="视频预览" prop="videoPreview" align="center" width="120">
                                    <template #default="props">
                                        <el-tooltip 
                                            effect="light"
                                            placement="bottom" 
                                        >
                                            <template #content>
                                                <span>点击预览视频</span>
                                            </template>
                                            <video
                                                width="120"
                                                height="120"
                                                :src="props.row.videoPreview"
                                                @click="showVideo(props.row.videoPreview)"
                                            />
                                            </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column label="视频信息" prop="videoLink" align="center" width="120">
                                    <template #default="props">
                                        <el-tooltip 
                                            effect="light"
                                            placement="bottom" 
                                        >
                                            <template #content>
                                                <span>点击预览视频</span>
                                            </template>
                                            <video
                                                width="120"
                                                height="120"
                                                :src="props.row.videoLink"
                                                @click="showVideo(props.row.videoLink)"
                                            />
                                            </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column fixed type="index" label="课程编号" align="center" width="80" />
                    <el-table-column prop="courseName" label="课程名称" align="center" :width="flexColumnWidth('courseName', courseData.records)"/>
                    <el-table-column prop="categoryName" label="课程分类" align="center" />
                    <el-table-column prop="courseDescription" label="课程描述" align="center" show-overflow-tooltip :width="350"/>
                    <el-table-column prop="courseImage" label="课程封面" align="center" width="120">
                        <template #default="scope">
                            <el-tooltip 
                                effect="light"
                                placement="bottom" 
                            >
                                <template #content>
                                    <span>点击查看图片详情</span>
                                </template>
                                <el-image
                                    :src="scope.row.courseImage"
                                    @click="showImage(scope.row.courseImage)"
                                />
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="likeNumber" label="点赞量" align="center" />
                    <el-table-column prop="browseNumber" label="浏览量" align="center" />
                    <el-table-column prop="collectionNumber" label="收藏量" align="center" />
                    <el-table-column prop="creatorName" label="发布者" align="center" />
                    <el-table-column prop="creatorAvatar" label="发布者头像" align="center" width="120">
                        <template #default="scope">
                            <el-image
                                :src="scope.row.creatorAvatar"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="payMoney" label="付款金额" align="center" />
                </el-table>
                <div class="page-helper-container">
                    <el-config-provider :locale="zhCn">
                        <el-pagination
                            :total="courseData.total"
                            :page-count="courseData.pages"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page="courseQueryParams.currentPage"
                        />
                    </el-config-provider>
                </div>
            </div>
        </el-card>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="imageDialog">
            <el-image :src="imageUrl"/> 
        </el-dialog>
    </div>

    <div class="dialog-container">
        <el-dialog v-model="videoDialog">
            <video controls width="100%" :src="videoUrl"/> 
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCategory } from '@/api/chart';
import { queryCourse } from '@/api/course';
import { flexColumnWidth } from '@/global';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 查询方式
const queryId = ref()
// 分类信息
const category = ref()
// 选中图片
const imageUrl = ref()
// 选中视频
const videoUrl = ref()
// 查询的值
const queryValue = ref()
// 课程信息
const courseData = ref({
    total: 0,
    pages: 0,
    records: [],
})
// 选中分类
const selectCategory = ref()
// 图片弹出框
const imageDialog = ref(false)
// 视频弹出框
const videoDialog = ref(false)
// 课程查询参数
const courseQueryParams = ref({
    pageSize: 6,
    currentPage: 1,
    categoryId: null,
    courseName: null,
    creatorName: null
})




// 挂载函数
onMounted(() => {
    // 加载分类
    loadCategory()
    // 加载课程
    loadCourse()
})

// 加载课程
function loadCourse() {
    queryCourse(courseQueryParams.value).then(response => {
        if (response.data.code === 200) {
            courseData.value = response.data.data
            console.log(courseData.value)
        } else {
            courseData.value = {
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
        selectCategory.value = 0
        if (queryValue.value == undefined || queryValue.value == '') {
            if (queryId.value != 0) {
                ElMessage.info('请输入查询的值')
            } else {
                clearQueryEvent()
                loadCourse()
            }
        } else {
            if (queryId.value == 1) {
                courseQueryParams.value.courseName = null
                courseQueryParams.value.categoryId = null
                courseQueryParams.value.creatorName = queryValue.value
                courseQueryParams.value.currentPage = 1
            } else if (queryId.value == 2) {
                courseQueryParams.value.categoryId = null
                courseQueryParams.value.creatorName = null
                courseQueryParams.value.courseName = queryValue.value
                courseQueryParams.value.currentPage = 1
            } else {
                clearQueryEvent()
                queryValue.value = null
            }

            loadCourse()
        }
    }
}

// 加载分类
function loadCategory() {
    getCategory().then(response => {
        if (response.data.code === 200) {
            category.value = response.data.data
        } 
    })
}

// 分类查询
function categoryQuery() {
    if (selectCategory.value == undefined) {
        ElMessage.info('请选择分类')
    } else {
        queryId.value = "0"
        queryValue.value = null
        clearQueryEvent()

        if (selectCategory.value != "0") {
            courseQueryParams.value.categoryId = selectCategory.value
        }
        
        loadCourse()
    }
}

// 清空查询参数
function clearQueryEvent() {
    courseQueryParams.value.courseName = null
    courseQueryParams.value.categoryId = null
    courseQueryParams.value.creatorName = null
    courseQueryParams.value.currentPage = 1
}

// 查看视频
function showVideo(video: any) {
    videoUrl.value = video
    videoDialog.value = true
} 

// 查看图片
function showImage(image: any) {
    imageUrl.value = image
    imageDialog.value = true
}

// 分页事件 
function handleCurrentChange(val: any) {
    courseQueryParams.value.currentPage = val
    loadCourse()
}
</script>

<style lang="less" scoped>
.course-view-container {
    height: 97%;

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
                font-size: 14px;
                font-weight: 700;
                color: #606266;
                line-height: 32px;
                margin:  0 0 0 2vw;

                .el-button {
                    margin-left: 0.5vw;
                }
            }
        }
    }

    // 底部容器
    .footer-user-container {
        height: 76.5vh;
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

}


:deep(.cell.el-tooltip) {
    cursor: pointer;
}

:deep(.el-popper.is-dark) {
    max-width: 500px;
}
</style>