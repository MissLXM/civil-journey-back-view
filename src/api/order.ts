import request from './request'

// 查询所有订单信息
export function queryAllOrder(orderQueryParams: any) {
    return request({
        url: '/payment-center-service/pay/queryAllOrder',
        method: 'POST',
        data: orderQueryParams
    })
}

// 订单退款操作
export function refundOrder(order: any) {
    return request({
        url: '/payment-center-service/alipay/return',
        method: 'POST',
        data: order
    })
}