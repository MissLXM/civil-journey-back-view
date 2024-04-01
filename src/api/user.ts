import request from './request'

// 查询用户
export function queryUser(userQueryParams: any) {
    return request({
        url: '/user-center-service/backend/admin/userInfoByUsernameOrEmailOrNickname',
        method: 'POST',
        data: userQueryParams
    })
}

// 查询用户(角色)
export function queryUserByRole(userQueryParams: any) {
    return request({
        url: '/user-center-service/backend/admin/userInfoByUserRole',
        method: 'POST',
        data: userQueryParams
    })
}

// 重置用户密码
export function resetUserPassword(userIds: any) {
    return request({
        url: '/user-center-service/backend/admin/updateUserPasswordOfAdmin',
        method: 'Put',
        data: userIds
    })
}

// 启用禁用用户
export function switchUser(userId: any, isDelete: any) {
    return request({
        url: `/user-center-service/backend/admin/deleteUserInfoOfAdmin/${userId}/${isDelete}`,
        method: 'DELETE'
    })
}

// 查看用户勋章
export function queryUserMedal(userId: any) {
    return request({
        url: `/user-center-service/backend/admin/userMedalInfo/${userId}`,
        method: 'GET'
    })
}

// 管理员查询
export function queryAdmin(adminQueryParams: any) {
    return request({
        url: '/user-center-service/backend/admin/adminInfoByNicknameOrEmail',
        method: 'POST',
        data: adminQueryParams
    })
}

// 管理员查询(角色)
export function queryAdminByRole(adminQueryParams: any) {
    return request({
        url: '/user-center-service/backend/admin/adminInfoByRole',
        method: 'POST',
        data: adminQueryParams
    })
}

// 查询讲师申请
export function queryTeacherApply(pageParams: any) {
    return request({
        url: '/user-center-service/backend/admin/teacherApplyInfo',
        method: 'POST',
        data: pageParams
    })
}

// 查询登录日志
export function queryLoginLog(loginLogParams: any) {
    return request({
        url: '/user-center-service/backend/admin/queryLoginLog',
        method: 'POST',
        data: loginLogParams
    })
}

// 获取所有角色
export function queryAllRole(pageParams: any) {
    return request({
        url: '/user-center-service/backend/admin/getAllRole',
        method: 'POST',
        data: pageParams
    })
}

// 获取所有勋章
export function queryAllMedal(pageParams: any) {
    return request({
        url: '/user-center-service/backend/admin/getAllMedal',
        method: 'POST',
        data: pageParams
    })
}

// 获取所有在线用户
export function getOnlineCustom() {
    return request({
        url: '/user-center-service/backend/admin/getAllOnlineUser',
        method: 'GET'
    })
}

// 获取所有聊天记录
export function getAllChatRecords(adminId: any, userId: any) {
    return request({
        url: `/user-center-service/backend/admin/getAllChatRecords/${adminId}/${userId}`,
        method: 'GET'
    })
}

// 回收讲师角色
export function deleteTeacherRole(userId: any) {
    return request({
        url: `/user-center-service/backend/admin/deleteTeacher/${userId}`,
        method: 'GET'
    })
}

// 重置管理员密码
export function resetAdminPassword(adminIds: any) {
    return request({
        url: '/user-center-service/backend/admin/updateAdminPasswordOfAdmin',
        method: 'PUT',
        data: adminIds
    })
}

// 启用禁用管理员
export function switchAdmin(adminId: any, isDelete: any) {
    return request({
        url: `/user-center-service/backend/admin/forBiddenAdminOfSuperAdmin/${adminId}/${isDelete}`,
        method: 'DELETE'
    })
}

// 删除管理员
export function deleteAdmin(adminIds: any) {
    return request({
        url: '/user-center-service/backend/admin/deleteAdminOfSuperAdmin',
        method: 'DELETE',
        data: adminIds
    })
}

// 升级超级管理员
export function upgradeAdmin(adminId: any) {
    return request({
        url: `/user-center-service/backend/admin/adminUpgradeSuperAdmin/${adminId}`,
        method: 'GET'
    })
}

// 同意讲师审批
export function agreeTeacherApply(userId: any) {
    return request({
        url: `/user-center-service/backend/admin/agreeTeacherApply/${userId}`,
        method: 'GET'
    })
}

// 不同意讲师审批
export function disagreeTeacherApply(disagreeApplyParams: any) {
    return request({
        url: '/user-center-service/backend/admin/disagreeTeacherApply',
        method: 'POST',
        data: disagreeApplyParams
    })
}

// 删除登录日志
export function deleteLoginLog(loginLogIds: any) {
    return request({
        url: '/user-center-service/backend/admin/deleteLoginLog',
        method: 'DELETE',
        data: loginLogIds
    })
}

// 清空登录日志
export function clearAllLoginLog() {
    return request({
        url: '/user-center-service/backend/admin/clearAllLoginLog',
        method: 'DELETE'
    })
}

// 新增角色
export function addRole(role: any) {
    return request({
        url: '/user-center-service/backend/admin/addRole',
        method: 'POST',
        data: role
    })
}

// 修改角色
export function updateRole(role: any) {
    return request({
        url: '/user-center-service/backend/admin/updateRole',
        method: 'PUT',
        data: role
    })
}

// 删除角色
export function deleteRole(roleIds: any) {
    return request({
        url: '/user-center-service/backend/admin/deleteRole',
        method: 'DELETE',
        data: roleIds
    })
}

// 新增勋章
export function addMedal(medal: any) {
    return request({
        url: '/user-center-service/backend/admin/addMedal',
        method: 'POST',
        data: medal
    })
}

// 修改勋章
export function updateMedal(medal: any) {
    return request({
        url: '/user-center-service/backend/admin/updateMedal',
        method: 'PUT',
        data: medal
    })
}

// 删除勋章
export function deleteMedal(medalIds: any) {
    return request({
        url: '/user-center-service/backend/admin/deleteMedal',
        method: 'DELETE',
        data: medalIds
    })
}


// 获取用户ID和昵称
export function getUserIdAndNickname() {
    return request({
        url: '/user-center-service/backend/admin/getUserIdAndNickname',
        method: 'GET'
    })
}

// 查询管理员自身信息
export function adminInfo() {
    return request({
        url: '/user-center-service/backend/admin/adminInfo',
        method: 'GET'
    })
}

// 修改管理员自身信息
export function updateAdminInfo(adminInfo: any) {
    return request({
        url: '/user-center-service/backend/admin/updateAdminInfo',
        method: 'PUT',
        data: adminInfo
    })
}


// 修改管理员自身密码
export function updateAdminPassword(newPassword: any) {
    return request({
        url: '/user-center-service/backend/admin/updateAdminPassword',
        method: 'PUT',
        params: {
            password: newPassword
        }
    })
}