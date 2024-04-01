import request from './request'


// 获取所有资讯
export function getAllTechnical(technicalQueryParams: any) {
    return request({
        url: '/message-center-service/backend/message/getAllMessage',
        method: 'POST',
        data: technicalQueryParams
    })
}

// 获取所有考试时间
export function getAllExamTime(pageParams: any) {
    return request({
        url: '/message-center-service/backend/message/getExamTime',
        method: 'POST',
        data: pageParams
    })
}

// 添加考试信息
export function addExam(examParams: any) {
    return request({
        url: '/message-center-service/backend/message/addExam',
        method: 'POST',
        data: examParams
    })
}

// 修改考试信息
export function updateExam(examParams: any) {
    return request({
        url: '/message-center-service/backend/message/updateExam',
        method: 'PUT',
        data: examParams
    })
}

// 删除考试信息
export function deleteExam(examIds: any) {
    return request({
        url: '/message-center-service/backend/message/deleteExam',
        method: 'DELETE',
        data: examIds
    })
}

// 发布资讯
export function addMessage(technicalParams: any) {
    return request({
        url: '/message-center-service/backend/message/addMessage',
        method: 'POST',
        data: technicalParams
    })
}

// 修改资讯
export function updateMessage(technicalParams: any) {
    return request({
        url: '/message-center-service/backend/message/updateMessage',
        method: 'PUT',
        data: technicalParams
    })
}

// 删除资讯
export function deleteMessage(technicalIds: any) {
    return request({
        url: '/message-center-service/backend/message/deleteMessage',
        method: 'DELETE',
        data: technicalIds
    })
}