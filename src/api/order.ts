import request from './request'

// 查询所有订单信息
export function queryAllOrder(orderQueryParams: any) {
    return request({
        url: '/payment-center-service/pay/queryAllOrder',
        method: 'POST',
        data: orderQueryParams
    })
}