import request from '@/api/request'

// 查询服务行业配置列表
export function getServiceIndustry () {
  return request({
    url: '/web/config/serviceConfiguration/getServiceIndustry',
    method: 'get',
    params: {}
  })
}
// 查询全部客户行业列表
export function getCusIndustryList () {
  return request({
    url: '/web/config/serviceConfiguration/getCusIndustryList',
    method: 'get',
    params: {}
  })
}
// 查询服务行业配置列表
export function saveServiceIndustry (data) {
  return request({
    url: '/web/config/serviceConfiguration/saveServiceIndustry',
    method: 'post',
    data: data
  })
}
// 已配置好的服务的行业，已关联的三级服务项
export function getAssociatedServiceItems (params) {
  return request({
    url: '/web/config/serviceConfiguration/getAssociatedServiceItems',
    method: 'get',
    params: params
  })
}
// 配置服务的行业删除服务行业
export function deleteIndustryCheck (params) {
  return request({
    url: '/web/config/serviceConfiguration/deleteIndustryCheck',
    method: 'get',
    params: params
  })
}
