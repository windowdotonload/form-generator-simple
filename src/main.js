// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import App from "./App";
import router from "./router";
// import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/base.css";
import "font-awesome/css/font-awesome.min.css";
import { requestMethodGet, requestMethodPost, requestMethodGetTip, requestMethodGetHandlePage, requestMethodPostTip, requestMethodPostHandlePage, getCookie } from "./api/api";
import has from "@/api/btnPermissions";
import moment from "moment";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import * as echarts from "echarts";
import { store } from "@/store";
import "@/utils/date.js"; // 在main.js中引入
import Cookies from "js-cookie";
import createModel from "@/generalComponents/createModel/index.js";
import "./directives/elSelectLazyLoad.js";
import "./generalComponents/OSSUpload/index";
import RegisterComponents from "./plugin/registerComponents";
import { fullScreen_loading } from "./generalComponents/fullScreenLoading";
import GIO from "./utils/gio/index.js";

Vue.use(RegisterComponents);
// lodash方法  https://lodash.com/
const _ = require("lodash");
// 加/解密
import { Encrypt, Decrypt, rsaEncryptUserId } from "./utils/aes";
// 字典值
import {
  getDicDataList,
  getOilNameByOilCode,
  get_company_workshop_ist,
  get_deviceTree_list,
  get_customer_company_list,
  get_customer_dept_list,
  get_customer_post_list,
  formatDate
} from "./utils/index";
Vue.use(elTableInfiniteScroll);
import VueClipboard from "vue-clipboard2";

Vue.use(VueClipboard);
import QuillEditor from "vue-quill-editor";
import Vue from "vue";

Vue.use(QuillEditor);
Vue.config.productionTip = false;
Vue.prototype.$gio = GIO;
Vue.prototype.requestMethodGet = requestMethodGet;
Vue.prototype.requestMethodPost = requestMethodPost;
Vue.prototype.requestMethodGetTip = requestMethodGetTip;
Vue.prototype.requestMethodPostTip = requestMethodPostTip;
Vue.prototype.requestMethodGetHandlePage = requestMethodGetHandlePage;
Vue.prototype.requestMethodPostHandlePage = requestMethodPostHandlePage;
Vue.prototype.getCookie = getCookie;
Vue.prototype.moment = moment;
Vue.prototype.$echarts = echarts;
Vue.prototype.getDicDataList = getDicDataList;
Vue.prototype.getOilNameByOilCode = getOilNameByOilCode;
Vue.prototype.get_company_workshop_ist = get_company_workshop_ist;
Vue.prototype.get_deviceTree_list = get_deviceTree_list;
Vue.prototype.get_customer_company_list = get_customer_company_list;
Vue.prototype.get_customer_dept_list = get_customer_dept_list;
Vue.prototype.get_customer_post_list = get_customer_post_list;
Vue.prototype.formatDate = formatDate;
Vue.prototype.$createModel = createModel;
Vue.prototype.$cookies = Cookies;
Vue.prototype.Encrypt = Encrypt;
Vue.prototype.Decrypt = Decrypt;
Vue.prototype.EncryptUserId = rsaEncryptUserId;
Vue.prototype.FULLSCREENLOADING = fullScreen_loading.LOADING;
Vue.prototype.FULLSCREENENDLOADING = fullScreen_loading.ENDLOADING;

// Vue.use(ElementUI)
/* eslint-disable no-new */
export default new Vue({
  el: "#app",
  router,
  store,
  components: { App: () => import("./App.vue") },
  template: "<App/>"
});
setTimeout(() => {
  if (
    router.history.current.path.toLowerCase() != "/login" &&
    router.history.current.path.toLowerCase() != "/wechatlogin" &&
    router.history.current.path.toLowerCase() != "/success" &&
    !router.history.current.meta.whiteList
  ) {
    if (sessionStorage.getItem("menuList")) {
      let menuList = JSON.parse(sessionStorage.getItem("menuList")) || [];
      if (!getMenuList(menuList, router.history.current.path)) {
        if (menuList[0].children.length && menuList[0].children[0].menuType == "C") {
          router.push({
            //核心语句
            path: menuList[0].children[0].frontUrl //跳转的路径
          });
        } else {
          router.push({
            //核心语句
            path: menuList[0].frontUrl //跳转的路径
          });
        }
      }
    } else {
      let path = window.location.href.split("#")[1];
      router.push({
        path: path
      });
    }
  }
}, 200);

let isInputAddressUrl = false;
//全局守卫//暂时限制微信登陆
router.beforeEach((to, from, next) => {
  if (to.meta.whiteList) {
    next();
    return;
  }
  let menuList = JSON.parse(sessionStorage.getItem("menuList")) || [];
  if (to.matched.length && getMenuList(menuList, to.path)) {
    if (Vue.prototype.$userInfo && Vue.prototype.$userInfo.userType == "2" && to.path == "/PESService") {
      next("/PESIndex");
    } else {
      next();
    }
  } else {
    setTimeout(() => {
      // isInputAddressUrl为true时代表手动输入地址
      if (isInputAddressUrl) {
        isInputAddressUrl = false;
        next({ path: from.fullPath });
      } else {
        if (to.path.includes("http://") || to.path.includes("https://")) {
          let p = "http" + to.path.split("http")[1];
          next(from.fullPath);
          window.open(p);
        } else {
          next();
        }
      }
    }, 400);
  }
});
// 手动修改路由才会触发监听
window.addEventListener(
  "hashchange",
  () => {
    isInputAddressUrl = true;
  },
  false
);

function getMenuList(menuList, path) {
  let flag = false;
  if (
    path.toLowerCase() == "/" ||
    path.toLowerCase() == "/login" ||
    path.toLowerCase() == "/wechatlogin" ||
    path.toLowerCase() == "/nopermission" ||
    path.toLowerCase() == "/success" ||
    path.toLowerCase() == "/message" ||
    path.toLowerCase() == "/userhelpdisplay"
  ) {
    return true;
  }
  menuList.forEach(item => {
    if (item.frontUrl && path.startsWith(item.frontUrl)) {
      flag = true;
    } else {
      if (item.children && item.children.length) {
        item.children.forEach(res => {
          if (res.frontUrl && path.startsWith(res.frontUrl)) {
            flag = true;
          }
        });
      }
    }
  });
  return flag;
}
