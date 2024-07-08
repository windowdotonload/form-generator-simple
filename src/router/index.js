// import Vue from 'vue'
// import Router from 'vue-router'
// Vue.use(Router)

// eslint-disable-next-line no-undef
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const routes = [
  {
    path: "/",
    redirect: "/ReportForm/create",
  },
  {
    path: "/formManage",
    name: "formManage",
    meta: {
      title: "记录表",
    },
    component: () => import(/* webpackChunkName: formManage */ "@/components/formApplication/index.vue"),
  },
  {
    path: "/formManage/formCreate",
    name: "formCreate",
    meta: {
      title: "表单应用,管理表单,编辑表单",
    },
    component: () => import(/* webpackChunkName: formCreate */ "@/components/formApplication/formCreate/index.vue"),
  },
  {
    path: "/formManage/formTemplateList",
    name: "formTemplateList",
    meta: {
      title: "记录表,记录表配置管理",
    },
    component: () => import(/* webpackChunkName: formTemplateList */ "@/components/formApplication/formTemplateList/index.vue"),
  },
  {
    path: "/formManage/formFill",
    name: "formFill",
    meta: {
      title: "记录表,填写记录表",
    },
    component: () => import(/* webpackChunkName: formFill */ "@/components/formApplication/formFill/index.vue"),
  },
  {
    path: "/formManage/formHistoryRecord",
    name: "formHistoryRecord",
    meta: {
      title: "记录表,历史记录",
    },
    component: () => import(/* webpackChunkName: formHistoryRecord */ "@/components/formApplication/formHistoryRecord/index.vue"),
  },
  {
    path: "/ReportForm",
    name: "ReportForm",
    meta: {
      title: "自定义报告表单",
    },
    component: () => import(/* webpackChunkName: ReportForm */ "@/components/ReportForm/index.vue"),
  },
  {
    path: "/ReportForm/create",
    name: "ReportFormCreate",
    meta: {
      title: "自定义报告表单,创建",
    },
    component: () => import(/* webpackChunkName: ReportFormCreate */ "@/components/ReportForm/formApplication/formCreate/page.vue"),
  },
  {
    path: "/ReportForm/edit",
    name: "ReportFormEdit",
    meta: {
      title: "自定义报告表单,编辑",
    },
    component: () => import(/* webpackChunkName: ReportFormEdit */ "@/components/ReportForm/formApplication/formCreate/page.vue"),
  },
  {
    path: "/ReportForm/fillReport",
    name: "ReportFormFillReport",
    meta: {
      title: "工单,填写表单",
    },
    component: () => import(/* webpackChunkName: ReportFormEdit */ "@/components/ReportForm/formApplication/formFill/index.vue"),
  },
];
export default new VueRouter({
  routes,
});
