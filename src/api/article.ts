import request from './request'

// 查询所有文章信息
export function queryAllArticle(articleQueryParams: any) {
    return request({
        url: '/article-center-service/backend/article/queryAllArticle',
        method: 'POST',
        data: articleQueryParams
    })
}

// 查询审批文章信息
export function queryApplyArticle(articleQueryParams: any) {
    return request({
        url: '/article-center-service/backend/article/articleAuditShow',
        method: 'POST',
        data: articleQueryParams
    })
}

// 设置/取消精选文章
export function setOrCancelCurationArticle(articleId: any) {
    return request({
        url: `/article-center-service/backend/article/setOrCancelCurationArticle/${articleId}`,
        method: 'GET'
    })
}

// 同意文章发布
export function articleAuditSuccess(articleId: any) {
    return request({
        url: `/article-center-service/backend/article/articleAuditSuccess/${articleId}`,
        method: 'GET'
    })
}

// 不同意文章发布
export function articleAuditFail(articleAuditParams: any) {
    return request({
        url: '/article-center-service/backend/article/articleAuditFail',
        method: 'POST',
        data: articleAuditParams
    })
}