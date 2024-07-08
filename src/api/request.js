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
  timeout: 180000, // request timeout
  // headers:{
  //   "token":sessionStorage.getItem('access_token')
  // }
});
service.defaults.withCredentials = true;
service.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";

// if()
let loading = "";
const handleMenuCodeForAuth = (config) => {
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

export default service;
