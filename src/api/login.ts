import request from './request'

// 登录
export function adminLogin(loginParams: any) {
    return request({
        url: '/auth-center-service/auth/admin/login',
        method: 'POST',
        data: loginParams
    })
}

// 登出
export function adminLogout() {
    return request({
        url: '/auth-center-service/auth/admin/logout',
        method: 'GET'
    })
}