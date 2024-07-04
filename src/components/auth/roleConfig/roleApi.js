import { requestMethodGetTip, requestMethodPostTip } from "../../../api/api";

export const role_getList = async params => {
  const res = await requestMethodPostTip("permission/accessTemplate/list", params);
  return res;
};

export const role_add = async params => {
  const res = await requestMethodPostTip("permission/accessTemplate/add", params);
  return res;
};

export const role_delete = async params => {
  const res = await requestMethodGetTip("permission/accessTemplate/delete", params);
  return res;
};

export const role_update = async params => {
  const res = await requestMethodPostTip("permission/accessTemplate/update", params);
  return res;
};

export const role_getAuthTree = async params => {
  const res = await requestMethodGetTip("permission/group/getPermissionGroupTree", params);
  return res;
};

export const group_getAssociatedDataRule = params => {
  return requestMethodPostTip("permission/group/associatedDataRule", params);
};
