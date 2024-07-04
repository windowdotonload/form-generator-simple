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
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "",
    },
    component: () => import(/* webpackChunkName: login */ "@/components/LoginPage"),
  },
  {
    path: "/inspectItem",
    name: "inspectItem",
    meta: {
      title: "检查项管理",
    },
    component: () => import(/* webpackChunkName: inspectItem */ "@/components/spotInspection/inspectionItems/index"),
  },
  {
    path: "/inspectItem/createItem",
    name: "createItem",
    meta: {
      title: "检查项管理,创建检查项",
    },
    component: () => import(/* webpackChunkName: createItem */ "@/components/spotInspection/inspectionItems/createItem.vue"),
  },
  {
    path: "/taskManager",
    name: "taskManager",
    meta: {
      title: "任务管理",
    },
    component: () => import(/* webpackChunkName: taskManager */ "@/components/spotInspection/taskManager/index.vue"),
  },
  {
    path: "/taskManager/createTaskNew",
    name: "createTaskNew",
    meta: {
      title: "任务管理,创建",
    },
    component: () => import(/* webpackChunkName: createTaskNew */ "@/components/spotInspection/taskManager/createTaskNew.vue"),
  },
  {
    path: "/abnormalRecord",
    name: "abnormalRecord",
    meta: {
      title: "异常记录",
    },
    component: () => import(/* webpackChunkName: abnormalRecord */ "@/components/spotInspection/abnormalRecord/index.vue"),
  },
  {
    path: "/message",
    name: "message",
    meta: {
      title: "消息中心",
    },
    component: () => import(/* webpackChunkName: message */ "@/components/messageCenter/message.vue"),
  },
  {
    path: "/wechatLogin",
    name: "wechatLogin",
    meta: {
      title: "",
    },
    component: () => import(/* webpackChunkName: wechatLogin */ "@/components/wechatLogin.vue"),
  },
  {
    path: "/LoginConfigure",
    name: "LoginConfigure",
    meta: {
      title: "登录页",
    },
    component: () => import(/* webpackChunkName: LoginConfigure */ "@/components/loginconfigure/LoginConfigure.vue"),
  },
  {
    path: "/LoginConfigure/AddLoginConfigure",
    name: "AddLoginConfigure",
    meta: {
      title: "登录页,新建",
    },
    component: () => import(/* webpackChunkName: AddLoginConfigure */ "@/components/loginconfigure/AddLoginConfigure.vue"),
  },
  {
    path: "/LoginConfigure/EditLoginVideoConfigure",
    name: "EditLoginVideoConfigure",
    meta: {
      title: "未登录页配置,编辑",
    },
    component: () => import(/* webpackChunkName: EditLoginVideoConfigure */ "@/components/loginconfigure/EditLoginVideoConfigure.vue"),
  },
  {
    path: "/LoginConfigure/EditLoginBackground",
    name: "EditLoginBackground",
    meta: {
      title: "未登录页配置, 编辑登录主页背景",
    },
    component: () => import(/* webpackChunkName: EditLoginBackground */ "@/components/loginconfigure/EditLoginBackground.vue"),
  },
  {
    path: "/ServiceConfigure",
    name: "ServiceConfigure",
    meta: {
      title: "服务配置",
    },
    component: () => import(/* webpackChunkName: ServiceConfigure */ "@/components/serviceConfigure/index.vue"),
  },
  {
    path: "/ServiceConfigure/AddServiceItem",
    name: "AddServiceItem",
    meta: {
      title: "服务配置,新增服务项",
    },
    component: () => import(/* webpackChunkName: AddServiceItem */ "@/components/serviceConfigure/addServiceItem.vue"),
  },
  {
    path: "/ServiceConfigure/ServiceIndexesConfigure",
    name: "ServiceIndexesConfigure",
    meta: {
      title: "服务配置,新增服务索引",
    },
    component: () => import(/* webpackChunkName: ServiceIndexesConfigure */ "@/components/serviceConfigure/serviceIndexesConfigure.vue"),
  },
  {
    path: "/ServiceApplyConfigure",
    name: "ServiceApplyConfigure",
    meta: {
      title: "服务申请原因配置",
    },
    component: () => import(/* webpackChunkName: ServiceApplyConfigure */ "@/components/configure/serviceApplyConfigure.vue"),
  },
  {
    path: "/ServiceApplyList",
    name: "ServiceApplyList",
    meta: {
      title: "服务申请单",
    },
    component: () => import(/* webpackChunkName: ServiceApplyList */ "@/components/configure/serviceApplyList.vue"),
  },
  {
    path: "/ServiceApplyList/ServiceApplyDetail",
    name: "ServiceApplyDetail",
    meta: {
      title: "服务申请单管理,查看",
    },
    component: () => import(/* webpackChunkName: ServiceApplyDetail */ "@/components/configure/serviceApplyDetail.vue"),
  },
  {
    path: "/ParameterConfig",
    name: "ParameterConfig",
    meta: {
      title: "参数配置",
    },
    component: () => import(/* webpackChunkName: ParameterConfig */ "@/components/configurationMent/ParameterConfig.vue"),
  },
  {
    path: "/DealerAreaConfig",
    name: "DealerAreaConfig",
    meta: {
      title: "经销商区域配置",
    },
    component: () => import(/* webpackChunkName: DealerAreaConfig */ "@/components/configurationMent/DealerAreaConfig.vue"),
  },
  {
    path: "/RoleAreaConfig",
    name: "RoleAreaConfig",
    meta: {
      title: "角色区域选项配置",
    },
    component: () => import(/* webpackChunkName: RoleAreaConfig */ "@/components/configurationMent/RoleAreaConfig.vue"),
  },
  {
    path: "/ComprehensiveConfigure",
    name: "ComprehensiveConfigure",
    meta: {
      title: "综合页",
    },
    component: () => import(/* webpackChunkName: ComprehensiveConfigure */ "@/components/loginconfigure/ComprehensiveConfigure.vue"),
  },
  {
    path: "/ConfigurationActivityContent",
    name: "ConfigurationActivityContent",
    meta: {
      title: "活动内容配置",
    },
    component: () => import(/* webpackChunkName: ComprehensiveConfigure */ "@/components/loginconfigure/configurationActivityContent.vue"),
  },
  {
    path: "/reviewReport",
    name: "reviewReport",
    meta: {
      title: "回顾报告",
    },
    component: () => import(/* webpackChunkName: reviewReport */ "@/components/loginconfigure/reviewReport.vue"),
  },
  {
    path: "/ComprehensiveConfigure/EditComprehensiveConfigure",
    name: "EditComprehensiveConfigure",
    meta: {
      title: "综合页,编辑",
    },
    component: () => import(/* webpackChunkName: EditComprehensiveConfigure */ "@/components/loginconfigure/EditComprehensiveConfigure.vue"),
  },
  {
    path: "/NoPermission",
    name: "NoPermission",
    component: () => import(/* webpackChunkName: NoPermission */ "@/components/NoPermission.vue"),
  },
  {
    path: "/DealerProfile",
    name: "DealerProfile",
    meta: {
      title: "经销商",
    },
    component: () => import(/* webpackChunkName: DealerProfile */ "@/components/dealer/DealerProfile.vue"),
  },
  {
    path: "/DealerProfile/AddDealerProfile",
    name: "AddDealerProfile",
    meta: {
      title: "经销商,添加",
    },
    component: () => import(/* webpackChunkName: AddDealerProfile */ "@/components/dealer/AddDealerProfile.vue"),
  },
  {
    path: "/DealerProfile/EditDealerProfile",
    name: "EditDealerProfile",
    meta: {
      title: "经销商,编辑",
    },
    component: () => import(/* webpackChunkName: EditDealerProfile */ "@/components/dealer/EditDealerProfile.vue"),
  },
  {
    path: "/DealerProfile/DealerProfileDetail",
    name: "DealerProfileDetail",
    meta: {
      title: "经销商,查看",
    },
    component: () => import(/* webpackChunkName: DealerProfileDetail */ "@/components/dealer/DealerProfileDetail.vue"),
  },
  {
    path: "/CustomerProfile",
    name: "CustomerProfile",
    meta: {
      title: "工业客户",
    },
    component: () => import(/* webpackChunkName: CustomerProfile */ "@/components/customer/CustomerProfile.vue"),
  },
  {
    path: "/CustomerGroup",
    name: "CustomerGroup",
    meta: {
      title: "客户组",
    },
    component: () => import(/* webpackChunkName: CustomerGroup */ "@/components/customerGroup/index.vue"),
  },
  {
    path: "/customerCase",
    name: "CustomerCase",
    meta: {
      title: "经销商经验分享",
    },
    component: () => import(/* webpackChunkName: CustomerCase */ "@/components/customer/customerCase.vue"),
  },
  {
    path: "/syncDataApi",
    name: "SyncDataApi",
    meta: {
      title: "数据湖同步接口监测",
    },
    component: () => import(/* webpackChunkName: SyncDataApi */ "@/components/configurationMent/syncDataApi.vue"),
  },
  {
    path: "/lubricationList",
    name: "LubricationList",
    meta: {
      title: "核心设备润滑点清单",
    },
    component: () => import(/* webpackChunkName: LubricationList */ "@/components/configurationMent/lubricationList.vue"),
  },
  {
    path: "/CustomerGroup/CustomerGroupDetail",
    name: "CustomerGroupDetail",
    meta: {
      title: "客户组,查看",
    },
    props: true,
    component: () => import(/* webpackChunkName: CustomerGroupDetail */ "@/components/customerGroup/groupDetail.vue"),
  },
  {
    path: "/CustomerProfile/AddCustomerProfile",
    name: "AddCustomerProfile",
    meta: {
      title: "工业客户,新建",
    },
    component: () => import(/* webpackChunkName: AddCustomerProfile */ "@/components/customer/AddCustomerProfile.vue"),
  },
  {
    path: "/CustomerProfile/CustomerProfileDetail",
    name: "CustomerProfileDetail",
    meta: {
      title: "工业客户,查看",
    },
    component: () => import(/* webpackChunkName: CustomerProfileDetail */ "@/components/customer/CustomerProfileDetail.vue"),
  },
  {
    path: "/CustomerProfile/EditCustomerProfile",
    name: "EditCustomerProfile",
    meta: {
      title: "工业客户,编辑",
    },
    component: () => import(/* webpackChunkName: EditCustomerProfile */ "@/components/customer/EditCustomerProfile.vue"),
  },
  {
    path: "/CustomerProfile/CustomerProfileDetail/createPopReport",
    name: "CreatePopReport",
    meta: {
      title: "工业客户,业绩证明制作报告",
    },
    component: () => import(/* webpackChunkName: CreatePopReport */ "@/components/customer/components/createPopReport.vue"),
  },
  {
    path: "/CustomerProfile/CustomerProfileDetail/createRopReport",
    name: "createRopReport",
    meta: {
      title: "工业客户,业绩参考制作报告",
    },
    component: () => import(/* webpackChunkName: createRopReport */ "@/components/customer/components/createRopReport.vue"),
  },
  {
    path: "/CustomerProfile/CustomerPesIndex",
    name: "CustomerPesIndex",
    meta: {
      title: "计划工程服务档案,查看",
    },
    component: () => import(/* webpackChunkName: CustomerPesIndex */ "@/components/pes/archives/index.vue"),
  },
  {
    path: "/CustomerProfile/CustomerPesService",
    name: "CustomerPesService",
    meta: {
      title: "服务包,查看",
    },
    component: () => import(/* webpackChunkName: CustomerPesService */ "@/components/pes/service/detail.vue"),
  },
  {
    path: "/ProductConfiguration",
    name: "ProductConfiguration",
    meta: {
      title: "油品",
    },
    component: () => import(/* webpackChunkName: ProductConfiguration */ "@/components/configurationMent/ProductConfiguration.vue"),
  },
  {
    path: "/PartsClassification",
    name: "PartsClassification",
    meta: {
      title: "部件类型",
    },
    component: () => import(/* webpackChunkName: PartsClassification */ "@/components/configurationMent/PartsClassification.vue"),
  },
  {
    path: "/IndustryEquipConfig",
    name: "IndustryEquipConfig",
    meta: {
      title: "设备类型",
    },
    component: () => import(/* webpackChunkName: IndustryEquipConfig */ "@/components/configurationMent/IndustryEquipConfig.vue"),
  },
  {
    path: "/InstrumentManagement",
    name: "InstrumentManagement",
    meta: {
      title: "便携仪器管理",
    },
    component: () => import(/* webpackChunkName: InstrumentManagement */ "@/components/instrumentManagement/instrumentManagement.vue"),
  },
  {
    path: "/emebs",
    name: "emebs",
    meta: {
      title: "EMEBS",
    },
    component: () => import(/* webpackChunkName: PortableTester */ "@/components/EMEBS/index.vue"),
  },
  {
    path: "/PortableTester",
    name: "PortableTester",
    meta: {
      title: "便携仪器列表",
    },
    component: () => import(/* webpackChunkName: PortableTester */ "@/components/PortableTester/PortableTester.vue"),
  },
  {
    path: "/PortableTester/OilTestDataDetail",
    name: "OilTestDataDetail",
    meta: {
      title: "便携仪器列表,验油数据查看",
    },
    component: () => import(/* webpackChunkName: OilTestDataDetail */ "@/components/PortableTester/oilTestDataDetail.vue"),
  },
  {
    path: "/EquipmentProfile",
    name: "EquipmentProfile",
    meta: {
      title: "设备列表",
    },
    component: () => import(/* webpackChunkName: EquipmentProfile */ "@/components/equipment/EquipmentProfile.vue"),
  },
  {
    path: "/EquipmentProfile/AddEquipmentProfile",
    name: "AddEquipmentProfile",
    meta: {
      title: "设备列表,新建",
    },
    component: () => import(/* webpackChunkName: AddEquipmentProfile */ "@/components/equipment/AddEquipmentProfile.vue"),
  },
  {
    path: "/EquipmentProfile/EquipmentBatchUpload",
    name: "EquipmentBatchUpload",
    meta: {
      title: "设备列表,批量上传",
    },
    component: () => import(/* webpackChunkName: EquipmentBatchUpload */ "@/components/equipment/EquipmentBatchUpload.vue"),
  },
  {
    path: "/EquipmentProfile/EquipmentProfileDetail",
    name: "EquipmentProfileDetail",
    meta: {
      title: "设备列表,查看",
    },
    component: () => import(/* webpackChunkName: EquipmentProfileDetail */ "@/components/equipment/EquipmentProfileDetail.vue"),
  },
  {
    path: "/EquipmentProfile/EditEquipmentProfile",
    name: "EditEquipmentProfile",
    meta: {
      title: "设备列表,编辑",
    },
    component: () => import(/* webpackChunkName: EditEquipmentProfile */ "@/components/equipment/EditEquipmentProfile.vue"),
  },
  {
    path: "/HXLubrTable",
    name: "HXLubrTable",
    meta: {
      title: "核心设备润滑油表",
    },
    component: () => import(/* webpackChunkName: HXLubrTable */ "@/components/equipment/HXLubrTable.vue"),
  },
  {
    path: "/EquipmentLubrTable",
    name: "EquipmentLubrTable",
    meta: {
      title: "设备润滑表",
    },
    component: () => import(/* webpackChunkName: EquipmentLubrTable */ "@/components/equipment/EquipmentLubrTable.vue"),
  },
  {
    path: "/LubricationPointList",
    name: "LubricationPointList",
    meta: {
      title: "润滑点列表",
    },
    component: () => import(/* webpackChunkName: LubricationPointList */ "@/components/equipment/LubricationPointList.vue"),
  },
  {
    path: "/EquipLubrListCustomer",
    name: "EquipLubrListCustomer",
    meta: {
      title: "设备润滑表",
    },
    component: () => import(/* webpackChunkName: EquipLubrListCustomer */ "@/components/equipment/EquipLubrListCustomer.vue"),
  },
  {
    path: "/EquipmentLubrTable/EquipmentLubrTableDetai",
    name: "EquipmentLubrTableDetai",
    meta: {
      title: "设备润滑表,查看",
    },
    component: () => import(/* webpackChunkName: EquipmentLubrTableDetai */ "@/components/equipment/EquipmentLubrTableDetai.vue"),
  },
  {
    path: "/EquipmentLubrTable/AddEquipmentLubrTable",
    name: "AddEquipmentLubrTable",
    meta: {
      title: "设备润滑表,新建",
    },
    component: () => import(/* webpackChunkName: AddEquipmentLubrTable */ "@/components/equipment/AddEquipmentLubrTable.vue"),
  },
  {
    path: "/EquipmentLubrTable/EditEquipmentLubrTable",
    name: "EditEquipmentLubrTable",
    meta: {
      title: "设备润滑表,编辑",
    },
    component: () => import(/* webpackChunkName: EditEquipmentLubrTable */ "@/components/equipment/AddEquipmentLubrTable.vue"),
  },
  {
    path: "/NewWorkOrderList",
    name: "NewWorkOrderList",
    meta: {
      title: "工单管理",
    },
    component: () => import(/* webpackChunkName: NewWorkOrderList */ "@/components/newWorkOrder/newWorkOrderList.vue"),
  },
  {
    path: "/servicesOverview",
    name: "servicesOverview",
    meta: {
      title: "服务概览",
    },
    component: () => import(/* webpackChunkName: servicesOverview */ "@/components/servicesOverview/index.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail",
    name: "NewWorkOrderDetail",
    meta: {
      title: "工单,查看",
    },
    component: () => import(/* webpackChunkName: NewWorkOrderDetail */ "@/components/newWorkOrder/newWorkorderDetail.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderOilDetail",
    name: "NewWorkOrderOilDetail",
    meta: {
      title: "工单,查看",
    },
    component: () => import(/* webpackChunkName: NewWorkOrderOilDetail */ "@/components/newWorkOrder/newWorkOrderOilDetail.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList",
    name: "DraftReportList",
    meta: {
      title: "工单,查看,报告草稿",
    },
    component: () => import(/* webpackChunkName: DraftReportList */ "@/components/newWorkOrder/DraftReportList.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/EditReport",
    name: "EditReport",
    meta: {
      title: "工单,查看,编辑报告",
    },
    component: () => import(/* webpackChunkName: EditReport */ "@/components/newWorkOrder/EditReport.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/FaultAnalysis",
    name: "FaultAnalysis",
    meta: {
      title: "工单,查看,编辑报告",
    },
    component: () => import(/* webpackChunkName: FaultAnalysis */ "@/components/parameterReport/faultAnalysis/index.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/oilChange",
    name: "FaultAnalysis",
    meta: {
      title: "工单,查看,编辑报告",
    },
    component: () => import(/* webpackChunkName: FaultAnalysis */ "@/components/parameterReport/oilChange/index.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/addFat",
    name: "FaultAnalysis",
    meta: {
      title: "工单,查看,编辑报告",
    },
    component: () => import(/* webpackChunkName: FaultAnalysis */ "@/components/parameterReport/addFat/index.vue"),
  },
  {
    path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/reportCommon",
    name: "FaultAnalysis",
    meta: {
      title: "工单,查看,编辑报告",
    },
    component: () => import(/* webpackChunkName: FaultAnalysis */ "@/components/parameterReport/reportCommon/index.vue"),
  },
  {
    path: "/NewWorkOrderList/NewWorkorderTaskDetail",
    name: "NewWorkorderTaskDetail",
    meta: {
      title: "工单,查看",
    },
    component: () => import(/* webpackChunkName: NewWorkorderTaskDetail */ "@/components/newWorkOrder/newWorkorderTaskDetail.vue"),
  },
  {
    path: "/NewWorkOrderList/NewWorkorderTaskDetail/InformationFillNew",
    name: "InformationFillNew",
    meta: {
      title: "工单,信息填写,设备润滑调查表填写",
    },
    component: () => import(/* webpackChunkName: InformationFillNew */ "@/components/newWorkOrder/informationFillNew.vue"),
  },
  {
    path: "/NewWorkOrderList/AddWorkOrder",
    name: "AddWorkOrder",
    meta: {
      title: "工单,创建",
    },
    component: () => import(/* webpackChunkName: AddWorkOrder */ "@/components/newWorkOrder/AddWorkOrder.vue"),
  },
  {
    path: "/NewWorkOrderList/AddWorkOrderOil",
    name: "AddWorkOrderOil",
    meta: {
      title: "工单,创建",
    },
    component: () => import(/* webpackChunkName: AddWorkOrderOil */ "@/components/newWorkOrder/AddWorkOrderOil.vue"),
  },
  {
    path: "/MyTeam",
    name: "MyTeam",
    meta: {
      title: "我的团队",
    },
    component: () => import(/* webpackChunkName: MyTeam */ "@/components/myTeam/index.vue"),
  },
  {
    path: "/Workshop",
    name: "Workshop",
    meta: {
      title: "车间管理",
    },
    component: () => import(/* webpackChunkName: Workshop */ "@/components/workshop/index.vue"),
  },
  {
    path: "/AccountManagement",
    name: "AccountManagement",
    meta: {
      title: "账号",
    },
    component: () => import(/* webpackChunkName: AccountManagement */ "@/components/authorityManagement/AccountManagement.vue"),
  },
  {
    path: "/ChartDefinition",
    name: "ChartDefinition",
    meta: {
      title: "图表定义",
    },
    component: () => import(/* webpackChunkName: ChartDefinition */ "@/components/chartDefinition/index.vue"),
  },
  {
    path: "/RoleList",
    name: "RoleList",
    meta: {
      title: "角色",
    },
    component: () => import(/* webpackChunkName: RoleList */ "@/components/authorityManagement/RoleList.vue"),
  },
  {
    path: "/SystemFile",
    name: "SystemFile",
    meta: {
      title: "系统文件",
    },
    component: () => import(/* webpackChunkName: SystemFile */ "@/components/authorityManagement/SystemFile.vue"),
  },
  {
    path: "/IotManagement",
    name: "IotManagement",
    meta: {
      title: "设备管理",
    },
    component: () => import(/* webpackChunkName: IotManagement */ "@/components/iot/equipmentMannagement.vue"),
  },
  {
    path: "/IotManagement/IotConfiguration",
    name: "IotConfiguration",
    meta: {
      title: "设备管理,管理",
    },
    component: () => import(/* webpackChunkName: IotConfiguration */ "@/components/iot/IotConfiguration.vue"),
  },
  {
    path: "/Record",
    name: "Record",
    meta: {
      title: "短信日志",
    },
    component: () => import(/* webpackChunkName: Record */ "@/components/iot/record.vue"),
  },
  {
    path: "/IotManagement/lubricatepointRecord",
    name: "lubricatepointRecord",
    meta: {
      title: "设备管理,润滑点日志",
    },
    component: () => import(/* webpackChunkName: lubricatepointRecord */ "@/components/iot/lubricatepointRecord.vue"),
  },
  {
    path: "/IotManagement/MonitoringData",
    name: "MonitoringData",
    meta: {
      title: "设备管理,数据监测",
    },
    component: () => import(/* webpackChunkName: MonitoringData */ "@/components/iot/MonitoringData.vue"),
  },
  {
    path: "/updateLog",
    name: "updateLog",
    meta: {
      title: "更新日志",
    },
    component: () => import(/* webpackChunkName: updateLog */ "@/components/updateLog/index.vue"),
  },
  {
    path: "/feedback",
    name: "feedback",
    meta: {
      title: "意见反馈",
    },
    component: () => import(/* webpackChunkName: feedback */ "@/components/feedback/index.vue"),
  },
  {
    path: "/Notice",
    name: "Notice",
    meta: {
      title: "公告与弹窗",
    },
    component: () => import(/* webpackChunkName: Notice */ "@/components/notice/Notice.vue"),
  },
  {
    path: "/Notice/AddNotice",
    name: "AddNotice",
    meta: {
      title: "公告,新建",
    },
    component: () => import(/* webpackChunkName: AddNotice */ "@/components/notice/AddNotice.vue"),
  },
  {
    path: "/Notice/EditNotice",
    name: "EditNotice",
    meta: {
      title: "公告,编辑",
    },
    component: () => import(/* webpackChunkName: EditNotice */ "@/components/notice/EditNotice.vue"),
  },
  {
    path: "/Notice/NoticeDetail",
    name: "NoticeDetail",
    meta: {
      title: "公告,查看",
    },
    component: () => import(/* webpackChunkName: NoticeDetail */ "@/components/notice/NoticeDetail.vue"),
  },
  {
    path: "/MenuList",
    name: "MenuList",
    meta: {
      title: "菜单",
    },
    component: () => import(/* webpackChunkName: MenuList */ "@/components/authorityManagement/MenuList.vue"),
  },
  {
    path: "/GoodsManagement",
    name: "GoodsManagement",
    meta: {
      title: "商品管理",
    },
    component: () => import(/* webpackChunkName: GoodsManagement */ "@/components/goodsManagement/goodsManagement.vue"),
  },
  {
    path: "/GoodsManagement/EditGoods",
    name: "EditGoods",
    meta: {
      title: "商品管理,编辑",
    },
    component: () => import(/* webpackChunkName: EditGoods */ "@/components/goodsManagement/editGoods.vue"),
  },
  {
    path: "/GoodsManagement/LookGoods",
    name: "LookGoods",
    meta: {
      title: "商品管理,查看",
    },
    component: () => import(/* webpackChunkName: LookGoods */ "@/components/goodsManagement/lookGoods.vue"),
  },
  {
    path: "/OrderManagement",
    name: "OrderManagement",
    meta: {
      title: "订单管理",
    },
    component: () => import(/* webpackChunkName: OrderManagement */ "@/components/orderManagement/orderManagement.vue"),
  },
  {
    path: "/OrderManagement/LookOrderDetail",
    name: "LookOrderDetail",
    meta: {
      title: "订单管理,查看",
    },
    component: () => import(/* webpackChunkName: LookOrderDetail */ "@/components/orderManagement/lookOrderDetail.vue"),
  },
  {
    path: "/MlsaClause",
    name: "MlsaClause",
    meta: {
      title: "美孚优释达SM油品分析服务网站使用条款和条件",
    },
    component: () => import(/* webpackChunkName: MlsaClause */ "@/components/orderManagement/mlsaClause.vue"),
  },
  {
    path: "/MslaB2BClause",
    name: "MslaB2BClause",
    meta: {
      title: "埃克森美孚企业业务（“B2B”）特殊价格申请及管理规定",
    },
    component: () => import(/* webpackChunkName: MslaB2BClause */ "@/components/orderManagement/mlsaClause.vue"),
  },
  {
    path: "/OrderHint",
    name: "OrderHint",
    meta: {
      title: "服务使用条款",
    },
    component: () => import(/* webpackChunkName: OrderHint */ "@/components/orderManagement/orderHint.vue"),
  },
  {
    path: "/userHelp",
    name: "userHelp",
    meta: {
      title: "用户帮助",
    },
    component: () => import(/* webpackChunkName: userHelp */ "@/components/userHelp/userHelp.vue"),
  },
  {
    path: "/userHelp/editUserHelp",
    name: "editUserHelp",
    meta: {
      title: "用户帮助,分类",
    },
    component: () => import(/* webpackChunkName: editUserHelp */ "@/components/userHelp/userHelpEdit.vue"),
  },
  {
    path: "/userHelp/createUserHelpContent",
    name: "createUserHelpContent",
    props: true,
    meta: {
      title: "用户帮助,新建帮助",
    },
    component: () => import(/* webpackChunkName: createUserHelpContent */ "@/components/userHelp/createUserHelpContent.vue"),
  },
  {
    path: "/userHelpDisplay",
    name: "userHelpDisplay",
    meta: {
      title: "用户帮助",
    },
    component: () => import(/* webpackChunkName: userHelpDisplay */ "@/components/userHelp/userHelpDisplay.vue"),
  },
  {
    path: "/taskManagement",
    name: "taskManagement",
    meta: {
      title: "待办任务",
    },
    component: () => import(/* webpackChunkName: taskManagement */ "@/components/taskManagement/index.vue"),
  },
  {
    path: "/taskManagement/taskDetail",
    name: "taskDetail",
    meta: {
      title: "待办任务,任务详情",
    },
    component: () => import(/* webpackChunkName: taskDetail */ "@/components/taskManagement/taskDetail.vue"),
  },
  {
    path: "/OilAnalyse",
    name: "OilAnalyse",
    meta: {
      title: "用油数据统计,详情",
    },
    component: () => import(/* webpackChunkName: OilAnalyse */ "@/components/taskManagement/OilAnalyse.vue"),
  },
  {
    path: "/QrManagement",
    name: "QrManagement",
    meta: {
      title: "设备二维码管理",
    },
    component: () => import(/* webpackChunkName: QrManagement */ "@/components/qrManagement/qrManagement.vue"),
  },
  {
    path: "/QrManagement/QrManagementDetail",
    name: "QrManagementDetail",
    meta: {
      title: "二维码管理,查看",
    },
    component: () => import(/* webpackChunkName: QrManagementDetail */ "@/components/qrManagement/qrManagementDetail.vue"),
  },
  {
    path: "/EnglishTranslation",
    name: "EnglishTranslation",
    meta: {
      title: "MSLA英文翻译",
    },
    component: () => import(/* webpackChunkName: EnglishTranslation */ "@/components/englishTranslation/englishTranslation.vue"),
  },
  {
    path: "/OperationRecord",
    name: "OperationRecord",
    meta: {
      title: "操作日志",
    },
    component: () => import(/* webpackChunkName: OperationRecord */ "@/components/authorityManagement/OperationRecord.vue"),
  },
  {
    path: "/Advertisement",
    name: "Advertisement",
    meta: {
      title: "首页-广告位",
    },
    component: () => import(/* webpackChunkName: Advertisement */ "@/components/advertisement/advertisement.vue"),
  },
  {
    path: "/Train",
    name: "Train",
    meta: {
      title: "知识学堂",
    },
    component: () => import(/* webpackChunkName: Train */ "@/components/train/train.vue"),
  },
  {
    path: "/FDFormula",
    name: "FDFormula",
    meta: {
      title: "FD配方披露配置",
    },
    component: () => import(/* webpackChunkName: FDFormula */ "@/components/FdFormula/FdFormula.vue"),
  },
  {
    path: "/FDFormulaApply",
    name: "FDFormulaApply",
    meta: {
      title: "配方披露和常用证书申请",
    },
    component: () => import(/* webpackChunkName: FDFormulaApply */ "@/components/FdFormula/FdFormulaApply.vue"),
  },
  {
    path: "/Train/EditTrain",
    name: "EditTrain",
    meta: {
      title: "培训列表,新建培训",
    },
    component: () => import(/* webpackChunkName: EditTrain */ "@/components/train/editTrain.vue"),
  },
  {
    path: "/PESIndex",
    name: "PESIndex",
    meta: {
      title: "计划工程服务档案,查看",
    },
    component: () => import(/* webpackChunkName: PESIndex */ "@/components/pes/archives/index.vue"),
  },
  {
    path: "/PESIndex/serviceDetail",
    name: "ServiceDetail",
    meta: {
      title: "服务包,查看",
    },
    component: () => import(/* webpackChunkName: ServiceDetail */ "@/components/pes/service/detail.vue"),
  },
  {
    path: "/CustomerProfile/servicePlan",
    name: "ServicePlan",
    meta: {
      title: "计划工程服务档案,计划书",
    },
    component: () => import(/* webpackChunkName: ServicePlan */ "@/components/pes/service/plan.vue"),
  },
  {
    path: "/CustomerProfile/serviceSummary",
    name: "serviceSummary",
    meta: {
      title: "计划工程服务档案,年度总结",
    },
    component: () => import(/* webpackChunkName: serviceSummary */ "@/components/pes/service/summary.vue"),
  },
  {
    path: "/CustomerProfile/serviceBenefitSummary",
    name: "serviceBenefitSummary",
    meta: {
      title: "计划工程服务档案,效益总结报告",
    },
    component: () => import(/* webpackChunkName: serviceBenefitSummary */ "@/components/pes/service/benefitSummary.vue"),
  },
  {
    path: "/CustomerProfile/benefitReport",
    name: "benefitReport",
    meta: {
      title: "工业客户,效益报告",
    },
    component: () => import(/* webpackChunkName: benefitReport */ "@/components/pes/service/benefitReport.vue"),
  },
  {
    path: "/PESService",
    name: "PESService",
    meta: {
      title: "计划工程服务档案",
    },
    component: () => import(/* webpackChunkName: PESService */ "@/components/pes/service/index.vue"),
  },
  {
    path: "/PESService/addService",
    name: "addService",
    meta: {
      title: "服务包,创建",
    },
    component: () => import(/* webpackChunkName: addService */ "@/components/pes/service/addService.vue"),
  },
  {
    path: "/PESService/editService",
    name: "editService",
    meta: {
      title: "服务包,编辑",
    },
    component: () => import(/* webpackChunkName: editService */ "@/components/pes/service/addService.vue"),
  },
  {
    path: "/PESService/editServiceBatch",
    name: "editServiceBatch",
    meta: {
      title: "服务包,编辑",
    },
    component: () => import(/* webpackChunkName: editServiceBatch */ "@/components/pes/service/serviceBatchOperation.vue"),
  },
  {
    path: "/PESService/serviceDetail",
    name: "serviceDetail",
    meta: {
      title: "服务包,查看",
    },
    component: () => import(/* webpackChunkName: serviceDetail */ "@/components/pes/service/detail.vue"),
  },
  {
    path: "/ReportManagement",
    name: "ReportManagement",
    meta: {
      title: "工单报告",
    },
    component: () => import(/* webpackChunkName: ReportManagement */ "@/components/reportManagement/reportManagement.vue"),
  },
  {
    path: "/RecordManagement",
    name: "RecordManagement",
    meta: {
      title: "日志管理",
    },
    component: () => import(/* webpackChunkName: RecordManagement */ "@/components/RecordManagement/RecordManagement.vue"),
  },
  {
    path: "/BenchmarkAndCompatibility",
    name: "BenchmarkAndCompatibility",
    meta: {
      title: "对标产品&相容性查询",
    },
    component: () => import(/* webpackChunkName: BenchmarkAndCompatibility */ "@/components/benchmarkAndCompatibility/index.vue"),
  },
  {
    path: "/CoredataLubri",
    name: "CoredataLubri",
    meta: {
      title: "核心设备润滑油表",
    },
    component: () => import(/* webpackChunkName: CoredataLubri */ "@/components/configure/coredataLubri.vue"),
  },
  {
    path: "/LubriDiagConfig",
    name: "LubriDiagConfig",
    meta: {
      title: "润滑调查配置",
    },
    component: () => import("@/components/configure/lubriDiagConfig.vue"),
  },
  {
    path: "/CheckItemConfig",
    name: "CheckItemConfig",
    meta: {
      title: "润滑检查项目配置",
    },
    component: () => import("@/components/configure/checkItemConfig.vue"),
  },
  {
    path: "/ServiceGuideConfig",
    name: "ServiceGuideConfig",
    meta: {
      title: "润滑指引配置",
    },
    component: () => import("@/components/configure/serviceGuideConfig.vue"),
  },
  {
    path: "/PopConfig",
    name: "PopConfig",
    meta: {
      title: "业绩证明报告-客户图片配置",
    },
    component: () => import(/* webpackChunkName: CoredataLubri */ "@/components/configurationMent/popConfig.vue"),
  },
  {
    path: "/deviceInfoDoc",
    name: "deviceInfoDoc",
    meta: {
      title: "设备公共资料",
    },
    component: () => import(/* webpackChunkName: deviceInfoDoc */ "@/components/deviceDocument/index.vue"),
  },
  {
    path: "/ConfigToolkitData",
    name: "ConfigToolkitData",
    meta: {
      title: "计算工具配置",
    },
    component: () => import(/* webpackChunkName: ConfigToolkitData */ "@/components/toolkit/index.vue"),
  },
  {
    path: "/toolkitTable",
    name: "toolkitTable",
    meta: {
      whiteList: true,
    },
    component: () => import(/* webpackChunkName: toolkitTable */ "@/components/toolkit/wechat/toolkitTable.vue"),
  },
  {
    path: "/toolkitChart",
    name: "toolkitChart",
    meta: {
      whiteList: true,
    },
    component: () => import(/* webpackChunkName: toolkitChart */ "@/components/toolkit/wechat/toolkitChart.vue"),
  },
  {
    path: "/LubricationTrain",
    name: "LubricationTrain",
    meta: {
      title: "润滑知识学堂",
    },
    component: () => import(/* webpackChunkName: LubricationTrain */ "@/components/lubricationAssistant/lubricationTrain/index.vue"),
  },
  {
    path: "/LubQA",
    name: "LubQA",
    meta: {
      title: "润滑常见问答",
    },
    component: () => import(/* webpackChunkName: LubQA */ "@/components/lubricationAssistant/LubricationQA/index.vue"),
  },
  {
    path: "/LubQAConfigure",
    name: "LubQAConfigure",
    meta: {
      title: "润滑常见问答",
    },
    component: () => import(/* webpackChunkName: LubQAConfigure */ "@/components/lubricationAssistant/LubricationQAConfigure/index.vue"),
  },
  {
    path: "/LubQAConfigure/LubQAConfigureDetail",
    name: "LubQAConfigureDetail",
    meta: {
      title: "润滑常见问答,详情",
    },
    component: () => import(/* webpackChunkName: LubQAConfigureDetail */ "@/components/lubricationAssistant/LubricationQAConfigure/LubConfigureDetail/index.vue"),
  },
  {
    path: "/LubQAConfigure/LubQAConfigureClassify",
    name: "LubQAConfigureClassify",
    meta: {
      title: "润滑常见问答,详情,设置分类",
    },
    component: () => import(/* webpackChunkName: LubQAConfigureClassify */ "@/components/lubricationAssistant/LubricationQAConfigure/LubQAClassify/index.vue"),
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
    path: "/Tableau",
    name: "Tableau",
    meta: {
      title: "Tableau",
    },
    component: () => import(/* webpackChunkName: Tableau */ "@/components/Tableau/index.vue"),
  },
  {
    path: "/authConfig",
    name: "authConfig",
    meta: {
      title: "权限配置",
    },
    component: () => import(/* webpackChunkName: authConfig */ "@/components/auth/authConfig/index.vue"),
  },
  {
    path: "/roleConfig",
    name: "roleConfig",
    meta: {
      title: "角色配置",
    },
    component: () => import(/* webpackChunkName: roleConfig */ "@/components/auth/roleConfig/index.vue"),
  },
  {
    path: "/notFoundPage",
    name: "notFoundPage",
    meta: {
      whiteList: true,
    },
    component: () => import(/* webpackChunkName: notFoundPage */ "@/components/404.vue"),
  },
  {
    path: "/distributorCaseIndex/Create",
    name: "casePresentationCreate",
    meta: {
      title: "优秀服务案例提报,新建",
    },
    component: () => import(/* webpackChunkName: create */ "@/components/casePresentation/create.vue"),
  },
  // 经销商查看
  {
    path: "/distributorCaseIndex/caseDetail",
    name: "casePresentationCaseDetail",
    meta: {
      title: "优秀案例提报,查看",
    },
    component: () => import(/* webpackChunkName: caseDetail */ "@/components/casePresentation/caseDetail.vue"),
  },
  {
    path: "/distributorCaseIndex",
    name: "distributorCaseIndex",
    meta: {
      title: "优秀案例提报",
    },
    component: () => import(/* webpackChunkName: distributorCaseIndex */ "@/components/casePresentation/distributorCaseIndex.vue"),
  },
  // 区域负责人查看
  {
    path: "/areaManagerIndex/caseDetail",
    name: "casePresentationCaseDetail",
    meta: {
      title: "优秀服务案例提报,查看",
    },
    component: () => import(/* webpackChunkName: caseDetail */ "@/components/casePresentation/caseDetail.vue"),
  },
  {
    path: "/areaManagerIndex",
    name: "areaManagerIndex",
    meta: {
      title: "优秀服务案例提报",
    },
    component: () => import(/* webpackChunkName: areaManagerIndex */ "@/components/casePresentation/areaManagerIndex.vue"),
  },
  // 美孚管理员查看
  {
    path: "/adminCaseIndex/caseDetail",
    name: "casePresentationCaseDetail",
    meta: {
      title: "优秀服务案例提报,查看",
    },
    component: () => import(/* webpackChunkName: caseDetail */ "@/components/casePresentation/caseDetail.vue"),
  },
  {
    path: "/adminCaseIndex",
    name: "adminCaseIndex",
    meta: {
      title: "优秀服务案例提报&推选",
    },
    component: () => import(/* webpackChunkName: adminCaseIndex */ "@/components/casePresentation/adminCaseIndex.vue"),
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
