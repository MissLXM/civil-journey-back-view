<template>
    <div class="article-info-view-container">
        <el-card>
            <!-- 文章内容容器 -->
            <div class="article-content-container">    
                <!-- 文章内容顶部 -->
                <div class="article-content-header-container">
                    <div class="article-title">{{ articleInfo.articleTitle }}</div>
                    <div class="article-base-info-container">
                        <el-tag type="warning"  class="tag-mr">{{ articleInfo.articleType }}</el-tag>
                        <el-tag type="warning"  class="tag-mr">{{ articleInfo.categoryName }}</el-tag>
                        <el-tag type="info" class="tag-mr">{{ articleInfo.createTime }}</el-tag>
                    </div>
                </div>

                <!-- 文章内容 -->
                <div class="article-content-body-container">
                    <div
                        class="article-content-body"
                        v-html="articleInfo.articleContent"
                    />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// 路由信息
const route = useRoute()
// 文章信息
const articleInfo = ref<any>({
    articleTitle: '',
    articleType: '',
    categoryName: '',
    createTime: '',
    browseNumber: '',
    articleContent: ''
})



// 挂载函数
onMounted(() => {
    // 加载文章信息
    loadArticleInfo()
})

// 加载文章信息
function loadArticleInfo() {
    // 获取文章信息
    articleInfo.value = route.params.articleInfo
    articleInfo.value = JSON.parse(articleInfo.value)
    console.log(articleInfo.value)
}
</script>

<style lang="less" scoped>
.article-info-view-container {
    height: 96%;

    :deep(.el-card) {
        height: 100%;
        overflow-y: scroll;
    }

    // 文章内容容器
    .article-content-container {
    border-radius: 0.3rem;
    background-color: #fff;

    // 文章内容顶部容器
    .article-content-header-container {
        text-align: center;
        padding-left: 2rem;
        padding-bottom: 0.9rem;
        border-bottom: 1px solid #ddd;
        
        // 文章标题
        .article-title {
            font-size: 32px;
            font-weight: 600;
            color: #252933;
            line-height: 32px;
            padding-top: 2rem;
        }

        // 文章基础信息
        .article-base-info-container {
            display: flex;
            font-size: 14px;
            font-weight: 400;
            color: #8a919f;
            line-height: 22px;
            margin-top: 1.2rem;
            justify-content: center;
            letter-spacing: 0.05rem;
            
            // 标签间距
            .tag-mr {
                margin-right: 1rem;
            }
        }
    }

    // 文章内容容器
    .article-content-body-container {
        
        // 文章内容
        .article-content-body {
            padding: 2rem;
            color: #2b2b2b;
            font-size: 14px;
            font-weight: 400;
            min-height: 40rem;
            padding-top: 1rem;
            text-indent: 1rem;
            line-height: 25px;
            font-style: normal;
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial;
        }

        // 视频综合按钮
        .article-sundry-container {
            width: 98.5%;
            height: 2.3rem;
            margin-top: 0.6rem;
            padding-left: 1rem;
            padding-bottom: 0.6rem;
            border-top: 1px solid #ddd;

            .sundry-number-container {
                display: flex;
                margin-top: 0.8rem;
                align-items: center;
                .svg-icon {
                    width: 22px;
                    height: 22px;
                    margin-right: 0.5rem;

                    &:first-child {
                        margin-left: 1rem;
                    }
                }

                span {
                    font-size: 14px;
                    margin-top: 0.15rem;
                    margin-right: 3rem;
                }
            }
        }
    }
}
}
</style>