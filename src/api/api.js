import Vue from "vue";
import service from "@/api/request";
import qs from "qs";
export const baseRemoteOauth2 = process.env.api;
//let baseRemote = 'http://172.24.112.165:8000/api/v1';

export const requestMethod = {
  get(url, params = {}) {
    return service.get(url, { params: params });
  },
  post(url, params = {}) {
    return service.post(url, qs.stringify(params));
  }
};
export const requestMethodGet = (url, params = {}) => {
  if (params === undefined || params === null) {
    params = {};
  }
  return service.get(url, { params: params });
};

export const requestMethodGetTip = async (url, params = {}) => {
  const res = await service.get(url, { params: params });
  if (res.data.code !== 1000) {
    Vue.prototype.$message({
      type: "warning",
      message: res.data.msg
    });
    return false;
  }
  return res;
};

export const requestMethodGetHandlePage = async (url, params = {}, handleInfo) => {
  const res = await service.get(url, { params: params });
  if (res.data.code !== 1000) {
    Vue.prototype.$message({
      type: "warning",
      message: res.data.msg
    });
    return false;
  }
  if (handleInfo && res.data.data.list && !res.data.data.list.length && res.data.data.pageIndex > 1 && res.data.data.totalCount) {
    const { vm, method, currentKey } = handleInfo;
    const splitKey = currentKey.split(".");
    let vmCurrent = null;
    while (splitKey.length > 1) {
      const key = splitKey.shift();
      vmCurrent = vmCurrent ? vmCurrent[key] : vm[key];
    }
    console.log(vmCurrent, splitKey);
    vmCurrent[splitKey[0]] = vmCurrent[splitKey[0]] - 1;
    return vm[method]();
  }
  return res;
};

export const requestMethodPost = (url, params = {}, flag) => {
  if (flag) {
    return service.post(url, qs.stringify(params));
  }
  return service.post(url, params);
};

export const requestMethodPostTip = async (url, params = {}, flag) => {
  if (flag) {
    const res = service.post(url, qs.stringify(params));
    if (res.data.code != 1000) {
      Vue.prototype.$message({
        type: "warning",
        message: res.data.msg
      });
      return false;
    }
    return res;
  }
  const res = await service.post(url, params);
  if (res.data.code != 1000) {
    Vue.prototype.$message({
      type: "warning",
      message: res.data.msg
    });
  }
  return res;
};

export const requestMethodPostHandlePage = async (url, params = {}, flag, handleInfo) => {
  if (flag) {
    const res = service.post(url, qs.stringify(params));
    if (res.data.code != 1000) {
      Vue.prototype.$message({
        type: "warning",
        message: res.data.msg
      });
      return false;
    }
    return res;
  }
  const res = await service.post(url, params);
  if (res.data.code != 1000) {
    Vue.prototype.$message({
      type: "warning",
      message: res.data.msg
    });
  }
  if (handleInfo && res.data.data.list && !res.data.data.list.length && res.data.data.pageIndex > 1 && res.data.data.totalCount) {
    const { vm, method, currentKey } = handleInfo;
    const splitKey = currentKey.split(".");
    let vmCurrent = null;
    while (splitKey.length > 1) {
      const key = splitKey.shift();
      vmCurrent = vmCurrent ? vmCurrent[key] : vm[key];
    }
    console.log(vmCurrent, splitKey);
    vmCurrent[splitKey[0]] = vmCurrent[splitKey[0]] - 1;
    return vm[method]();
  }
  return res;
};

export const getCookie = () => {
  let MSDPAuthorization = "";
  if (document.cookie.length > 0) {
    var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split("="); //再次切割
      //判断查找相对应的值
      if (arr2[0] == "MSDPAuthorization") {
        MSDPAuthorization = arr2[1];
      }
    }
  }
  return MSDPAuthorization;
};
