import request from './request'

// 获取课程信息
export function queryCourse(courseQueryParams: any) {
    return request({
        url: '/course-center-service/backend/course/queryAllCourse',
        method: 'POST',
        data: courseQueryParams
    })
}

// 同意课程申请
export function agreeReleaseCourse(courseId: any) {
    return request({
        url: `/course-center-service/backend/course/agreeReleaseCourse/${courseId}`,
        method: 'GET'
    })
}

// 不同意课程申请
export function unAgreeReleaseCourse(courseAuditParams: any) {
    return request({
        url: '/course-center-service/backend/course/unAgreeReleaseCourse',
        method: 'POST',
        data: courseAuditParams
    })
}