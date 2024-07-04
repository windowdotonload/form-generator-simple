import request from "@/api/request";

// 查询服务项
export function getServiceOverview(params) {
  if (!params.menuCode) {
    params.menuCode = "servicesoverview";
  }
  return request({
    url: "/weChat/workOrder/getServiceOverview",
    method: "get",
    params: params
  });
}
// 查询表格数据
export function getServiceOverviewList(params) {
  return request({
    url: "/weChat/workOrder/getServiceOverviewList",
    method: "get",
    params: params
  });
}
