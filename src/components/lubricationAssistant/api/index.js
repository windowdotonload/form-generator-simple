import { requestMethodGetTip, requestMethodPostTip } from "@/api/api";

export const executeCbAfterReq = async (reqFunc, prarams, cbFunc) => {
  const res = await reqFunc(prarams);
  if (res.data.code == 1000) {
    if (cbFunc) cbFunc(res.data.data);
  }
};

export const getTrainOverview = async prarams => {
  return await requestMethodGetTip("/train/queryCurrentWatchCount", prarams);
};

export const getTrainTypeList = async params => {
  return await requestMethodGetTip("train/queryTrainTypeList", params);
};

export const getVideoPanelList = async params => {
  return await requestMethodGetTip("train/queryTrainListByType", params);
};

export const getTrainDetail = async params => {
  return await requestMethodGetTip("train/queryTrainDetail", params);
};

export const getTrainVideoPlayerUrl = async params => {
  return await requestMethodGetTip("/train/getPlayInfo", params);
};

export const getTrainCommentList = async params => {
  return await requestMethodGetTip("/train/queryTrainEvaluateListByPage", params);
};

export const addComment = async params => {
  return await requestMethodPostTip("train/addEvaluate", params);
};

export const getRecommendTrainList = async params => {
  return await requestMethodGetTip("train/getRecommendTrainList", params);
};

export const getLubServiceConfigureList = async params => {
  return await requestMethodGetTip("train/getTrainServiceConfList", params);
};

export const getTestURL = async params => {
  return await requestMethodGetTip("train/getTrainTestUrl", params);
};

export const updateTrainTestInfo = async params => {
  return await requestMethodPostTip("train/updateTrainTestInfo", params);
};

export const getTrainTestAnswerURL = async params => {
  return await requestMethodGetTip("train/getTestAnswerUrl", params);
};

export const getCertificateList = async params => {
  return await requestMethodGetTip("train/queryCurrentWatchCount", params);
};

export const saveWatchTime = async params => {
  return await requestMethodGetTip("train/addUserWatchDuration", params);
};

export const getTrainSearchResult = async params => {
  return await requestMethodGetTip("train/getTrainSearchResult", params);
};

export const giveALikeOrCancel = async params => {
  return await requestMethodGetTip("train/giveALikeOrCancel", params);
};

export const addGrade = async params => {
  return await requestMethodGetTip("train/addGrade", params);
};

export const deleteComment = async params => {
  return await requestMethodGetTip("train/deleteEvaluate", params);
};
