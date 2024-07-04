import axios from "axios";
import router from "../router";
import { getCookie } from "./api";
import { sha256 } from "js-sha256";
import Utils from "@/utils/base64.js";
import CryptoJS from "crypto-js";
import { cat, config, error } from "shelljs";
import debounce from "lodash/debounce";
import { getConfigMenuCode } from "./authCodeConfig";
import __VM from "../main.js";

export const controlLoading = { loading: true };
export const openLoading = () => (controlLoading.loading = true);
export const closeLoading = () => (controlLoading.loading = false);

const vm = new Vue();
const service = axios.create({
  baseURL: process.env.api, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 180000 // request timeout
  // headers:{
  //   "token":sessionStorage.getItem('access_token')
  // }
});
service.defaults.withCredentials = true;
service.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";

// if()
let loading = "";
const handleMenuCodeForAuth = config => {
  if ((config.params && config.params.menuCode) || (config.data && config.data.menuCode)) return;
  const currentRoute = __VM.$route;
  const currentRouteName = currentRoute.name;
  const configInfo = getConfigMenuCode(config.url, currentRouteName);
  if (configInfo && configInfo.isConfigCode) {
    if (config.method == "get") {
      config.params.menuCode = configInfo.menuCode;
    } else if (config.method == "post") {
      config.data.menuCode = configInfo.menuCode;
    }
  }
};

// post请求loading，避免重复提交
service.interceptors.request.use(
  config => {
    if (config.method == "post" && controlLoading.loading) {
      loading = vm.$loading({
        lock: true,
        text: "请稍后，Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//api网关拦截
service.interceptors.request.use(
  config => {
    handleMenuCodeForAuth(config);
    const method = config.method.toUpperCase();
    const accept = "*/*";
    let date = "";
    let md5 = "";
    let contentType = "";
    let data = {};
    if (config.method == "get") {
      data = {
        ...config.params
      };
    } else if (config.method == "post") {
      data = {
        ...config.data
      };
    }

    let urlData = "";
    let urlDataArr = [];
    for (let key in data) {
      urlDataArr.push(key);
    }
    urlDataArr.sort();

    for (var headerName of urlDataArr) {
      if (data[headerName] === undefined || data[headerName] === null || (data[headerName] instanceof Array && data[headerName].length <= 0)) {
      } else if (data[headerName] === "") {
        urlData += headerName + "&";
      } else {
        urlData += headerName + "=" + data[headerName] + "&";
      }
    }

    urlData = urlData.substring(0, urlData.length - 1);
    if (config.data) {
      urlData += config.data;
    }
    if (typeof config.data === "object") {
      if (config.data.constructor == FormData) {
        contentType = "multipart/form-data";
      } else {
        contentType = "application/json;charset=UTF-8";
      }
    } else if (typeof config.data === "string") {
      contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    }
    // if(data){
    //   if(!JSON.stringify(data).startsWith('{}') && !contentType.startsWith('application/x-www-form-urlencoded')){
    //     md5 = CryptoJS.MD5(data).toString(CryptoJS.enc.Base64);
    //   }
    // }
    const XCaNonce = Utils._uuid();
    const signatureHeaders = {
      "x-ca-nonce": XCaNonce
    };
    let stringToSign = "";
    stringToSign += method + "\n";
    stringToSign += accept + "\n";
    stringToSign += md5 + "\n";
    stringToSign += contentType + "\n";
    stringToSign += date + "\n";
    Object.entries(signatureHeaders).forEach(([key, value]) => {
      stringToSign += key + ":" + value + "\n";
    });

    if (config.url[0] != "/") {
      config.url = "/" + config.url;
    }
    if (urlData.length <= 0) {
      stringToSign += config.url;
    } else {
      stringToSign += config.url;
      if (config.method != "post") {
        stringToSign += "?" + urlData;
      }
    }

    // console.log("stringToSign", stringToSign.replace(/\n/g, "#"));
    const hash2 = sha256.hmac.create(Utils.Base64.decode(process.env.NODE_ENV === "production" ? "aWxkM3h0ZXY5eTc2M3M4YzZnY2ltemoycWRkZTZvejU=" : "bnZiUmljODlUeHpleE9tZEV4clVXRWdmQU9WUVJtU2c="));
    hash2.update(stringToSign, "utf8");
    const sign = hash2.digest();

    // console.log("config", config, hash2, sign, Utils.translateArrayBufferToBase64(sign));
    if (config.method == "get" && config.params.responseTypeBlob) {
      config.responseType = "blob";
    }
    if (config.method == "post" && config.data.responseTypeBlob) {
      config.responseType = "blob";
    }
    config.headers["Source"] = "web";
    // console.log("config.url", config.url + "------" + Utils.translateArrayBufferToBase64(sign));
    config.headers = {
      MSDPAuthorization: config.url == "/web/system/devLogin" ? undefined : getCookie(),
      Source: "web",
      "X-Ca-Key": process.env.NODE_ENV === "production" ? "203809493" : "203957299",
      "X-Ca-Timestamp": new Date().getTime(),
      "X-Ca-Nonce": XCaNonce,
      "X-Ca-Signature": Utils.translateArrayBufferToBase64(sign),
      "X-Ca-Signed-Content-Type": contentType,
      "Content-Type": contentType,
      "x-ca-signature-headers": `x-ca-nonce`
      // "X-Ca-Stage": "Test"
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  response => {
    if (loading) {
      loading.close();
    }
    if (response.data.code == 1002) {
      //跳转到无权限页面
      router.push({
        //核心语句
        path: "/NoPermission" //跳转的路径
      });
    }
    if (response.data.code == 3500) {
      //跳转到登录页面
      ELEMENT.Message.closeAll();
      if (localStorage.getItem("backName") == "/wechatLogin") {
        router.push({
          //核心语句
          path: "/wechatLogin" //跳转的路径
        });
      } else {
        router.push({
          //核心语句
          path: "/login" //跳转的路径
        });
      }
      localStorage.removeItem("backName");
      this.$router.go(0);
    }
    if (response.data.code == 3600) {
      ELEMENT.Message.closeAll();
      //跳转到登录页面
      if (localStorage.getItem("backName") == "/wechatLogin") {
        router.push({
          //核心语句
          path: "/wechatLogin" //跳转的路径
        });
      } else {
        router.push({
          //核心语句
          path: "/login", //跳转的路径
          query: { code: 3600 }
        });
      }
      localStorage.removeItem("backName");
    }
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
    // return response;
  },
  error => {
    if (loading) {
      loading.close();
    }
    // if (error.response.status == 404) {
    //   routerNotFond();
    //   return;
    // }
    if (error && !error.response) {
      //跳转到登录页面
      // router.push({
      //   //核心语句
      //   path: "/login" //跳转的路径
      // });
      // this.$router.go(0);
      console.error("[REQUEST ERR]  [path]:", error.config.url);
      return;
    }
    //Router.push({name: 'LoginPage'})
    return Promise.reject(error);
  }
);
const routerNotFond = debounce(() => {
  router.replace({
    path: "/notFoundPage"
  });
}, 100);
export default service;
