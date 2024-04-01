import request from './request'

// 侧边菜单
export function showAsideMenu() {
    return request({
        url: '/user-center-service/backend/admin/menu/showAsideMenu',
        method: 'GET'
    })
}

// 所有菜单
export function queryAllMenu(pageParams: any) {
    return request({
        url: '/user-center-service/backend/admin/menu/getAllMenu',
        method: 'POST',
        data: pageParams
    })
}

// 获取一级菜单
export function getLevelMenuInfo() {
    return request({
        url: '/user-center-service/backend/admin/menu/getLevelMenuInfo',
        method: 'GET'
    })
}

// 新增菜单
export function addMenu(menu: any) {
    return request({
        url: '/user-center-service/backend/admin/menu/insertMenu',
        method: 'POST',
        data: menu
    })
}

// 修改菜单
export function updateMenu(menu: any) {
    return request({
        url: '/user-center-service/backend/admin/menu/updateMenu',
        method: 'PUT',
        data: menu
    })
}

// 隐藏/可见菜单
export function hiddenMenu(menuId: any, visible: any) {
    return request({
        url: `/user-center-service/backend/admin/menu/hiddenMenu/${menuId}/${visible}`,
        method: 'PUT',
    })
}

// 删除菜单
export function deleteMenu(menuIds: any) {
    return request({
        url: '/user-center-service/backend/admin/menu/deleteMenu',
        method: 'DELETE',
        data: menuIds
    })
}

// 赋予菜单权限
export function giveRoleMenu(roleMenuParams: any) {
    return request({
        url: '/user-center-service/backend/admin/menu/giveRoleMenu',
        method: 'POST',
        data: roleMenuParams
    })
}