import { requestMethodGetTip, requestMethodPostTip, requestMethodGet } from "@/api/api";
import { closeLoading, openLoading } from "@/api/request.js";
import { rsaEncryptUserId } from '../../../utils/aes'

export const executeCbAfterReq = async (reqFunc, prarams, cbFunc) => {
  const res = await reqFunc(prarams);
  if (res.data.code == 1000) {
    if (cbFunc) cbFunc(res.data.data);
  }
};

export const generalFormValidate = (vm, formKey, cb) => {
  vm.$refs[formKey].validate(async valid => {
    if (valid) cb();
  });
};

export const createClassify = async prarams => {
  return await requestMethodPostTip("/knowledge/base/addUpdateLv12", prarams);
};

export const getOpLog = async params => {
  return await requestMethodGetTip("/knowledge/base/queryOperateLog", params);
};

export const getClassifyList = async params => {
  return await requestMethodGetTip("/knowledge/base/listByLevel", params);
};

export const getClassifyListLv3Specific = async params => {
  return await requestMethodGetTip("/knowledge/base/listLv3FullPathByLv2", params);
};

export const checkDeleteable = async params => {
  return await requestMethodGetTip("/knowledge/base/checkDelete", params);
};

export const deleteClassifyItem = async params => {
  return await requestMethodPostTip("/knowledge/base/delete", params);
};

export const moveUpDown = async params => {
  return await requestMethodPostTip("/knowledge/base/moveUpDown", params);
};

export const addUpdateLv3 = async params => {
  return await requestMethodPostTip("/knowledge/base/addUpdateLv3", params);
};

export const downladImportTemplate = async params => {
  return await requestMethodGetTip("/web/file/getFullUrl", params);
};

export const getFullPath = async path => {
  return await requestMethodGetTip("/web/file/getFullUrl", {
    url: path
  });
};

export const batchUpload = async params => {
  return await requestMethodPostTip("/knowledge/base/upload", params);
};

export const getClassifyListAll = async params => {
  return await requestMethodGetTip("/knowledge/base/listAll", params);
};

export const queryQAid = async params => {
  params.id = rsaEncryptUserId(params.id.toString())
  return await requestMethodGetTip("/knowledge/base/queryLv3ById", params);
};

export const queryQATreeList = async params => {
  return await requestMethodGetTip("/knowledge/base/queryTreeLv12", params);
};

export const queryQAContent = async params => {
  return await requestMethodGetTip("/knowledge/base/listLv3FullPathByLv2", params);
};

export const queryChartsData = async params => {
  return await requestMethodGetTip("/knowledge/base/queryAnalysisChart", params);
};

export const exportChartsData = async params => {
  return await requestMethodGet("/knowledge/base/exportAnalysisChart", params);
};

export const getChartSelectData = async params => {
  return await requestMethodGetTip("/knowledge/base/queryDropdownLv12", params);
};

export const getChartSelectDataDropDown = async params => {
  return await requestMethodGetTip("/knowledge/base/queryDropdownLv12ByQa", params);
};

export const getQAContentSearchTree = async params => {
  return await requestMethodGetTip("/knowledge/base/searchTree", params);
};

export const getQAContentSearchTreeToSpecificQA = async params => {
  return await requestMethodGetTip("/knowledge/base/selectKnowledgeAppointQaByQqId", params);
};

export const saveVisitsLogByQaId = async params => {
  return await requestMethodPostTip("/knowledge/base/saveVisitsLogByQaId", params);
};
