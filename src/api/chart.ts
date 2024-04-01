import request from './request'

// 获取验证码 
export function getVerCode() {
    return request({
        url: '/chart-center-service/admin/chart/getVerCode',
        method: 'GET'
    })
}

// 获取分类列表
export function getCategoryInfo() {
    return request({
        url: '/chart-center-service/front/category/getCategoryInfo',
        method: 'GET'
    })
}

// 统计所有文章的数量
export function statisticsArticleAllNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsArticleAllNumber',
        method: 'GET'
    })
}

// 统计所有课程的数量
export function statisticsCourseAllNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsCourseAllNumber',
        method: 'GET'
    })
}

// 统计用户和讲师的数量
export function statisticsUserTeacherNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsUserTeacherNumber',
        method: 'GET'
    })
}

// 统计用户的所有登录次数
export function statisticsUserLoginNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsUserLoginNumber',
        method: 'GET'
    })
}

// 统计每个分类的文章总数量
export function statisticsArticleCategoryNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsArticleCategoryNumber',
        method: 'GET'
    })
}

// 统计每个分类的课程总数量
export function statisticsCourseCategoryNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsCourseCategoryNumber',
        method: 'GET'
    })
}

// 统计文章评论数量
export function statisticsArticleCommentsNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsArticleCommentsNumber',
        method: 'GET'
    })
}

// 统计课程评论数量
export function statisticsCourseCommentsNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsCourseCommentsNumber',
        method: 'GET'
    })
}

// 统计每个分类的文章点赞和收藏数量
export function statisticsArticleCategoryLikeAndCollectionNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsArticleCategoryLikeAndCollectionNumber',
        method: 'GET'
    })
}

// 统计每个分类的课程点赞和收藏数量
export function statisticsCourseCategoryLikeAndCollectionNumber() {
    return request({
        url: '/chart-center-service/admin/chart/statisticsCourseCategoryLikeAndCollectionNumber',
        method: 'GET'
    })
}

// 获取所有分类信息
export function getCategory() {
    return request({
        url: '/chart-center-service/front/category/getCategoryInfo',
        method: 'GET'
    })
}

// 获取所有轮播图
export function getAllBanner(pageParams: any) {
    return request({
        url: '/chart-center-service/backend/banner/getALllBanner',
        method: 'POST',
        data: pageParams
    })
}

// 获取所有分类信息(分页)
export function getAllCategory(pageParams: any) {
    return request({
        url: '/chart-center-service/backend/category/getAllCategory',
        method: 'POST',
        data: pageParams
    })
}

// 添加分类
export function addCategory(category: any) {
    return request({
        url: '/chart-center-service/backend/category/addCategory',
        method: 'POST',
        data: category
    })
}

// 修改分类
export function updateCategory(category: any) {
    return request({
        url: '/chart-center-service/backend/category/updateCategory',
        method: 'POST',
        data: category
    })
}

// 删除分类
export function deleteCategory(categoryIds: any) {
    return request({
        url: '/chart-center-service/backend/category/deleteCategory',
        method: 'DELETE',
        data: categoryIds
    })
} 

// 添加轮播图
export function addBanner(banner: any) {
    return request({
        url: '/chart-center-service/backend/banner/addBanner',
        method: 'POST',
        data: banner
    })
}

// 修改轮播图
export function updateBanner(banner: any) {
    return request({
        url: '/chart-center-service/backend/banner/updateBanner',
        method: 'PUT',
        data: banner
    })
}

// 删除轮播图
export function deleteBanner(bannerIds: any) {
    return request({
        url: '/chart-center-service/backend/banner/deleteBanner',
        method: 'DELETE',
        data: bannerIds
    })
}

// 上移轮播图
export function moveUpBanner(bannerId: any) {
    return request({
        url: `/chart-center-service/backend/banner/moveUpBanner/${bannerId}`,
        method: 'PUT',
    })
}

// 下移轮播图
export function moveDownBanner(bannerId: any) {
    return request({
        url: `/chart-center-service/backend/banner/moveDownBanner/${bannerId}`,
        method: 'PUT',
    })
}