import { cat } from "shelljs";
import { fullScreen_loading } from "../../../generalComponents/fullScreenLoading";
import OSSClient from "../../../utils/ossClient";
const oss_client = new OSSClient();
export default {
  data() {
    return {
      isExecuteRoleFlag: false,
      chooseDeviceAndLupDialog: false,
      urlType: "workOrder",
      taskType: "check",
      coreTemplateOptimzieFlagRoles: ["fes", "ace-fes", "admin"],
      plantStudyServiceFlag: false,
      checkedDevice: [],
      userInfo: {},
      submitDetail: {},
      exceptDetail: {},
      loadingPerson: false,
      reportFlag: false, // 报告列表
      uploadUrl: `${process.env.api}/weChat/workOrder/service/report/upload`,
      mainminheight: `height:${document.documentElement.clientHeight - 136}px`,
      mainminFormheight: `height:${document.documentElement.clientHeight - 236}px`,
      mainminProcessheight: `height:${document.documentElement.clientHeight - 276}px`,
      textarea: "",
      groupList: [], // 登陆人是否在工作组中
      imageList: [],
      loadingLum: false,
      lumData: [], // 工单中的润滑点列表
      searchLumResult: false, // 查询工单中的润滑点
      searchLumCont: "",
      pictureDtoList: [],
      distributionPerson: {}, // 分配人
      serviceData: [], // 工单中的服务报告列表
      lumDataCustomer: [], // 客户的润滑点列表
      lumDataCustomers: [], // 客户的润滑点列表
      addLubricationPointsVisiable: false, // 调查任务弹框
      editWorkorderVisisble: false, // 编辑工单信息
      addWorkGroupsVisiable: false, // 添加人员弹框
      executePersonNameVisiable: false, // 重新分配弹框
      finishWorkorder: false, // 完结工单弹框
      totalDraftCount: 0,
      unPublicDraftCount: 0,
      finishAllWorkorder: false, // 是否同步完成服务申请弹框
      lubrtotalCount: 0,
      lumTotalNum: 0,
      popover: "popover-", // popover ref名称前缀
      lubricationPointsSearch: "", // 筛选润滑点
      queryParams: {
        taskName: "",
        lDOName: "",
        selectGroupId: []
      },
      //  润滑点分页参数
      pagenationLum: {
        current: 1,
        size: 5
      },
      starId: 0,
      PESpackageBtn: false,
      starCount: 0,
      formRemark: {
        remark: "" // 评价
      },
      isRequire: false, // 是否必填
      scoreRemark: "服务已完成，请为该服务打分",
      loading: false, //是否展示加载动画，默认隐藏
      totalNumber: 0, //总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 5
      },
      //  服务报告分页参数
      pagenationService: {
        current: 1,
        size: 100
      },
      pagenationWorkPerson: {
        current: 1,
        size: 10
      },
      pagenationLumCustomer: {
        current: 1,
        size: 30
      },
      // 工单信息
      woInfo: {},
      //表单验证
      ruleForm: {
        close: 0,
        text: "" //关闭原因
      },
      ruleForm1: {
        expectComingTime: "",
        contactMapAddress: "",
        shortDesc: "",
        serviceProperty: [],
        incomeBbl: "",
        incomeRmb: ""
      },
      ruleForm1rules: {
        expectComingTime: [{ required: true, message: "请选择预约时间", trigger: "blur" }],
        serviceProperty: [{ required: true, message: "请选择服务属性", trigger: "change" }]
      },
      serviceIncomeComponentType: "editOrder",
      closeList: [{ value: "0", label: "取消预约" }, { value: "1", label: "内容填写错误" }, { value: "2", label: "重复提交" }, { value: "3", label: "其他" }],
      workGroupList: [], // 工作组人员
      numbers: [], // 工作组人员编码
      woTableData2: [],
      addPerson: [],
      engineerInfoList: [], // 点击添加人员获取列表
      showWorkGroupFlag: false, // 是否展示工作组人员
      dialogFormVisible: false, //是否显示关闭说明，默认隐藏
      dialogTableVisibleWO: false, //是否展示工单跟踪，默认隐藏
      reportList: [], //服务报告
      pageIndexDistributive: 1, // 有分配人员列表 current
      originalExecuteUserNumber: "", // 原先分配人的编码
      loadMoreData: false,
      engineerInfoToatl: 0,
      loadMoreBon: false,
      userOrRoleName: "",
      sopFileRow: "",
      loadAddLum: false,
      lubricationPointNumbers: [],
      seleLumsAllMsg: [],
      addLums: [],
      contactDetail: {},
      uploadDetail: {},
      lubricationPointNumbersNew: [],
      lubricationPointNumbersNewArr: [],
      selectLums: [],
      roleNamesStr: "",
      EquipmentProfilBtn: false,
      // 分组
      deviceGroupList: [],
      headerHeight: null,
      screenWidth: null,
      loadingPersonGroup: false,
      isCoreInfoFlag: false,
      sysAttachmentList: [],
      coreInfoId: null,
      chooseLupDialogKey: 1,
      up_disabled: false,
      roleFlag: false,
      applyMsgDialog: false,
      executeRoleFlag: false,
      showCreateCaseBtn: false,
      revocationCaseType: 0
    };
  },
  mounted() {
    this.$_getWOInfo(this.$route.query.workOrderNumber);
    this.$_getLumData(this.$route.query.workOrderNumber); // 获取工单的润滑点列表
    this.$_getServiceData(this.$route.query.workOrderNumber); // 获取工单的服务报告列表
    this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度
    this.screenWidth = document.body.clientWidth;
    var headerEl = document.getElementById("header");
    this.headerHeight = headerEl.offsetHeight;
    let mainHight = document.documentElement.clientHeight - 136;
    this.mainminheight = `height:${document.documentElement.clientHeight - 136}px`;
    this.mainminFormheight = `height:${mainHight - this.headerHeight - 60}px`;
    this.mainminProcessheight = `height:${mainHight - this.headerHeight - 160}px`;
    this.roleFlag = this.userInfo.accessTemplates.some(role => {
      return this.coreTemplateOptimzieFlagRoles.includes(role.accessTemplateCode);
    });
    window.onresize = () => {
      return (() => {
        mainHight = document.documentElement.clientHeight - 136;
        this.screenWidth = document.body.clientWidth;
        this.mainminheight = `height:${document.documentElement.clientHeight - 136}px`;
        this.headerHeight = headerEl.offsetHeight;
        // 右边润滑点/服务报告/工作组所占高度
        let height = mainHight - this.headerHeight - 60;
        this.mainminFormheight = `height:${height}px`;
        this.mainminProcessheight = `height:${mainHight - this.headerHeight - 160}px`;
      })();
    };
  },

  created() {
    this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")));
    console.log("this.userInfo", this.userInfo);
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("menuList"));
    let btnStr;
    for (let i in buttonpermsStr) {
      let item = buttonpermsStr[i];
      if (item.menuCode == "PESpackage_web") {
        this.PESpackageBtn = true;
      }
      if (item.menuCode == "FirstDevice") {
        btnStr = item.children;
      }
    }
    if (btnStr.length > 0) {
      for (let i in btnStr) {
        let item = btnStr[i];
        if (item.menuCode == "EquipmentProfil") {
          this.EquipmentProfilBtn = true;
        }
      }
    }
  },
  methods: {
    coreInfoUploadFile() {
      this.$confirm("您将选择上传报告，填写核心信息并上传报告后方可完结工单，是否确定？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestMethodGet("/weChat/workOrder/makeReportType", { coreDataStatus: 2, id: this.woInfo.id }).then(res => {
            if (res.data.code == 1000) {
              this.$_getWOInfo(this.$route.query.workOrderNumber);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    getCoreInfoId(coreInfoId) {
      this.coreInfoId = coreInfoId;
    },
    uploadSuccess(list) {
      this.sysAttachmentList = list;
    },
    saveSuccess(coreInfoId, val) {
      console.log(coreInfoId, val);
      this.coreInfoId = coreInfoId;
      if (val == "parent") {
        this.checkHandleWorkOrder();
      }

      this.$_getWOInfo(this.$route.query.workOrderNumber);
      this.$_getLumData(this.$route.query.workOrderNumber); // 获取工单的润滑点列表
      this.$_getServiceData(this.$route.query.workOrderNumber); // 获取工单的服务报告列表
      this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度
      console.log(1222333);
    },
    getGroupList() {
      if (!this.woInfo.companyId) {
        return;
      }
      const params = {
        companyId: this.woInfo.companyId
      };
      this.requestMethodGet("/weChat/deviceGroup/getDeviceGroupTree", params).then(res => {
        if (res.data.code == 1000) {
          this.deviceGroupList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 新建设备
    handleAddDevice() {
      let routeUrl = this.$router.resolve({
        path: "/EquipmentProfile/AddEquipmentProfile",
        query: { companyNumber: this.woInfo.contactCompanyNumber, workshopId: this.woInfo.workshopId, companyId: this.woInfo.companyId }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 刷新润滑点数据
    handleRefresh() {
      this.$_getCustomerLumData("first");
    },
    handlePesDetail() {
      this.$router.push({
        path: "/CustomerProfile/CustomerPesIndex",
        query: {
          pesInfoId: this.woInfo.pesInfoId,
          companyNumber: this.woInfo.contactCompanyNumber,
          resurce: "workOrder",
          companyId: this.woInfo.companyId
        }
      });
    },
    // 跳转设备详情
    toDeviceDetail(row) {
      if (row.delFlag) {
        this.$message({
          message: "润滑点已被删除，无法访问",
          type: "warning"
        });
      } else {
        if (this.userInfo.userType == 2) {
          this.canGetDevice(row.deviceNumber);
        } else {
          // 判断是否有查看客户设备详情权限
          if (this.EquipmentProfilBtn) {
            this.$router.push({
              path: "/EquipmentProfile/EquipmentProfileDetail",
              query: {
                deviceNumber: row.deviceNumber
              }
            });
          } else {
            this.$message({
              message: "当前账号权限不足",
              type: "warning"
            });
          }
        }
      }
    },
    checkedSelectLum(row, index) {
      if (this.lubricationPointNumbersNewArr.length > 0) {
        return !this.lubricationPointNumbersNewArr.includes(row.lubricationPointNumber);
      } else {
        return true;
      }
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.userId;
    },

    groupItem(val) {
      this.roleNamesStr = val.roleNames.toString();
    },
    showPopver() {
      this.getUserDetail("contact");
    },
    showPopverSubmit() {
      this.getUserDetail("submit");
    },
    showPopverExecute() {
      this.getUserDetail("except");
    },
    executePersonDetail(val) {
      this.uploadDetail = {};
      if (val.createUserNumber) {
        let param = {
          userNumber: val.createUserNumber
        };
        this.requestMethodGet("/workOrder/getWorkOrderUser", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              let refName = this.popover + val.id;
              if (res.data) {
                this.$refs[refName][0].doShow();
                this.uploadDetail = res.data;
                if (this.uploadDetail.avatar) {
                  this.getFullUrl(this.uploadDetail.avatar, "upload");
                }
                if (this.uploadDetail.roleNames) {
                  this.uploadDetail.roleNames = this.uploadDetail.roleNames.join(",");
                }
                if (this.uploadDetail.phonenumber) {
                  this.uploadDetail.phonenumber = this.uploadDetail.phonenumber.substr(0, 3) + " " + this.uploadDetail.phonenumber.substr(3, 4) + " " + this.uploadDetail.phonenumber.substr(7, 4);
                }
              } else {
                this.$refs[refName][0].doClose();
                this.$message({
                  message: "人员不存在",
                  type: "warning"
                });
              }
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    // 获取头像全路径
    getFullUrl(val, cont) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          if (cont) {
            this.uploadDetail.headUrl = res.data;
          } else {
            this.contactDetail.headUrl = res.data;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消添加成员
    handleResetAdd() {
      this.addWorkGroupsVisiable = false;
    },
    // 获取客户联系人详情
    getUserDetail(val) {
      if (val == "contact") {
        if (this.woInfo.contactNumber) {
          let param = {
            userNumber: this.woInfo.contactNumber
          };
          this.requestMethodGet("/workOrder/getWorkOrderUser", param)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                if (res.data) {
                  this.$refs.popoverContact.doShow();
                  this.contactDetail = res.data;
                  if (this.contactDetail.avatar) {
                    this.getFullUrl(this.contactDetail.avatar);
                  }
                  if (this.contactDetail.roleNames) {
                    this.contactDetail.roleNames = this.contactDetail.roleNames.join(",");
                  }
                  if (this.contactDetail.phonenumber) {
                    this.contactDetail.phonenumber =
                      this.contactDetail.phonenumber.substr(0, 3) + " " + this.contactDetail.phonenumber.substr(3, 4) + " " + this.contactDetail.phonenumber.substr(7, 4);
                  }
                } else {
                  this.$refs.popoverContact.doClose();
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      } else if (val == "submit") {
        if (this.woInfo.submitPersonNumber) {
          let param = {
            userNumber: this.woInfo.submitPersonNumber
          };
          this.requestMethodGet("/workOrder/getWorkOrderUser", param)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                if (res.data) {
                  this.$refs.popoverSubmit.doShow();
                  this.submitDetail = res.data;
                  if (this.submitDetail.avatar) {
                    this.getFullUrl(this.submitDetail.avatar);
                  }
                  if (this.submitDetail.roleNames) {
                    this.submitDetail.roleNames = this.submitDetail.roleNames.join(",");
                  }
                  if (this.submitDetail.phonenumber) {
                    this.submitDetail.phonenumber = this.submitDetail.phonenumber.substr(0, 3) + " " + this.submitDetail.phonenumber.substr(3, 4) + " " + this.submitDetail.phonenumber.substr(7, 4);
                  }
                } else {
                  this.$refs.popoverSubmit.doClose();
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      } else if (val == "except") {
        if (this.woInfo.executePersonNumber) {
          let param = {
            userNumber: this.woInfo.executePersonNumber
          };
          this.requestMethodGet("/workOrder/getWorkOrderUser", param)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                if (res.data) {
                  this.$refs.popoverExecute.doShow();
                  this.exceptDetail = res.data;
                  if (this.exceptDetail.avatar) {
                    this.getFullUrl(this.exceptDetail.avatar);
                  }
                  if (this.exceptDetail.roleNames) {
                    this.exceptDetail.roleNames = this.exceptDetail.roleNames.join(",");
                  }
                  if (this.exceptDetail.phonenumber) {
                    this.exceptDetail.phonenumber = this.exceptDetail.phonenumber.substr(0, 3) + " " + this.exceptDetail.phonenumber.substr(3, 4) + " " + this.exceptDetail.phonenumber.substr(7, 4);
                  }
                } else {
                  this.$refs.popoverExecute.doClose();
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      }
    },
    // 查询工单内润滑点
    handleSearchLumData(val) {
      this.searchLumCont = val;
      this.$_getLumData(this.$route.query.workOrderNumber, this.searchLumCont);
    },
    // 预览文件
    perviewFile(item) {
      if (item.fileType == "pdf") {
        window.open(item.attachmentUrl);
      } else {
        window.open(item.attachmentUrl4Download);
      }
    },
    // 下载文件
    downLoadService(item) {
      this.$gio.downloadServiceReport_workorder({
        workOrderNumber: this.$route.query.workOrderNumber,
        operation: "工单详情页点击下载按钮"
      });
      window.open(item.attachmentUrl4Download);
    },
    // 删除服务报告
    deleteReport(item) {
      this.$confirm("文件删除后无法恢复, 是否删除?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let param = {
            id: item.id,
            workOrderNumber: this.$route.query.workOrderNumber,
            reportType: this.woInfo.reportType
          };
          this.requestMethodGet("/workOrder/deleteReport", param)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$_getServiceData(this.$route.query.workOrderNumber);
                this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$gio.deleteServiceReport({
                  workorderNumber: this.$route.query.workOrderNumber,
                  operation: "工单详情页点击删除按钮"
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    //   上传文件
    handleReportChange(file, fileList) {
      if (!file.raw.type.startsWith("application")) {
        fileList.pop();
        this.$message.error("只能上传pdf / word / excel / ppt 类型文件");
        return;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "请选择100M以内的文件"
        });
        return;
      }
      this.sopFileRow = file.raw;
    },
    // 上传报告
    handleUploadForm(param) {
      if (
        this.isCoreInfoFlag &&
        ((this.woInfo.coreDataStatus == 2 && this.woInfo.coreDataTemplateId && this.woInfo.reportType) ||
          (this.woInfo.coreDataTemplateId && !this.woInfo.reportType && !this.woInfo.coreDataStatus && this.isCoreInfoFlag)) &&
        (this.woInfo.executePersonRoleCodes.includes("admin") || this.woInfo.executePersonRoleCodes.includes("fes") || this.woInfo.executePersonRoleCodes.includes("ace-fes"))
      ) {
        this.handlCoreUpload(param);
      } else {
        let formData = new FormData();
        formData.append("workOrderNumber", this.$route.query.workOrderNumber); // 额外参数
        formData.append("fileName", param.file.name);
        formData.append("file", this.sopFileRow);
        this.requestMethodPost("/weChat/workOrder/service/report/upload", formData)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                message: "上传服务报告成功",
                type: "success"
              });
              this.$_getServiceData(this.$route.query.workOrderNumber);
              this.$_getWOInfo(this.$route.query.workOrderNumber);
              this.$gio.Clicktouploadreport({
                workOrderNumber: this.$route.query.workOrderNumber,
                Devicename: this.woInfo.deviceName,
                operation: "工单详情页点击上传报告"
              });
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    async handlCoreUpload(file) {
      const fileType = file.file.name.split(".")[file.file.name.split(".").length - 1];
      const canUploadFileType = ["doc", "docx", "pdf", "ppt", "pptx", "xls", "xlsx"];
      const limitSze = file.file.size / 1024 / 1024 < 100;
      if (!limitSze) {
        this.$message({
          type: "warning",
          message: "上传失败，请上传100M以内的文件"
        });
        return;
      }
      if (!canUploadFileType.includes(fileType)) {
        this.$message({
          type: "warning",
          message: "只能上传pdf / word / excel / ppt 类型文件"
        });
        return;
      } else if (this.sysAttachmentList.length > 9) {
        this.$message({
          type: "warning",
          message: "最多上传10个文件"
        });
        return;
      } else {
        fullScreen_loading.LOADING();
        await oss_client.getOSSClientInstance("work_order_core_data_file");
        const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
        let obj = {};
        obj.attachmentFileName = file.file.name;
        obj.attachmentHalfUrl = uploadFileRes.name;
        obj.createUserName = this.userInfo.userName;
        obj.createTime = this.formatDate(new Date());
        obj.uid = _.uniqueId("file_");
        this.sysAttachmentList.push(obj);
        fullScreen_loading.ENDLOADING();
      }
    },
    // 完结工单
    handleFinish() {
      console.log(this.isCoreInfoFlag, this.woInfo.coreDataStatus, this.woInfo.coreDataTemplateId);
      if (this.isCoreInfoFlag && this.woInfo.coreDataStatus == 2 && this.woInfo.coreDataTemplateId) {
        const flag = this.$refs.editServiceReportIndex.validateNode();
        console.log(flag, this.sysAttachmentList.length);
        if (!(flag && this.sysAttachmentList.length)) {
          this.$alert("请先填写服务报告信息且上传报告，再进行完结操作", "无法完结", {
            confirmButtonText: "知道了"
          })
            .then(() => {})
            .catch(() => {});
        } else {
          console.log(1122233333444);
          this.$refs.editServiceReportIndex.saveInfo("parent");
        }
      } else if (this.totalDraftCount == this.unPublicDraftCount) {
        console.log(1122222);
        this.checkHandleWorkOrder();
        // this.finishWorkorder = true;
      } else {
        this.$alert("请先上传报告或制作报告，再进行完结操作", "无法完结", {
          confirmButtonText: "知道了"
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    // 判断登录人是否为工单所属申请单的负责人   以及 除工单外是否有未完成的工单
    checkHandleWorkOrder() {
      let param = {
        workOrderNumber: this.woInfo.workOrderNumber,
        serviceApplyOrderId: this.woInfo.serviceApplyOrderId,
        reportType: this.woInfo.reportType,
        operationEntrance: 2,
        coreDataStatus: this.woInfo.coreDataStatus,
        coreDataTemplateId: this.woInfo.coreDataTemplateId
      };
      this.requestMethodGet("/weChat/workOrder/checkHandleWorkOrder", param)
        .then(res => {
          console.log(res.data.code);
          // 1000 登录人是工单所属申请单的负责人   以及 除工单外没有未完成的工单
          if (res.data.code == 1000) {
            this.finishAllWorkorder = true;
          } else if (res.data.code == 6003 || res.data.code == 6004 || res.data.code == 6002) {
            // 6003 登录人不是工单所属申请单的负责人
            this.finishWorkorder = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        });
    },
    // 取消
    cancelFinishApplyDialog() {
      this.applyMsgDialog = false;
    },

    // 前往补充申请单信息 并发布报告和完结工单
    GoToReplenish() {
      this.handleFinshWorkOrder("onlyOrder");
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: this.woInfo.serviceApplyOrderId
        }
      });
    },

    // 添加润滑点数据无限加载
    load() {
      if (this.lubrtotalCount > this.lumDataCustomers.length && !this.loadingLum) {
        this.pagenationLumCustomer.current = ++this.pagenationLumCustomer.current;
        this.$_getCustomerLumData("more");
      }
    },
    loadMore() {
      if (this.loadMoreData && this.engineerInfoList.length < this.engineerInfoToatl) {
        this.pageIndexDistributive++;
        this.handleDistributive("more");
      }
    },
    // 取消移除工作组人员
    cancelDelete(data) {
      this.visibleDelete = false;
    },
    // 分配人员的模糊搜索
    searchRoleTableData(val) {
      if (val) {
        this.pageIndexDistributive = 1;
        this.userOrRoleName = val;
        this.handleDistributive("select");
      } else {
        this.handleDistributive("noset");
      }
    },
    rowKey(row) {
      return row.lubricationPointNumber;
    },
    //添加润滑点单个选择
    handleSelectLum(rows, row) {
      // selected    true就是选中，0或者false是取消选中
      let selected = rows.length && rows.indexOf(row) !== -1;
      if (selected == false || selected == 0) {
        if (this.seleLumsAllMsg.length) {
          this.seleLumsAllMsg.splice(this.seleLumsAllMsg.findIndex(item => item.lubricationPointNumber === row.lubricationPointNumber), 1);
        }
        this.lubricationPointNumbersNew.splice(this.lubricationPointNumbersNew.findIndex(item => item === row.lubricationPointNumber), 1);
      } else {
        if (this.seleLumsAllMsg.length) {
          let cont = this.seleLumsAllMsg.filter(item => item.lubricationPointNumber == row.lubricationPointNumber);
          if (cont.length == 0) {
            this.seleLumsAllMsg.push(row);
            this.lubricationPointNumbersNew.push(row.lubricationPointNumber);
          }
        } else {
          this.seleLumsAllMsg.push(row);
          this.lubricationPointNumbersNew.push(row.lubricationPointNumber);
        }
      }
    },
    // 添加成员搜索
    handleSearchTableGroups(val) {
      this.getPersonList("first");
    },
    handleSearchTableData(val) {
      if (val) {
        this.queryParams.lDOName = val;
        this.lumDataCustomers = [];
        this.pagenationLumCustomer.current = 1;
        this.$_getCustomerLumData("select");
      } else {
        this.$_getCustomerLumData("noset");
      }
    },
    handleSearchLupTableData(val) {
      if (val) {
        this.lumDataCustomers = [];
        this.pagenationLumCustomer.current = 1;
        this.$_getCustomerLumData("select");
      } else {
        this.$_getCustomerLumData("noset");
      }
    },
    // 润滑点全选
    selectAll(val) {
      this.seleLumsAllMsg = [];
      if (val.length) {
        this.seleLumsAllMsg = val;
      } else {
        this.lubricationPointNumbersNew = [];
        this.seleLumsAllMsg = [];
      }
    },
    // 取消添加润滑点
    handleResetAddLum() {
      this.addLubricationPointsVisiable = false;
      this.queryParams.lDOName = "";
      this.queryParams.selectGroupId = [];
    },
    // 获取工单中的润滑点列表
    $_getCustomerLumData(val) {
      if (this.lubricationPointNumbersNewArr != null) {
        this.lubricationPointNumbersNew = JSON.parse(JSON.stringify(this.lubricationPointNumbersNewArr));
      }
      if (val == "first") {
        this.seleLumsAllMsg = [];
        this.lumDataCustomers = [];
        this.pagenationLumCustomer.current = 1;
        this.queryParams.lDOName = "";
        this.queryParams.selectGroupId = [];
      }
      if (val == "noset") {
        this.pagenationLumCustomer.current = 1;
        this.lumDataCustomers = [];
      }
      this.loadingLum = true;
      let params = {
        companyNumber: this.woInfo.contactCompanyNumber,
        current: this.pagenationLumCustomer.current,
        size: this.pagenationLumCustomer.size,
        LDOName: this.queryParams.lDOName,
        workshopId: this.woInfo.workshopId,
        plantStudyServiceFlag: false
      };
      if (this.woInfo.reportType != 0) {
        params.reportType = this.woInfo.reportType;
      }
      // 处理分组入参
      if (this.queryParams.selectGroupId.length) {
        params.groupId = this.queryParams.selectGroupId[this.queryParams.selectGroupId.length - 1];
      } else {
        params.groupId = "";
      }
      this.requestMethodGet("/workOrder/getLubricationPointByCompany", params)
        .then(res => {
          this.loadingLum = false;
          res = res.data;
          if (res.code == 1000) {
            if (res.data.list.length > 0) {
              this.lumDataCustomers = this.lumDataCustomers.concat(res.data.list);
              this.$refs.tableAddLumData.clearSelection();
              this.$nextTick(() => {
                if (this.lubricationPointNumbersNew.length) {
                  this.lumDataCustomers.map(item => {
                    this.lubricationPointNumbersNew.map(element => {
                      if (item.lubricationPointNumber == element) {
                        this.seleLumsAllMsg.push(item);
                        this.$refs.tableAddLumData.toggleRowSelection(item);
                      }
                    });
                  });
                }
                const hash = {};
                const newArray = this.seleLumsAllMsg.reduce((item, next) => {
                  hash[next.lubricationPointNumber] ? "" : (hash[next.lubricationPointNumber] = true && item.push(next));
                  return item;
                }, []);
                this.seleLumsAllMsg = newArray;
              });
            }
            this.lubrtotalCount = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loadingLum = false;
        });
    },
    // 移除润滑点
    handleDeleteLum(row) {
      if (this.lumTotalNum > 1 && row.haveDraftFlag == 1) {
        // 如果该润滑点有相关的报告草稿
        this.$confirm("系统将同时删除润滑点相关的报告草稿、服务报告，且无法找回！", "移除提示", {
          confirmButtonText: "移除",
          cancelButtonText: "保留"
        })
          .then(() => {
            let params = new FormData();
            params.append("workOrderNumber", this.$route.query.workOrderNumber);
            params.append("lubricationPointNumber", row.lubricationPointNumber);
            this.requestMethodPost("/serviceReport/deleteWorkOrderLubricationPointRel", params)
              .then(res => {
                this.loadingLum = false;
                res = res.data;
                if (res.code == 1000) {
                  this.$message({
                    type: "success",
                    message: "移除成功!"
                  });
                  // 删除过后刷新润滑点列表
                  this.$_getLumData(this.woInfo.workOrderNumber);
                  this.$_getReportList();
                  this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度
                  this.$_getServiceData(this.$route.query.workOrderNumber);
                  this.$refs.editServiceReportIndex.getTemplateData();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              })
              .catch(res => {});
          })
          .catch(() => {});
      } else if (this.lumTotalNum > 1 && row.haveDraftFlag == 0) {
        // 如果没有
        this.$confirm("是否移除润滑点？", "移除提示", {
          confirmButtonText: "移除",
          cancelButtonText: "保留"
        })
          .then(() => {
            let params = new FormData();
            params.append("workOrderNumber", this.$route.query.workOrderNumber);
            params.append("lubricationPointNumber", row.lubricationPointNumber);
            this.requestMethodPost("/serviceReport/deleteWorkOrderLubricationPointRel", params)
              .then(res => {
                this.loadingLum = false;
                res = res.data;
                if (res.code == 1000) {
                  this.$message({
                    type: "success",
                    message: "移除成功!"
                  });
                  // 删除过后刷新润滑点列表
                  this.$_getLumData(this.woInfo.workOrderNumber);
                  this.$refs.editServiceReportIndex.getTemplateData();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              })
              .catch(res => {});
          })
          .catch(() => {});
      } else {
        this.$alert("请确保工单内至少有一个润滑点。", "无法移除", {
          confirmButtonText: "知道了",
          callback: action => {}
        });
      }
    },
    // 添加润滑点提交
    handleSubmitAddLum() {
      this.lubricationPointNumbersNew = [];
      this.lumData = [];
      this.lumData = JSON.parse(JSON.stringify(this.seleLumsAllMsg));
      this.lumData.map(item => {
        this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
      });
      let arr = this.lubricationPointNumbersNew.concat(this.lubricationPointNumbersNewArr);
      let arrNew = [...new Set(arr)];
      let param = {
        lubricationNumbers: arrNew.join(","),
        workOrderNumber: this.$route.query.workOrderNumber,
        contactCompanyNumber: this.woInfo.contactCompanyNumber,
        serviceNumber: this.woInfo.serviceNumber, //服务编码
        submitPersonNumber: this.woInfo.submitPersonNumber, //服务编码
        shortDesc: this.woInfo.shortDesc, //服务编码
        submitPersonName: this.woInfo.submitPersonName
      };
      param.accountId = this.woInfo.companyId;
      this.requestMethodPost("/workOrder/changeWorkOrderLubrication", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.addLubricationPointsVisiable = false;
            this.$_getLumData(this.$route.query.workOrderNumber);
            this.$_getWOInfo(this.$route.query.workOrderNumber);
            // if(this.reportType !=0) {

            this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度

            // }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 分配工单
    handleDistributive(val, showExecuteVis = true) {
      if (showExecuteVis) this.executePersonNameVisiable = true;
      if (val == "first") {
        this.pageIndexDistributive = 1;
        this.distributionPerson = {};
        this.engineerInfoList = [];
        this.userOrRoleName = "";
      }
      if (val == "noset") {
        this.pageIndexDistributive = 1;
        this.engineerInfoList = [];
      }
      let param = {
        useStateFlag: 1,
        current: this.pageIndexDistributive,
        userOrRoleName: this.userOrRoleName,
        userId: this.userInfo.userId
      };
      if (this.woInfo.authorityRole && this.woInfo.serviceType == 10) {
        param.authorityRole = this.woInfo.authorityRole;
      }
      // 是否已有分配人
      if (this.originalExecuteUserNumber) {
        param.originalExecuteUserNumber = this.originalExecuteUserNumber;
      }
      this.loadingPerson = true;
      param.userBelongType = this.active;
      param.workOrderBelongCompanyId = this.woInfo.companyId;
      param.workshopId = this.woInfo.workshopId;
      if (this.woInfo.distributorCompanyType == 1) {
        param.distributorId = this.woInfo.distributorCompanyId;
      }
      param.spId = this.woInfo.distributorCompanyId;
      param.accountId = this.woInfo.companyId;
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (val == "select") {
              this.engineerInfoList = [];
              this.engineerInfoList = res.data.list;
            } else if (val == "more") {
              this.engineerInfoList = this.engineerInfoList.concat(res.data.list);
            } else {
              this.engineerInfoList = [];
              this.engineerInfoList = res.data.list;
            }
            this.engineerInfoToatl = res.data.totalCount;
            if (this.engineerInfoList.length < this.engineerInfoToatl) {
              this.loadMoreData = true;
            } else {
              this.loadMoreData = false;
            }
            this.loadingPerson = false;
            this.engineerInfoList.map(item => {
              if (item.userId == this.distributionPerson.userId) {
                this.$refs.multipleTableAdd.setCurrentRow(item);
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 制作报告
    handleMakeReport() {
      this.$gio.Track("clickMakeReportButton", {
        workOrderNumber: this.$route.query.workOrderNumber,
        serviceType: this.woInfo.serviceType
      });
      if (this.isCoreInfoFlag && !this.woInfo.coreDataStatus) {
        this.$confirm("您将选择在线制作报告，填写完成并发布后方可完结工单，是否确定？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.requestMethodGet("/weChat/workOrder/makeReportType", { coreDataStatus: 1, id: this.woInfo.id }).then(res => {
              if (res.data.code == 1000) {
                this.$_getWOInfo(this.$route.query.workOrderNumber);
                // this.handleJump();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
          })
          .catch(() => {});
      }
    },
    handleJump() {
      this.$router.push({
        path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList",
        query: {
          serviceNumber: this.selectServiceNumber,
          workOrderNumber: this.$route.query.workOrderNumber,
          typeName: this.typeName,
          pesServiceItemId: "",
          workshopId: this.woInfo.workshopId,
          companyNumber: this.woInfo.contactCompanyNumber,
          companyId: this.woInfo.companyId,
          contactCompanyName: this.woInfo.contactCompanyName,
          serviceApplyNo: this.woInfo.serviceApplyNo,
          serviceApplyOrderId: this.woInfo.serviceApplyOrderId,
          batUploadBtnAuth: this.woInfo.workOrderStatus == "1" && this.woInfo.reportType == 1 && this.woInfo.serviceType == "9" && this.is_hasNum ? true : false
        }
      });
    },
    // 取消完结工单
    cancelFinishOrder() {
      this.finishWorkorder = false;
    },
    // 取消完结工单
    cancelFinishAllOrder() {
      this.finishAllWorkorder = false;
    },
    // 同步完成服务申请
    sureFinishApply() {
      let param = {
        id: this.woInfo.serviceApplyOrderId
      };
      this.requestMethodPost("/serviceApply/serviceApplyOrderIntegrityCheck", param)
        .then(res => {
          console.log(res.data.code);
          // 1000 登录人是工单所属申请单的负责人   以及 除工单外没有未完成的工单
          if (res.data.code == 1000) {
            this.handleFinshWorkOrder("apply");
          } else if (res.data.code == 2000) {
            this.applyMsgDialog = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        });
      //
    },
    // 仅完成工单
    onlyFinishWorkOrder() {
      this.handleFinshWorkOrder("orderOnly");
    },
    // 确认完结工单
    sureFinishOrder() {
      this.$gio.completeWorkorder({
        operation: "弹窗中点击确定",
        woerderNumber: this.woInfo.workOrderNumber
      });
      if (this.isCoreInfoFlag && this.woInfo.coreDataStatus == 2 && this.woInfo.coreDataTemplateId && this.coreInfoId) {
        console.log(89888);
        this.handleFinshWorkOrder("order");
      } else if (!this.serviceData.length) {
        this.$alert("请先上传服务报告文件", "提示", {
          confirmButtonText: "我知道了",
          confirmButtonClass: "confirmButton",
          callback: action => {
            this.finishWorkorder = false;
          }
        });
        return;
      } else {
        this.handleFinshWorkOrder("order");
      }
    },
    handleFinshWorkOrder(val) {
      let params = {
        workOrderNumber: this.woInfo.workOrderNumber,
        serviceApplyOrderId: this.woInfo.serviceApplyOrderId
      };
      console.log(val);
      if (val == "order" || val == "orderOnly" || val == "onlyOrder") {
        params.completedService = false;
      } else {
        params.completedService = true;
      }
      this.requestMethodPost("/weChat/workOrder/handle", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (val == "order") {
              this.finishWorkorder = false;
            } else if (val == "onlyOrder") {
              this.applyMsgDialog = false;
            } else {
              this.finishAllWorkorder = false;
            }

            this.$_getWOInfo(this.woInfo.workOrderNumber);
            this.$_getServiceData(this.woInfo.workOrderNumber);
            if (this.woInfo.workOrderType == 2) {
              this.$gio.Track("viewApplication", {
                workorderNumber: this.woInfo.workOrderNumber
              });
              this.$gio.completeWorkorder({
                operation: "工单详情页点击完结工单按钮"
              });
              this.$router.push({
                path: "/ServiceApplyList/ServiceApplyDetail",
                query: {
                  id: this.woInfo.serviceApplyOrderId
                }
              });
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 提交评价
    submitRemark() {
      if (this.starId == 0) {
        this.$message({
          message: "请进行服务评价",
          type: "warning"
        });
      }
      this.$refs["formRemark"].validate(valid => {
        if (valid) {
          let param = {
            evaluateStars: this.starId,
            evaluateContent: this.formRemark.remark,
            workOrderNumber: this.woInfo.workOrderNumber
          };
          this.requestMethodPost("/weChat/workOrder/evaluate", param)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                // 刷新工单详情
                this.$_getWOInfo(this.woInfo.workOrderNumber);
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      });
    },
    // 添加工作组人员
    addWorkGroupPerson() {
      this.numbers = [];
      const data = this.workGroupList;
      if (data && data.length > 0) {
        data.forEach(item => {
          this.numbers.push(item.userNumber);
        });
      }
      this.addWorkGroupsVisiable = true;
      this.getPersonList("first");
    },
    selectable(row, index) {
      return row.disabled != true; //通过某个值来进行判断，规定那一行的选择框被禁用
    },
    // 添加成员提交
    submitAddWorkGroups() {
      if (this.addPerson) {
        let param = {
          weChatWorkOrderGroupDtos: this.addPerson
        };
        this.requestMethodPost("/weChat/workOrderGroup/createWorkOrderGroup", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                message: "成员邀请成功",
                type: "success"
              });
              this.addWorkGroupsVisiable = false;
              this.$_getWOInfo(this.woInfo.workOrderNumber);
              this.$gio.Track("addWorkgroupMember", {
                workorderNumber: this.woInfo.workOrderNumber
              });
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      } else {
        this.$message({
          message: "请选择人员",
          type: "warning"
        });
      }
    },
    // 选择分配人
    handleDistributionnChange(val) {
      this.distributionPerson = val;
    },
    // 提交分配
    submitDistribution() {
      if (this.distributionPerson.userNumber) {
        let param = {
          workOrderNumber: this.woInfo.workOrderNumber,
          executePersonName: this.distributionPerson.userName,
          executePersonNumber: this.distributionPerson.userNumber,
          executePersonPhone: this.distributionPerson.phonenumber,
          reDistributeFlag: 0
        };
        if (this.originalExecuteUserNumber) {
          param.reDistributeFlag = 1;
        }
        const roleIdList = this.distributionPerson.roleDtoList.map(it => {
          return it.accessTemplateId;
        });
        this.requestMethodPost("/weChat/workOrder/distribute", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              // 调取消息未读数据
              this.$parent.msgCount();
              this.$message({
                message: "工单分配成功",
                type: "success"
              });
              this.executePersonNameVisiable = false;

              // 分配执行人清空上传的报告
              this.deleteUploadFile();
              let distributePersonFlag = false;
              if (this.woInfo.coreDataTemplateRoleIds) {
                this.woInfo.coreDataTemplateRoleIds.split(",").some(roleId => {
                  if (roleIdList.includes(parseInt(roleId))) {
                    distributePersonFlag = true;
                  }
                });
              }
              // (roleCodeList.includes("admin") || roleCodeList.includes("fes") || roleCodeList.includes("ace-fes")) &&
              if (this.woInfo.coreDataTemplateId && this.woInfo.reportType && distributePersonFlag) {
                this.deleteCoreDataStatus();
              } else if (this.woInfo.coreDataTemplateId && this.woInfo.reportType && !distributePersonFlag) {
                this.requestMethodGet("/weChat/workOrder/makeReportType", { coreDataStatus: 1, id: this.woInfo.id }).then(res => {
                  if (res.data.code != 1000) {
                    this.$message({
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                });
              }
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      } else {
        this.$message({
          message: "请选择用户",
          type: "warning"
        });
      }
    },
    deleteCoreDataStatus() {
      this.requestMethodGet("/weChat/workOrder/makeReportType", { coreDataStatus: 0, id: this.woInfo.id }).then(res => {
        if (res.data.code != 1000) {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    deleteUploadFile() {
      this.requestMethodGet("/weChat/common/deleteSysAttachment", { attachmentType: "work_order_core_data_file", attachmentKey: this.woInfo.workOrderNumber }).then(res => {
        if (res.data.code == 1000) {
          this.handleDistributiveUser();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleDistributiveUser() {
      this.$_getServiceData(this.woInfo.workOrderNumber);
      this.$_getProgress(this.$route.query.workOrderNumber);
      this.$gio.assignWorkorder(this.$route.query.workOrderNumbe);
      this.$nextTick(() => {
        this.$router.go(0);
      });
    },
    // 工作组添加人员
    handleSelectionChange(val) {
      this.addPerson = [];
      if (val) {
        val.map(item => {
          this.addPerson.push({ userNumber: item.userNumber, workOrderNumber: this.woInfo.workOrderNumber });
        });
      } else {
      }
      this.multipleSelection = val;
    },
    // 获取所有人员接口
    async getPersonList(val) {
      if (val == "first") {
        this.pagenationWorkPerson.current = 1;
      }
      if (val == "more") {
        if (this.engineerInfoList.length >= this.engineerInfoToatl) return;
        this.pagenationWorkPerson.current++;
      }
      let param = {
        useStateFlag: 1,
        current: this.pagenationWorkPerson.current,
        userOrRoleName: this.queryParams.taskName,
        originalExecuteUserNumber: this.userInfo.userNumber
      };
      param.userBelongType = this.active;
      param.workOrderBelongCompanyId = this.woInfo.companyId;
      param.workshopId = this.woInfo.workshopId;
      this.loadingPersonGroup = true;
      if (this.woInfo.distributorCompanyType == 1) {
        param.distributorId = this.woInfo.distributorId;
      }
      param.spId = this.woInfo.distributorCompanyId;
      param.accountId = this.woInfo.companyId;
      await this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          this.loading = false;
          this.loadingPersonGroup = false;

          res = res.data;
          if (res.code == 1000) {
            this.engineerInfoToatl = res.data.totalCount;
            if (val == "first") {
              this.engineerInfoList = [];
              this.engineerInfoList = res.data.list;
            } else if (val == "more") {
              this.engineerInfoList = this.engineerInfoList.concat(res.data.list);
            }

            this.engineerInfoList.forEach(item => {
              item.selected = false;
              for (let number of this.numbers) {
                if (item.userNumber == number) {
                  item.disabled = true;
                }
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    select(val) {
      let starId = val.id;
      this.starId = starId;
      if (this.starId < 3) {
        this.isRequire = true;
      } else {
        this.isRequire = false;
      }
      if (starId > this.starId) {
        val.isred = false;
      } else {
        val.isred = true;
      }
      switch (starId) {
        case 0:
          this.scoreRemark = "";
          break;
        case 1:
          this.scoreRemark = "非常不满意，没有任何效果";
          break;
        case 2:
          this.scoreRemark = "不满意，与预期差异很大";
          break;
        case 3:
          this.scoreRemark = "良好，基本满足诉求";
          break;
        case 4:
          this.scoreRemark = "满意，服务质量上乘";
          break;
        default:
          this.scoreRemark = "非常满意，超出原本预期";
          break;
      }
    },
    // 确认移除
    sureDelete(item) {
      // 删除工作组人员
      let params = {
        userNumber: item.userNumber
      };
      this.requestMethodGet("/weChat/workOrderGroup/delWorkOrderGroupMember", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            // this.$gio("deleteWorkgroupMember", {
            //   workorderNumber: this.woInfo.workOrderNumber
            // });
            this.$message({
              message: "成功退出工作组",
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
          this.$gio.deleteWorkgroupMember({
            workorderNumber: this.woInfo.workOrderNumber
          });
        })
        .catch(res => {});
      this.$refs[`popover-${item.id}`][0].doClose();
    },
    // 编辑
    editWorkorder() {
      this.editWorkorderVisisble = true;
      this.$gio.clickEditReportButton({
        workorderNumber: this.woInfo.workOrderNumber
      });
    },
    handleCurrentChangeLum(current) {
      this.pagenationLum.current = current;
      this.$_getLumData(this.woInfo.workOrderNumber);
    },
    // 服务报告点击分页
    handleCurrentChangeService(current) {
      this.pagenationService.current = current;
      this.$_getServiceData(this.woInfo.workOrderNumber);
    },
    customColorMethod(percentage) {
      if (percentage <= 50) {
        return "#dd0000";
      } else {
        return "#008888";
      }
    },
    // 添加润滑点
    addLubricationPoints() {
      const data = this.lumData;
      if (data.length) {
        data.forEach(it => {
          it.id = it.lubricationPointId;
        });
      }
      this.checkedDevice = data;
      this.chooseDeviceAndLupDialog = true;
      this.$gio.addLubrPoint({
        workorderNumber: this.woInfo.workOrderNumber
      });
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      this.lumData = list;
      console.log(this.lumData, "选中的润滑点");
      this.lubricationPointNumbersNew = [];
      if (list.length) {
        list.forEach(item => {
          this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
        });
      }
      // 把添加的润滑点和工作做关联
      let param = {
        lubricationNumbers: this.lubricationPointNumbersNew.join(","),
        workOrderNumber: this.$route.query.workOrderNumber,
        contactCompanyNumber: this.woInfo.contactCompanyNumber,
        serviceNumber: this.woInfo.serviceNumber, //服务编码
        submitPersonNumber: this.woInfo.submitPersonNumber,
        shortDesc: this.woInfo.shortDesc,
        submitPersonName: this.woInfo.submitPersonName
      };
      param.accountId = this.woInfo.companyId;
      this.requestMethodPost("/workOrder/changeWorkOrderLubrication", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.chooseDeviceAndLupDialog = false;
            this.addLubricationPointsVisiable = false;
            this.$_getLumData(this.$route.query.workOrderNumber);
            this.$_getWOInfo(this.$route.query.workOrderNumber);
            this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度
            this.$refs.editServiceReportIndex.getTemplateData();
            ++this.chooseLupDialogKey;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    //编辑
    handleClose() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    // 返回
    handleBack() {
      if (this.$route.query.isSaveQuery) {
        this.$router.push({
          name: "NewWorkOrderList",
          params: { isSaveQuery: true }
        });
      } else {
        history.back(-1);
      }
    },
    // 取消完结工单
    resetCloseWorkorder(formName) {
      this.ruleForm.close = 0;
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 取消编辑工单
    handleResetEdit(formName) {
      this.$refs[formName].resetFields();
      this.editWorkorderVisisble = false;
    },
    // 提交编辑工单 ---- 更新删除预约日期、服务地址、服务创盈属性
    handleSubmitEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否确认修改工单", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = {
                shortDesc: this.ruleForm1.shortDesc,
                workOrderNumber: this.woInfo.workOrderNumber
              };
              this.requestMethodPost("/weChat/workOrder/modifyWorkOrder", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "修改工单成功",
                      type: "success"
                    });
                    this.editWorkorderVisisble = false;
                    this.$_getWOInfo(this.$route.query.workOrderNumber);
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    //提交
    submitCloseWorkorder(formName) {
      if (this.ruleForm.close || this.ruleForm.close == 0) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              closeType: this.ruleForm.close,
              closeReason: this.ruleForm.text,
              workOrderNumber: this.woInfo.workOrderNumber
            };
            this.requestMethodPost("/web/workOrder/webCloseWorkOrder", params)
              .then(res => {
                res = res.data;
                if (res.code == 1000) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: "工单关闭成功",
                    type: "success"
                  });
                  this.$_getWOInfo(this.$route.query.workOrderNumber);
                  this.$gio.closeWorkorder(this.$route.query.workOrderNumber);
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              })
              .catch(res => {});
          } else {
            return false;
          }
        });
      } else {
        this.$message({
          message: "请选择关闭原因",
          type: "warning"
        });
      }
    },
    // 复制邮箱
    onCopyMail() {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制邮箱
    onErrorMail() {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 复制手机号
    onCopyTel() {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onErrorTel() {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 取消
    handleReset() {
      this.executePersonNameVisiable = false;
      this.userOrRoleName = "";
    },
    //跳转客户详情
    handleJumpCustomerDetail() {
      this.$router.push({
        path: "/CustomerProfile/CustomerProfileDetail",
        query: {
          companyNumber: this.woInfo.contactCompanyNumber,
          workorderPage: true
        }
      });
    },
    // 跳转经销商详情
    handleJumpDealer() {
      this.$router.push({
        path: "/DealerProfile/DealerProfileDetail",
        query: {
          companyNumber: this.woInfo.distributorCompanyNumber,
          workorderPage: true
        }
      });
    },

    // 处理数据，获取icon的全路径
    async handleIcon(array) {
      for (var i = 0; i < array.length; i++) {
        var data = array[i];
        if (data.lubricationPointPicPath) {
          this.getFullUrl(data);
        }
      }
    },
    // 获取图片全路径
    getFullUrl(val) {
      const params = {
        url: val.lubricationPointPicPath
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(val, "lubricationPointPicPathFull", res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取工单中的润滑点列表
    $_getLumData(workOrderNumber, val) {
      if (this.lubricationPointsSearch) {
        this.pagenationLum.current = 1;
      }
      let params = {
        workOrderNumber: workOrderNumber,
        current: this.pagenationLum.current,
        size: this.pagenationLum.size,
        LDOName: this.lubricationPointsSearch
      };
      this.requestMethodGet("/workOrder/getWorkOrderLubricationPoint", params)
        .then(async res => {
          res = res.data;
          if (res.code == 1000) {
            this.lumData = res.data.list;
            await this.handleIcon(this.lumData);
            this.lubricationPointNumbersNewArr = [];
            let arr = [];
            this.lumData.map(item => {
              arr.push(item.lubricationPointNumber);
            });
            this.lubricationPointNumbersNewArr = JSON.parse(JSON.stringify(arr));
            this.lumTotalNum = res.data.totalCount;
            if (val) {
              this.searchLumResult = true;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    // 获取工单服务报告
    $_getServiceData(workOrderNumber) {
      let params = {
        workOrderNumber: workOrderNumber,
        current: this.pagenationService.current,
        size: this.pagenationService.size
      };
      this.requestMethodGet("/workOrder/getWorkOrderReport", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceData = res.data.list;
            this.serviceData.forEach(item => {
              let index = item.attachmentUrl
                .split(".")
                [item.attachmentUrl.split(".").length - 1].toLowerCase()
                .lastIndexOf("?");
              item.fileType = item.attachmentFileName
                .split(".")
                [item.attachmentFileName.split(".").length - 1].toLowerCase()
              item.flieName = item.attachmentUrl.split("/")[item.attachmentUrl.split("/").length - 1];
              let htp = item.attachmentUrl.split("?")[0];
              item.flieName = htp.split("/")[htp.split("/").length - 1];
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    perdivFile(item){
      window.open(item.attachmentUrl)
    },
    // 获取头像全路径
    getFullFileUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.woInfo.sopUrlFull = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 下载标准作业流程文件
    downLoadSopFile() {
      window.open(this.woInfo.sopUrlFull);
    },
    // 获取报告进度
    $_getProgress(workOrderNumber) {
      let params = {
        workOrderNumber
      };
      this.requestMethodGet("/serviceReport/queryPublicProgress", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.unPublicDraftCount = res.data.unPublicDraftCount;
            this.totalDraftCount = res.data.totalDraftCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 处理数据，获取icon的全路径
    async handleIcon(array) {
      for (var i = 0; i < array.length; i++) {
        var data = array[i];
        if (data.attachmentUrl) {
          this.getFullUrl(data);
        }
      }
    },
    // 获取图片全路径
    getFullUrl(val) {
      const params = {
        url: val.attachmentUrl
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          val.attachmentUrl = res.data.data;
          this.pictureDtoList.push({ url: res.data.data });
          console.log(this.pictureDtoList, 99999);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取工单详情
    $_getWOInfo(workOrderNumber) {
      const loading = this.$loading({
        lock: true,
        text: "数据请求中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = {
        workOrderNumber
      };
      this.requestMethodGet("/weChat/workOrder/queryWorkOrderDetail", params)
        .then(async res => {
          res = res.data;
          loading.close();
          if (res.code == 1000) {
            this.$_getReportList();
            this.DA_setInitialActive(res.data.customerType);
            this.promote_getBtnDisplay(res.data.workOrderNumber);
            this.getRecord({
              busId: res.data.id
            })
            this.woInfo = res.data;
            this.woInfo.coreTemplateId = res.data.coreDataTemplateId;
            this.executeRoleFlag = this.woInfo.executePersonRoleCodes.some(role => {
              return this.coreTemplateOptimzieFlagRoles.includes(role);
            });
            this.judgeCreateCase();
            this.judgeRevocation();
            this.handleCoreInfoFlag();
            if (this.woInfo.pictureDtoList.length) {
              await this.handleIcon(this.woInfo.pictureDtoList);
            }
            if (this.woInfo.lubricationPointNumbers != null) {
              this.lubricationPointNumbersNewArr = JSON.parse(JSON.stringify(this.woInfo.lubricationPointNumbers));
            }
            if (this.woInfo.serviceProperty) {
              this.ruleForm1.serviceProperty = this.woInfo.serviceProperty.split(",");
            }
            this.ruleForm1.incomeBbl = this.woInfo.incomeBbl;
            this.ruleForm1.serviceType = this.woInfo.serviceType;
            this.ruleForm1.incomeRmb = this.woInfo.incomeRmb;
            this.ruleForm1.expectComingTime = this.woInfo.expectComingTime;
            this.ruleForm1.contactMapAddress = this.woInfo.contactMapAddress;
            this.ruleForm1.shortDesc = this.woInfo.shortDesc;
            this.originalExecuteUserNumber = this.woInfo.executePersonNumber;
            this.pictureDtoList = [];
            if (this.woInfo.sopUrl) {
              this.woInfo.sopReportName = this.woInfo.sopUrl.split("/")[this.woInfo.sopUrl.split("/").length - 1];
              this.woInfo.sopReportType = this.woInfo.sopUrl.split(".")[this.woInfo.sopUrl.split(".").length - 1].toLowerCase();
              调取文件全路径;
              this.getFullFileUrl(this.woInfo.sopUrl);
            }

            if (this.woInfo.evaluateStars) {
              let starId = this.woInfo.evaluateStars;
              switch (starId) {
                case 0:
                  this.scoreRemark = "";
                  break;
                case 1:
                  this.scoreRemark = "非常不满意，没有任何效果";
                  break;
                case 2:
                  this.scoreRemark = "不满意，与预期差异很大";
                  break;
                case 3:
                  this.scoreRemark = "良好，基本满足诉求";
                  break;
                case 4:
                  this.scoreRemark = "满意，服务质量上乘";
                  break;
                default:
                  this.scoreRemark = "非常满意，超出原本预期";
                  break;
              }
            }
            // 此处修改有reportDtoList并且有长度并且有attachmentFileName并且attachmentFileName包含'.'
            if (this.woInfo.reportDtoList && this.woInfo.reportDtoList.length) {
              this.woInfo.reportDtoList.forEach(element => {
                element.attachmentType =
                  element.attachmentFileName && element.attachmentFileName.includes(".") ? element.attachmentFileName.split(".")[element.attachmentFileName.split(".").length - 1] : "";
              });
            }
            if (this.woInfo.reportType == 1) {
              let params = {
                workOrderNumber: this.woInfo.workOrderNumber,
                distributorCompanyNumber: this.userInfo.companyNumber
              };
              params.menuCode = "NewWorkOrderList";
              this.requestMethodGet("/weChat/workOrder/getExecuteNoProgressOilChangeReportCount", params)
                .then(res => {
                  if (res.data.code == 1000) {
                    this.up_disabled = false;
                  } else {
                    this.up_disabled = true;
                  }
                })
                .catch(err => {
                  this.up_disabled = true;
                  console.log(err);
                });
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .finally(() => {
          // loading.close();
        });
    },
    judgeCreateCase() {
      this.requestMethodGet("/emEcReport/checkPutButton", { workIds: this.woInfo.id }).then(res => {
        if (res.data.code == 1000) {
          this.showCreateCaseBtn = res.data.data.putButton;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    judgeRevocation() {
      this.requestMethodGet("/emEcReport/getFromTypeRelatedId", { relatedId: this.woInfo.id, type: 2 }).then(res => {
        if (res.data.code == 1000) {
          this.revocationCaseType = res.data.data.fromType;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleCoreInfoFlag() {
      const roleList = [];
      const roleIds = [];
      if (this.$userInfo.accessTemplates.length) {
        this.$userInfo.accessTemplates.forEach(it => {
          roleList.push(it.accessTemplateCode);
          roleIds.push(it.accessTemplateId);
        });
      }
      let isInConfigRoleList = false;
      let isExecuteRoleFlag = false;
      if (this.woInfo.coreDataTemplateRoleIds) {
        this.woInfo.coreDataTemplateRoleIds.split(",").some(roleId => {
          if (roleIds.includes(parseInt(roleId))) {
            isInConfigRoleList = true;
          }
          if (this.woInfo.executePersonRoleIds) {
            if (this.woInfo.executePersonRoleIds.includes(parseInt(roleId))) {
              isExecuteRoleFlag = true;
            }
          }
        });
      }
      this.isExecuteRoleFlag = isExecuteRoleFlag;
      this.isCoreInfoFlag = isInConfigRoleList && this.woInfo.coreDataTemplateId > 0;
      console.log("this.isCoreInfoFlagisCoreInfoFlag", roleIds, isInConfigRoleList, this.isCoreInfoFlag);
    },
    // 查看工单状态详情
    handleLookWOStatus() {
      this.dialogTableVisibleWO = !this.dialogTableVisibleWO;
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 314}px`;
    },
    //下载服务报告
    handleDownLoad(url) {
      window.open(url);
    },
    handApplyOrderDetail() {
      this.$gio.Track("viewApplication", {
        workorderNumber: this.woInfo.workOrderNumber
      });
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: this.woInfo.serviceApplyOrderId
        }
      });
    },
    getOilChangeReportCount() {}
  }
};
