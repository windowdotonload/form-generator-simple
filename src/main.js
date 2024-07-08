import router from "./router";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/base.css";
import "font-awesome/css/font-awesome.min.css";
import { requestMethodGet, requestMethodPost, requestMethodGetTip, requestMethodGetHandlePage, requestMethodPostTip, requestMethodPostHandlePage, getCookie } from "./api/api";
import moment from "moment";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import * as echarts from "echarts";
import "@/utils/date.js"; // 在main.js中引入
import Cookies from "js-cookie";
import createModel from "@/generalComponents/createModel/index.js";
import "./directives/elSelectLazyLoad.js";
import "./generalComponents/OSSUpload/index";
import { fullScreen_loading } from "./generalComponents/fullScreenLoading";
import GIO from "./utils/gio/index.js";

import {
  getDicDataList,
  getOilNameByOilCode,
  get_company_workshop_ist,
  get_deviceTree_list,
  get_customer_company_list,
  get_customer_dept_list,
  get_customer_post_list,
  formatDate,
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
Vue.prototype.FULLSCREENLOADING = fullScreen_loading.LOADING;
Vue.prototype.FULLSCREENENDLOADING = fullScreen_loading.ENDLOADING;

// Vue.use(ElementUI)
/* eslint-disable no-new */
export default new Vue({
  el: "#app",
  router,
  components: { App: () => import("./App.vue") },
  template: "<App/>",
});
