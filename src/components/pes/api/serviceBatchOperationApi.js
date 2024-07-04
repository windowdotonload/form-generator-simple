import { requestMethodGetTip, requestMethodPostTip, requestMethodGet } from "@/api/api";
import { closeLoading, openLoading } from "@/api/request.js";

let createServiceTypeTreeData = null;
let workShopList = null;
let customerList = null;

export const setCascaderData = rawVal => {
  for (const item of rawVal) {
    if (item.children && item.children.length) {
      setCascaderData(item.children);
    } else {
      item.children = undefined;
    }
  }
};

export const clearState = () => {
  createServiceTypeTreeData = null;
  workShopList = null;
};

export const getCreateServiceTypeTreeData = async () => {
  if (createServiceTypeTreeData && createServiceTypeTreeData.length) return createServiceTypeTreeData;
  const res = await requestMethodGetTip("/web/config/serviceConfiguration/getServiceConfTree",{serviceDisplay: 1});
  setCascaderData(res.data.data);
  createServiceTypeTreeData = res.data.data;
  return res.data.data;
};

export const getWorkShopList = async params => {
  // if (workShopList && workShopList.length) return workShopList;
  const res = await requestMethodGetTip("/pes/getPesWorkshop", params);
  workShopList = res.data.data;
  return res.data.data;
};

export const getChargeUserList = async params => {
  const res = await requestMethodGetTip("/pes/package/queryServiceChargeUsers", params);
  return res.data.data;
};

export const getMobileProjectUsers = async params => {
  const res = await requestMethodGetTip("/pes/report/queryMobilProjectUsers", params);
  return res.data.data;
};

export const getDistributorProjectUsers = async params => {
  const res = await requestMethodGetTip("/pes/report/queryDistributorProjectUsers", params);
  return res.data.data;
};

export const getCustomerProjectUsers = async params => {
  // if (customerList) return customerList;
  const res = await requestMethodGetTip("/web/system/permission/orgSysUserManagae/userListOfOrg", params);
  const list = res.data.data.list;
  customerList = list;
  return list;
};

export const authChangegetCustomerProjectUsers = async params => {
  const res = await requestMethodGetTip("/pes/queryCustomerProjectMembersList", params);
  const list = res.data.data.list;
  return list;
};

export const getServiceTableData = async params => {
  const res = await requestMethodGetTip("/pes/item/listByPage", params);
  return { list: res.data.data ? res.data.data.list : [], total: res.data.data ? res.data.data.totalCount : 0 };
};

export const createServiceItemBatch = async params => {
  const res = await requestMethodPostTip("/pes/item/addBatch", params);
  return res;
};

export const getEditServiceChargetUserList = async params => {
  const res = await requestMethodGetTip("/pes/item/getChargeUserDropData", params);
  return res;
};

export const getEditServiceTypeTree = async params => {
  const res = await requestMethodGetTip("/pes/item/getUsedServiceNumberTree", params);
  setCascaderData(res.data.data || []);
  return res.data.data;
};

export const queryEditNum = async params => {
  const res = await requestMethodGetTip("/pes/item/queryNumByCondition", params);
  return res.data.data;
};

export const editServiceBatch = async params => {
  const res = await requestMethodPostTip("/pes/item/editBatch", params);
  return res;
};

export const editServcieSingle = async params => {
  const res = await requestMethodPostTip("/pes/item/editOneStatus", params);
  return res;
};

export const cancelServiceBatch = async params => {
  const res = await requestMethodPostTip("/pes/item/cancelBatch", params);
  return res;
};
