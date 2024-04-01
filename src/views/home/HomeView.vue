<template>
    <div class="home-view-container">
        <div class="header-home-container">
            <div class="header-left-container">
                <el-card>
                    <div id="like-collection-chart" style="width: 65vw; height: 45vh;" />
                </el-card>
            </div>
           
            <div class="header-right-container">
                <el-card>
                    <div class="right-card-item">
                        <div class="right-card-icon" style="background-color: #f8bb74;">
                            <el-icon :size="40" color="#fff"><User /></el-icon>
                        </div>
                        <div class="right-card-text">
                            <div class="title-text">用户活跃量</div>
                            <div>
                                <span class="number-text" style="color: #f8bb74;">{{ userActiveNumber }}</span>
                                <span class="content-text">数据</span>
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card>
                    <div class="right-card-item">
                        <div class="right-card-icon" style="background-color: #86d2ee">
                            <el-icon :size="40" color="#fff"><Document /></el-icon>
                        </div>
                        <div class="right-card-text">
                            <div class="title-text">文章总数量</div>
                            <div>
                                <span class="number-text" style="color: #86d2ee;">{{ articleNumber }}</span>
                                <span class="content-text">数据</span>
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card>
                    <div class="right-card-item">
                        <div class="right-card-icon" style="background-color: #94e0e1">
                            <el-icon :size="40" color="#fff"><ChatLineRound /></el-icon>
                        </div>
                        <div class="right-card-text">
                            <div class="title-text">课程总数量</div>
                            <div>
                                <span class="number-text" style="color: #94e0e1;">{{ courseNumber }}</span>
                                <span class="content-text">数据</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
        <div class="footer-home-container">
            <el-card>
                <div id="user-teacher-chart" style="width: 19vw; height: 35vh;"/>
            </el-card>
            <el-card>
                <div id="article-category-chart" style="width: 20vw; height: 35vh;"/>
            </el-card>
            <el-card>
                <div id="course-category-chart" style="width: 20vw; height: 35vh;"/>
            </el-card>
            <el-card>
                <div id="article-course-comments-chart" style="width: 19vw; height: 35vh;"/>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import echarts from '@/stores/echarts';
import {
    getCategoryInfo,
    statisticsCourseAllNumber,
    statisticsUserLoginNumber,
    statisticsArticleAllNumber,
    statisticsUserTeacherNumber, 
    statisticsCourseCategoryNumber,
    statisticsCourseCommentsNumber,
    statisticsArticleCommentsNumber,
    statisticsArticleCategoryNumber,
    statisticsCourseCategoryLikeAndCollectionNumber,
    statisticsArticleCategoryLikeAndCollectionNumber,
} from '@/api/chart'


// 课程数量
const courseNumber = ref()
// 文章数量
const articleNumber = ref()
// 用户活跃
const userActiveNumber = ref()
// 分类名称
const categoryName = ref<any>([])


// 挂载函数
onMounted(() => {
    // 加载分类
    loadCategory()
    // 加载其他数量
    loadOtherNumber()
}) 

// 加载分类 
function loadCategory() {
    getCategoryInfo().then(response => {
        if (response.data.code === 200) {
            for (var i = 1; i < response.data.data.length; i++) {
                categoryName.value.push(response.data.data[i].categoryName)
            }
            // 加载用户和讲师占比
            loadUserTeacher()
            // 加载点赞和收藏占比
            loadLikeCollection()
            // 加载课程分类占比
            loadCourseCategory()
            // 加载文章分类占比
            loadArticleCategory()
            // 加载文章/课程评论占比
            loadArticleCourseComments()
        }
    })
}

// 加载其他数量
function loadOtherNumber() {
    statisticsUserLoginNumber().then(response => {
        if (response.data.code === 200) {
            userActiveNumber.value = response.data.data
        }
    })

    statisticsArticleAllNumber().then(response => {
        if (response.data.code === 200) {
            articleNumber.value = response.data.data
        }
    })

    statisticsCourseAllNumber().then(response => {
        if (response.data.code === 200) {
            courseNumber.value = response.data.data
        }
    })
}

// 加载用户和讲师占比  
function loadUserTeacher() {
    statisticsUserTeacherNumber().then(response => {
        if (response.data.code === 200) {
            const userTeacherChart = echarts.init(document.getElementById('user-teacher-chart'));
            userTeacherChart.setOption({
                // 标题
                title: { 
                    text: "角色占比"
                },
                tooltip: {},
                legend: { data: ["用户","讲师"] },
                xAxis: { data: ["用户","讲师"] },
                yAxis: {},
                // 数据
                series: [
                    {
                        type: "bar",
                        barWidth: 35,
                        data: [
                            response.data.data.userNumber, 
                            response.data.data.teacherNumber
                        ],
                    },
                ]
            })
        }
    })
}

// 加载点赞和收藏占比 
function loadLikeCollection() {

    statisticsArticleCategoryLikeAndCollectionNumber().then(response => {
        if (response.data.code === 200) {
            statisticsCourseCategoryLikeAndCollectionNumber().then(res => {
                if (res.data.code === 200) {
                    const likeCollectionChart = echarts.init(document.getElementById('like-collection-chart'));
                    likeCollectionChart.setOption({
                        // 标题
                        title: { text: "文章/课程--点赞和收藏" },
                        tooltip: {},
                        legend: { data: ["文章-点赞", "文章-收藏", "课程-点赞", "课程-收藏"] },
                        xAxis: { data: categoryName.value },
                        yAxis: {},
                        // 数据
                        series: [
                            {
                                name: "文章-点赞",
                                type: "bar",
                                data: response.data.data.likeNumber,
                            },
                            {
                                name: "文章-收藏",
                                type: "bar",
                                data: response.data.data.collectionNumber,
                            },
                            {
                                name: "课程--点赞",
                                type: "bar",
                                data: res.data.data.likeNumber,
                            },
                            {
                                name: "课程--收藏",
                                type: "bar",
                                data: res.data.data.collectionNumber,
                            },
                        ],
                    })
                }   
            })
        }
    })
    
}

// 加载课程分类占比
function loadCourseCategory() {
    statisticsCourseCategoryNumber().then(response => {
        if (response.data.code === 200) {
            const courseCategoryChart = echarts.init(document.getElementById('course-category-chart'));
            courseCategoryChart.setOption({
                title: { text: "课程数量" },
                tooltip: {},
                legend: {},
                // 数据
                series: [
                    {
                        type: "pie",
                        data: response.data.data,
                        center: ['45%', '48%'],
                        radius: ['35%', '55%'],
                    }
                ],
            })
        }
    })
    
}

// 加载文章分类占比 
function loadArticleCategory() {
    statisticsArticleCategoryNumber().then(response => {
        if (response.data.code === 200) {
            const articleCategoryChart = echarts.init(document.getElementById('article-category-chart'));
            articleCategoryChart.setOption({
                title: { text: "文章数量" },
                tooltip: {},
                legend: {},
                // 数据
                series: [
                    {
                        type: "pie",
                        data: response.data.data,
                        center: ['45%', '48%'],
                        radius: ['35%', '55%'],
                    }
                ],
            })
        }
    })
    
}

// 加载文章/课程评论占比  
function loadArticleCourseComments() {
    statisticsArticleCommentsNumber().then(response => {
        if (response.data.code === 200) {
            statisticsCourseCommentsNumber().then(res => {
                const articleCourseCommentsChart = echarts.init(document.getElementById('article-course-comments-chart'));
                articleCourseCommentsChart.setOption({
                    // 标题
                    title: { 
                        text: "评论占比"
                    },
                    tooltip: {},
                    legend: { data: ["文章评论","课程评论"] },
                    xAxis: { data: ["文章评论","课程评论"] },
                    yAxis: {},
                    // 数据
                    series: [
                        {
                            type: "bar",
                            barWidth: 35,
                            data: [
                                response.data.data, 
                                res.data.data
                            ],
                        },
                    ]
                })
            })
        }
    })
    
}

</script>

<style lang="less" scoped>
// 首页视图容器
.home-view-container {
    height: 96%;

    // 首页顶部布局
    .header-home-container {
        display: flex;
        justify-content: space-between;

        // 顶部左边容器
        .header-left-container {

            :deep(.el-card) {
                width: 65vw;
                height: 45vh;
            }
        }

        // 顶部右边容器
        .header-right-container {

            :deep(.el-card) {
                width: 20vw;
                height: 14vh;
                margin-bottom: 1.28vh;
            }

            // 卡片元素
            .right-card-item {
                height: 10vh;
                display: flex;
                margin-left: 2vw;
                align-items: center;

                // color: #999;
                font-size: 20px;
                font-weight: 400;
                line-height: 17px;
                font-style: normal;
                font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;

                // 图标
                .right-card-icon {
                    width: 4.5vw; 
                    height: 4.5vw; 
                    display: flex; 
                    margin-right: 2vw; 
                    align-items: center;
                    border-radius: 50rem; 
                    justify-content: center; 
                }

                // 文本
                .right-card-text {
                    
                    .title-text {
                        margin-bottom: 2.5vh;
                    }

                    .number-text {
                        font-size: 36px;
                        margin-right: 0.5vw;
                    }

                    .content-text {
                        font-size: 16px;
                    }
                }
            }
        }
    }

    // 首页底部布局
    .footer-home-container {
        display: flex;
        margin-top: 2vh;
        justify-content: space-between;

        :deep(.el-card) {
            width: 20vw;
            height: 35vh;
        }
    }
}
</style>