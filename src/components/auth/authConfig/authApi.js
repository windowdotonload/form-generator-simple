import { requestMethodGetTip, requestMethodPostTip } from "../../../api/api";

export const getMenuList = async params => {
  const res = await requestMethodGetTip("web/system/permission/menuManage/listByPage", params);
  return res;
};

export const getWechatMenuList = async params => {
  const res = await requestMethodGetTip("web/system/permission/menuManage/listByPage", Object.assign(params || { callPermissionCenterFlag: true, current: 1, size: 50 }, { menuSource: "weChat" }));
  return res;
};

export const getWebMenuList = async params => {
  const res = await requestMethodGetTip("web/system/permission/menuManage/listByPage", Object.assign(params || { callPermissionCenterFlag: true, current: 1, size: 50 }, { menuSource: "web" }));
  return res;
};

export const group_add = params => {
  return requestMethodPostTip("permission/group/add", params);
};

export const group_associatedMenus = params => {
  if (params.groupId) params.groupId = Vue.prototype.EncryptUserId(params.groupId.toString());
  return requestMethodGetTip("permission/group/associatedMenus", params);
};

export const group_delete = params => {
  return requestMethodGetTip("permission/group/delete", params);
};

export const group_listOfLevel = params => {
  if (params.id) params.id = Vue.prototype.EncryptUserId(params.id.toString());
  else if (!params.id && params.id !== 0) params.id = Vue.prototype.EncryptUserId("");
  return requestMethodGetTip("permission/group/listOfLevel", params);
};

export const group_update = params => {
  // if (params.id) params.id = Vue.prototype.EncryptUserId(params.id);
  return requestMethodPostTip("permission/group/update", params);
};

export const group_updatePermissionGroupMenuRel = params => {
  return requestMethodPostTip("permission/group/updatePermissionGroupMenuRel", params);
};

export const group_batchUpdateSort = params => {
  return requestMethodPostTip("permission/group/batchUpdateSort", params);
};

export const group_getAssociatedDataRule = params => {
  return requestMethodPostTip("permission/group/associatedDataRule", params);
};
