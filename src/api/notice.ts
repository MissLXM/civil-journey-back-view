import request from './request'

// 获取所有通知
export function getAllNotice(noticeQueryParams: any) {
    return request({
        url: '/feedback-center-service/backend/notice/getAllNotice',
        method: 'POST',
        data: noticeQueryParams
    })
}

// 获取所有反馈
export function getAllOpinion(pageParams: any) {
    return request({
        url: '/feedback-center-service/backend/opinion/getAllOpinion',
        method: 'POST',
        data: pageParams
    })
}

// 删除反馈
export function deleteOpinion(opinionIds: any) {
    return request({
        url: '/feedback-center-service/backend/opinion/deleteOpinion',
        method: 'DELETE',
        data: opinionIds
    })
}

// 采纳反馈
export function acceptOpinion(opinionId: any, creator: any) {
    return request({
        url: `/feedback-center-service/backend/opinion/acceptOpinion/${opinionId}/${creator}`,
        method: 'GET',
    })
}

// 发布通知
export function releaseNotice(noticeParams: any) {
    return request({
        url: '/feedback-center-service/backend/notice/releaseNotice',
        method: 'POST',
        data: noticeParams
    })
}

// 删除通知
export function deleteNotice(noticeUserIds: any) {
    return request({
        url: '/feedback-center-service/backend/notice/deleteNotice',
        method: 'DELETE',
        data: noticeUserIds
    })
}

