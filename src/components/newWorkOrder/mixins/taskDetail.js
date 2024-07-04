export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const reg = new RegExp("^([a-z0-9A-Z]+[^a-z]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$");
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else {
        if (!reg.test(value.trim())) {
          callback(new Error("请输入正确邮箱"));
        } else {
          callback();
        }
      }
    };
    return {
      chooseDeviceAndLupDialog: false,
      applyMsgDialog: false,
      checkedDevice: [],
      urlType: "workOrder",
      taskType: "check",
      deviceCompanyId: "",
      plantStudyServiceFlag: true,
      finishAllWorkorder: false,
      mainminheight: `height:${document.documentElement.clientHeight - 136}px`,
      mainminFormheight: `height:${document.documentElement.clientHeight - 236}px`,
      mainminProcessheight: `height:${document.documentElement.clientHeight - 296}px`,
      textarea: "",
      emailForm: {
        emailAdress: ""
      },
      dataDevice: [],
      lubrtotalCount: 0,
      submitDetail: {},
      exceptDetail: {},
      emailRule: {
        emailAdress: [{ validator: checkEmail, trigger: "blur" }]
      },
      pictureDtoList: [],
      createTaskVisiable: false, // 调查任务弹框
      editWorkorderVisisble: false, // 编辑工单信息
      finishWorkorder: false, // 完结工单弹框
      sendEmailDialog: false,
      lubricationName: "",
      selectGroupId: [],
      userId: "",
      executePersonNameVisiable: false, // 重新分配弹框
      queryParams: {
        taskName: ""
      },

      editForm: {
        date1: "",
        address: "",
        text: ""
      },
      distributionPerson: {},
      starId: 0,
      engineerInfoList: [],
      loadingPerson: false,
      engineerInfoToatl: 0,
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
      // 工单信息
      woInfo: {},
      //表单验证
      ruleForm: {
        close: 0,
        text: "" //关闭原因
      },
      contactDetail: {},
      // 编辑工单表单--去除服务属性、预约日期、服务地址
      ruleForm1: {
        shortDesc: ""
      },
      ruleForm1rules: {
        expectComingTime: [{ required: true, message: "请选择预约时间", trigger: "blur" }],
        serviceProperty: [{ required: true, message: "请选择服务属性", trigger: "change" }]
      },
      closeList: [{ value: "0", label: "取消预约" }, { value: "1", label: "内容填写错误" }, { value: "2", label: "重复提交" }, { value: "3", label: "其他" }],
      selectTableRow: [],
      serviceIncomeComponentType: "editOrder",
      reportPathList: [],
      reportStatus: 0,
      dialogFormVisible: false, //是否显示关闭说明，默认隐藏
      dialogTableVisibleWO: false, //是否展示工单跟踪，默认隐藏
      pageIndexDistributive: 1,
      loadMoreData: false,
      userOrRoleName: "",
      taskId: "", // 要删除的 任务id
      taskDeleteVisible: false,
      loadingLum: false,
      loadMoreBon: false,
      PESpackageBtn: false,
      lumDataCustomers: [], // 工单中的润滑点列表
      checkedSelect: [],
      pagenationLumCustomer: {
        current: 1,
        size: 30,
        checkedLubricationList: [],
        userInfo: {},
        taskTableData: [],
        EquipmentProfilBtn: false,
        // 分组
        deviceGroupList: []
      },
      taskTableData: [],
      showCreateCaseBtn: false
    };
  },
  mounted() {
    var headerEl = document.getElementById("header");
    this.headerHeight = headerEl.offsetHeight;
    let mainHight = document.documentElement.clientHeight - 136;
    this.mainminheight = `height:${document.documentElement.clientHeight - 136}px`;
    this.mainminFormheight = `height:${mainHight - this.headerHeight - 60}px`;
    this.mainminProcessheight = `height:${mainHight - this.headerHeight - 160}px`;
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
    this.$_getWOInfo(this.$route.query.workOrderNumber);
    this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")));
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
    // 列标题 Label 区域渲染使用的 Function
    renderHeader(h, { column, $index }) {
      const label = column.label;
      return [
        h(
          "el-tooltip",
          {
            props: {
              content: (function() {
                return label;
              })(),
              placement: "top"
            }
          },
          [h("span", {}, label)]
        )
      ];
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
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.userId;
    },
    rowKey(row) {
      return row.deviceNumber;
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
    handleSearchTableData(val) {
      if (val) {
        this.lubricationName = val;
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
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.contactDetail.headUrl = res.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
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
    // 发送邮箱
    sendEmail() {
      if (this.selectTableRow.length > 0) {
        let draftNum = 0;
        let noReport = 0;
        this.selectTableRow.forEach(item => {
          if (item.draftPath) {
            this.reportPathList.push(item.draftPath);
          } else {
            ++noReport;
          }
          if (!item.publishStatus) {
            ++draftNum;
          }
        });
        if (noReport > 0 && draftNum > 0) {
          this.$message({
            message: "请先补调查表中的必填项！",
            type: "warning"
          });
        } else {
          this.sendEmailDialog = true;
          this.sendReportType = "batch_download";
        }
      } else {
        this.$message({
          message: "请至少选中一条报告",
          type: "warning"
        });
      }
    },
    // 确定发送
    confirmSend(emailRef) {
      this.$refs[emailRef].validate(valid => {
        if (valid) {
          let filePath = "";
          if (this.sendReportType == "row") {
            //行上发送报告
            filePath = this.reportRowObj.draftPath;
          } else {
            let path = [];
            this.selectTableRow.forEach(item => {
              if (item.draftPath) {
                path.push(item.draftPath);
              }
            });
            filePath = path.join(",");
          }
          const params = {
            fileKey: filePath,
            receiveEmailAddress: this.emailForm.emailAdress
          };
          this.requestMethodGet("/web/workOrder/service/report/sendEmail", params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                message: "发送成功",
                type: "success"
              });
              this.sendEmailDialog = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消发送
    cancelSend(emailRef) {
      this.emailForm.emailAdress = "";
      this.$refs[emailRef].resetFields();
      this.sendEmailDialog = false;
    },
    // 完结工单
    handleFinish() {
      this.checkHandleWorkOrder();
      // this.finishWorkorder = true;
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
            this.sureFinishOrder("apply");
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
    // 取消
    cancelFinishApplyDialog() {
      this.applyMsgDialog = false;
    },

    // 前往补充申请单信息 并发布报告和完结工单
    GoToReplenish() {
      this.sureFinishOrder("onlyOrder");
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: this.woInfo.serviceApplyOrderId
        }
      });
    },
    // 仅完成工单
    onlyFinishWorkOrder() {
      this.sureFinishOrder("orderOnly");
    },
    // 分配人员的模糊搜索
    searchRoleTableData(val) {
      this.pageIndexDistributive = 1;
      if (val) {
        this.userOrRoleName = val;
        this.handleDistributive("select");
      } else {
        this.handleDistributive("noset");
      }
    },
    // 表格勾选
    handleSelectionChange(val) {
      this.checkedLubricationList = val;
    },
    // 下载调查任务
    handleSelectionPath(val) {
      this.selectTableRow = val;
    },
    cancelChooseDeviceAndLup() {
      this.checkedLubricationList = [];
      this.lubricationName = "";
      this.selectGroupId = [];
      this.checkedDevice = [];
      this.chooseDeviceAndLupDialog = false;
    },
    // 取消创建任务
    // handleResetAddTask() {
    //   this.checkedLubricationList = [];
    //   this.lubricationName = "";
    //   this.selectGroupId = [];
    //   this.createTaskVisiable = false;
    // },
    // 确定选中润滑点
    confirmChooseLup(list) {
      console.log("-------------", this.woInfo.reportType);
      if (this.woInfo.reportType == -1) {
        if (!list.length) {
          return;
        }
        let checkedLubricationPointNumber = [];
        list.forEach(item => {
          checkedLubricationPointNumber.push(item.lubricationPointNumber);
        });
        const params = {
          lubricationPointNumber: checkedLubricationPointNumber.toString(),
          userId: this.userId,
          workOrderNumber: this.$route.query.workOrderNumber
        };
        this.requestMethodPost("/web/service/ps/createPsServiceTask", params).then(res => {
          if (res.data.code == 1000) {
            this.chooseDeviceAndLupDialog = false;
            this.$_getWOInfo(this.$route.query.workOrderNumber);
            this.$gio.createResearchTask(this.$route.query.workOrderNumber);
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      } else {
        let checkedLubricationPointNumber = [];
        if (list.length) {
          list.forEach(item => {
            checkedLubricationPointNumber.push(item.lubricationPointNumber);
          });
        }
        // 把添加的润滑点和工作做关联
        let param = {
          lubricationNumbers: checkedLubricationPointNumber.join(","),
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
              // this.addLubricationPointsVisiable = false;
              this.$_getWOInfo(this.$route.query.workOrderNumber);
              this.$gio.createResearchTask(this.$route.query.workOrderNumber);
              // this.$_getLumData(this.$route.query.workOrderNumber);
              // this.$_getWOInfo(this.$route.query.workOrderNumber);
              // this.$_getProgress(this.$route.query.workOrderNumber); // 获取报告进度
              // this.$refs.editServiceReportIndex.getTemplateData();
              ++this.chooseLupDialogKey;
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
    // 提交调查任务
    // submitLubrication() {
    //   const data = this.checkedLubricationList;
    //   if (data && data.length > 0) {
    //     let checkedLubricationPointNumber = [];
    //     data.forEach((item) => {
    //       checkedLubricationPointNumber.push(item.lubricationPointNumber);
    //     });
    //     const params = {
    //       lubricationPointNumber: checkedLubricationPointNumber.toString(),
    //       userId: this.userId,
    //       workOrderNumber: this.$route.query.workOrderNumber,
    //     };
    //     this.requestMethodPost("/web/service/ps/createPsServiceTask", params).then((res) => {
    //       if (res.data.code == 1000) {
    //         this.createTaskVisiable = false;
    //         this.$_getWOInfo(this.$route.query.workOrderNumber);
    //       } else {
    //         this.$message({
    //           message: res.data.msg,
    //           type: "warning",
    //         });
    //       }
    //     });
    //   } else {
    //     this.$message({
    //       message: "请选择润滑点",
    //       type: "warning",
    //     });
    //   }
    // },
    // 确认删除调查任务
    sureDeleteReport() {
      let params = {
        id: this.taskId
      };
      if (this.woInfo.reportType == -1) {
        this.requestMethodPost("/weChat/service/ps/deletePsServiceTask", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.taskDeleteVisible = false;
              this.$_getWOInfo(this.$route.query.workOrderNumber);
              this.$gio.deleteResearchTask(this.$route.query.workOrderNumber);
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      } else {
        this.requestMethodGet("/web/workOrder/deleteReportDraft", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.taskDeleteVisible = false;
              this.$_getWOInfo(this.$route.query.workOrderNumber);
              this.$gio.deleteResearchTask(this.$route.query.workOrderNumber);
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
    // 下载报告
    handleDownloadReport(row) {
      const params = {
        url: this.woInfo.reportType == -1 ? row.reportPath : row.draftPathHalf
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 预览报告
    handlePreviewReport(row) {
      const params = {
        url: this.woInfo.reportType == -1 ? encodeURI(row.reportPath) : encodeURI(row.draftPathHalf)
      };
      this.requestMethodGet("/web/file/getFullUrl", params, true).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消删除调查任务弹框
    handleResetReport() {
      this.taskDeleteVisible = false;
    },
    // 调查任务 删除
    handleDeleteReport(row) {
      this.taskId = row.id;
      this.taskDeleteVisible = true;
    },
    // 调查任务 继续完善
    handleContinueImprove(row) {
      if (this.woInfo.reportType != -1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/reportCommon",
          query: {
            workOrderNumber: row.workOrderNumber,
            type: "edit",
            draftId: row.id,
            serviceApplyOrderId: this.woInfo.serviceApplyOrderId,
            workshopId: this.woInfo.workshopId,
            coreDataTemplateId: this.woInfo.coreDataTemplateId,
            coreDataStatus: this.woInfo.coreDataStatus,
            companyNumber: this.woInfo.contactCompanyNumber,
            companyId: this.woInfo.companyId,
            contactCompanyName: this.woInfo.contactCompanyName,
            publishStatus: row.publishStatus
          }
        });
      } else {
        setTimeout(() => {
          this.$router.push({
            path: "/NewWorkOrderList/NewWorkorderTaskDetail/InformationFillNew",
            query: {
              type: "edit",
              id: row.id,
              userInfo: this.userInfo
            }
          });
        }, 500);
      }
    },
    // 选择分配人
    handleDistributionnChange(val) {
      this.distributionPerson = val;
    },
    // 取消分配
    handleResetDistribution() {
      this.executePersonNameVisiable = false;
      this.distributionPerson = {};
      this.userOrRoleName = "";
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
              this.$_getWOInfo(this.$route.query.workOrderNumber);
              this.$gio.assignWorkorder(this.$route.query.workOrderNumbe);
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
    loadMore() {
      if (this.loadMoreData && this.engineerInfoList.length < this.engineerInfoToatl) {
        this.pageIndexDistributive++;
        this.handleDistributive("more");
      }
    },
    // 分配工单
    handleDistributive(val) {
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
      this.executePersonNameVisiable = true;
      let param = {
        useStateFlag: 1,
        current: this.pageIndexDistributive,
        userOrRoleName: this.userOrRoleName
      };
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
      param.accountId = this.woInfo.companyId;
      param.spId = this.woInfo.distributorCompanyId;
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.engineerInfoToatl = res.data.totalCount;
            if (res.data.list) {
              if (val == "select") {
                this.engineerInfoList = [];
                this.engineerInfoList = res.data.list;
                this.loadMoreData = true;
              } else if (val == "more") {
                this.engineerInfoList = this.engineerInfoList.concat(res.data.list);
                this.loadMoreData = true;
              } else {
                this.engineerInfoList = [];
                this.engineerInfoList = res.data.list;
                this.loadMoreData = true;
              }
              if (this.distributionPerson) {
                this.engineerInfoList.map(item => {
                  if (item.userId == this.distributionPerson.userId) {
                    this.$refs.multipleTable.setCurrentRow(item);
                  }
                });
              }
              if (this.engineerInfoList.length < this.engineerInfoToatl) {
                this.loadMoreData = true;
              } else {
                this.loadMoreData = false;
              }
              this.loadingPerson = false;
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
    // 编辑
    editWorkorder() {
      this.$gio.Track("clickEditReportButton", {
        workorderNumber: this.woInfo.workOrderNumber,
        serviceType: this.woInfo.serviceType
      });
      this.editWorkorderVisisble = true;
    },
    customColorMethod(percentage) {
      if (percentage <= 50) {
        return "#dd0000";
      } else {
        return "#008888";
      }
    },
    // 取消完结工单
    handleResetFinish() {
      this.finishWorkorder = false;
    },
    // 确认完结工单
    sureFinishOrder(val) {
      this.$gio.completeWorkorder({
        operation: "工单详情页点击完结工单按钮"
      });
      let requireList = [];
      let reportStatusList = [];
      if (!this.taskTableData.length) {
        this.$alert("请先添加调查任务", "提示", {
          confirmButtonText: "我知道了",
          confirmButtonClass: "confirmButton",
          callback: action => {
            this.finishWorkorder = false;
          }
        });
        return;
      }
      this.taskTableData.forEach(item => {
        if (this.woInfo.reportType == -1) {
          if (!item.reportPercent) {
            requireList.push(item);
          }
          if (item.reportStatus == 0) {
            reportStatusList.push(item);
          }
        } else {
          if (!item.perfectRate) {
            requireList.push(item);
          }
          if (item.publishStatus == 0) {
            reportStatusList.push(item);
          }
        }
      });
      // 先完成必填
      if (requireList.length) {
        this.$message({
          message: "请先补全调查表中的必填项！",
          type: "warning"
        });
        return;
      }
      if (reportStatusList.length) {
        this.$message({
          message: "请先保存状态为草稿的任务！",
          type: "warning"
        });
        return;
      }
      let params = {
        workOrderNumber: this.woInfo.workOrderNumber,
        serviceApplyOrderId: this.woInfo.serviceApplyOrderId
      };
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
            this.$_getWOInfo(this.$route.query.workOrderNumber);
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
    // 创建服务任务
    createTask() {
      // this.checkedLubricationList = [];
      // this.checkedSelect = [];
      // this.selectGroupId = [];
      // if (this.woInfo.psServiceTaskList.length > 0) {
      //   this.woInfo.psServiceTaskList.forEach((item) => {
      //     this.checkedSelect.push(item.lubricationPointNumber);
      //   });
      // }
      // this.createTaskVisiable = true;
      // this.$_getCustomerLumData("first");
      // this.getGroupList();
      this.checkedDevice = this.taskTableData;
      this.chooseDeviceAndLupDialog = true;
      this.$gio.clickCreateResearchTaskButton({
        workorderNumber: this.woInfo.workOrderNumber
      });
    },
    checkedSelectTask(row, index) {
      if (this.checkedSelect.length > 0) {
        return !this.checkedSelect.includes(row.lubricationPointNumber);
      } else {
        return true;
      }
    },
    // 添加润滑点数据无限加载
    load() {
      if (this.loadMoreBon && !this.loadingLum && this.lubrtotalCount > this.dataDevice.length) {
        this.pagenationLumCustomer.current = ++this.pagenationLumCustomer.current;
        this.$_getCustomerLumData("scroll");
      }
    },
    // 获取工单中的润滑点列表
    $_getCustomerLumData(val) {
      if (val == "first") {
        this.lumDataCustomers = [];
        this.pagenationLumCustomer.current = 1;
        this.lubricationName = "";
        this.selectGroupId = [];
      }
      if (val == "noset") {
        this.pagenationLumCustomer.current = 1;
        this.lumDataCustomers = [];
      }
      this.loadingLum = true;
      let params = {
        customerNumber: this.woInfo.contactCompanyNumber,
        deviceOrLubricationPointName: this.lubricationName,
        current: this.pagenationLumCustomer.current,
        size: this.pagenationLumCustomer.size,
        workshopId: this.woInfo.workshopId,
        plantStudyServiceFlag: true
      };
      if (this.woInfo.reportType != 0) {
        params.reportType = this.woInfo.reportType;
      }
      // 处理分组入参
      if (this.selectGroupId.length) {
        params.groupId = this.selectGroupId[this.selectGroupId.length - 1];
      } else {
        params.groupId = "";
      }
      this.requestMethodGet("/web/workOrder/queryDeviceByPage", params)
        .then(res => {
          this.loadingLum = false;
          if (res.data.code == 1000) {
            const data = res.data.data.list;
            this.lubrtotalCount = res.data.totalCount;
            this.dataDevice = data;
            if (val == "scroll" && data.length > 0) {
              this.dataDevice = this.dataDevice.concat(data);
            }
            let tableList = [];
            if (data && data.length > 0) {
              data.forEach(item => {
                if (item.lubricationPoint && item.lubricationPoint.length > 0) {
                  item.lubricationPoint.map(it => {
                    it.deviceName = item.deviceName;
                    it.deviceNumber = item.deviceNumber;
                    it.isNew = item.isNew;
                    tableList.push(it);
                  });
                }
              });
              this.loadMoreBon = true;
              if (val == "select") {
                this.lumDataCustomers = [];
                this.lumDataCustomers = tableList;
              } else {
                this.lumDataCustomers = this.lumDataCustomers.concat(tableList);
              }
            } else {
              this.loadMoreBon = false;
              this.pagenationLumCustomer.current = this.pagenationLumCustomer.current;
            }
            this.$refs.refTable.clearSelection();
            this.$nextTick(() => {
              if (this.checkedSelect.length) {
                this.checkedSelect.map(element => {
                  this.lumDataCustomers.map(item => {
                    if (item.lubricationPointNumber == element) {
                      this.$refs.refTable.toggleRowSelection(item);
                    }
                  });
                });
              }
            });
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
    //关闭工单
    handleClose() {
      this.ruleForm.close = 0;
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
    //提交
    handleSubmit(formName) {
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
                  this.$message({
                    message: "工单关闭成功",
                    type: "success"
                  });
                  this.dialogFormVisible = false;
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
    handleReset(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
      this.ruleForm.close = 0;
    },
    // 取消编辑工单
    handleResetEdit(formName) {
      this.$refs[formName].resetFields();
      this.editWorkorderVisisble = false;
    },
    // 提交编辑工单
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
        .then(res => {
          res = res.data;
          loading.close();
          if (res.code == 1000) {
            this.DA_setInitialActive(res.data.customerType);
            this.promote_getBtnDisplay(res.data.workOrderNumber);
            let reportFlag = 0;
            this.woInfo = res.data;
            this.originalExecuteUserNumber = this.woInfo.executePersonNumber;
            this.pictureDtoList = this.woInfo.pictureDtoList || [];
            // this.ruleForm1.expectComingTime = this.woInfo.expectComingTime;
            // this.ruleForm1.contactMapAddress = this.woInfo.contactMapAddress;
            this.ruleForm1.shortDesc = this.woInfo.shortDesc;
            this.judgeCreateCase();
            this.judgeRevocation()
            if (this.woInfo.reportType != -1) {
              this.getReportList();
            } else {
              const tableData = res.data.psServiceTaskList;
              tableData.forEach(item => {
                if (item.reportPercent) {
                  ++reportFlag;
                }
              });
              this.reportStatus = reportFlag;
              this.taskTableData = tableData;
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
          } else {
            loading.close();
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          loading.close();
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
    judgeRevocation(){
      this.requestMethodGet("/emEcReport/getFromTypeRelatedId", { relatedId: this.woInfo.id,type:2}).then(res => {
        if (res.data.code == 1000) {
          this.revocationCaseType = res.data.data.fromType
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getReportList() {
      this.loading = true;
      let params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        current: 1,
        size: 100
      };
      this.requestMethodGet("/serviceReport/draftListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            let reportFlag = 0;
            const tableData = res.data.list;
            tableData.forEach(item => {
              if (item.perfectRate) {
                ++reportFlag;
              }
            });
            this.reportStatus = reportFlag;
            this.taskTableData = tableData;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
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
    }
  }
};
