export default {
  data() {
    return {
      textarea: "",
      submitDetail: {},
      exceptDetail: {},
      addLubricationPointsVisiable: false, // 调查任务弹框
      editWorkorderVisisble: false, // 编辑工单信息
      lubricationPointsSearch: "", // 筛选润滑点
      finishWorkorder: false, // 完结工单弹框
      executePersonNameVisiable: false, // 重新分配弹框
      engineerInfoList: [],
      engineerInfoToatl: 0,
      loadingPerson: false,
      pictureDtoList: [],
      PESpackageBtn: false,
      userOrRoleName: "",
      editAssectVisiable: false, //' 编辑意见 弹框可见'
      editAdviceInput: false, // 填写建议输入框
      lubricationPointAttributeList: [],
      mslaWorkOrderReportRel: {},
      queryParams: {
        taskName: ""
      },
      editForm: {
        date1: "",
        address: "",
        text: ""
      },
      formRemark: {
        remark: "" // 评价
      },
      isRequire: false, // 是否必填
      reasonWay: "", // 关闭工单原因
      starId: 0,
      starCount: 0,
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
        size: 10
      },
      contactDetail: {},
      // 工单信息
      woInfo: {},
      //表单验证
      ruleForm: {
        close: 0,
        text: "" //关闭原因
      },

      closeList: [
        { value: "0", label: "内容填错了" },
        { value: "1", label: "不再需要了" },
        // { value: "2", label: "重复提交" },
        { value: "3", label: "其他" }
      ],
      dialogFormVisible: false, //是否显示关闭说明，默认隐藏
      dialogTableVisibleWO: false, //是否展示工单跟踪，默认隐藏
      pageIndexDistributive: 1, // 分配人员弹框
      originalExecuteUserNumber: "", // 已有分配人的编码
      loadMoreData: false,
      userInfo: {},
      distributionPerson: {},
      EquipmentProfilBtn: false,
      showCreateCaseBtn:false,
      revocationCaseType:0
    };
  },

  components: {},

  computed: {},

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
    handlePesDetail() {
      this.$router.push({
        path: "/CustomerProfile/CustomerPesIndex",
        query: {
          pesInfoId: this.woInfo.pesInfoId,
          companyNumber:this.woInfo.contactCompanyNumber,
          resurce:'workOrder',
          companyId:this.woInfo.companyId
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
          this.canGetDevice(row);
        } else {
          // 判断是否有查看客户设备详情权限
          if (this.EquipmentProfilBtn) {
            this.$router.push({
              path: "/EquipmentProfile/EquipmentProfileDetail",
              query: {
                deviceNumber: row
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
    showPopverSubmit() {
      this.getUserDetail("submit");
    },
    showPopverExecute() {
      this.getUserDetail("except");
    },
    showPopver() {
      this.getUserDetail("contact");
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
    getCurrentTime() {
      //获取当前时间并打印
      let param = {
        workOrderNumber: this.woInfo.workOrderNumber,
        workFlowReportRemark:this.mslaWorkOrderReportRel.workFlowReportRemark
      };
      this.requestMethodPost("/weChat/workOrder/updateMslaWorkFlowReportRemark", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.editAdviceInput = false;
            this.$_getWOInfo(this.$route.query.workOrderNumber);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 完结工单
    handleFinish() {
      this.finishWorkorder = true;
    },
    // 选择分配人
    handleDistributionnChange(val) {
      this.distributionPerson = val;
    },
    // 取消分配工单
    handleResetDistribution() {
      this.distributionPerson = {};
      this.executePersonNameVisiable = false;
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
    handleResetFinish() {
      this.finishWorkorder = false;
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
    // 服务评价
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
    // 立即填写建议 / 编辑建议
    handleEditAdvice() {
      this.$gio.Track("clickEditReportButton", {
        workorderNumber: this.woInfo.workOrderNumber,
        serviceType: this.woInfo.serviceType
      });
      this.editAdviceInput = true;
    },
    // 确认完结工单
    sureFinishOrder() {
      if (!this.woInfo.serviceDtoList.length) {
        //工单执行人
        this.$alert("请先上传服务报告文件", "提示", {
          confirmButtonText: "我知道了",
          confirmButtonClass: "confirmButton",
          callback: action => {
            this.finishWorkorder = false;
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
        return;
      } else {
        let param = {
          workOrderNumber: this.woInfo.workOrderNumber
        };
        this.requestMethodPost("/weChat/workOrder/handle", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.finishWorkorder = false;
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
      }
    },
    handleResetAdvice() {
      this.editAdviceInput = false;
    },
    // 提交建议
    handleSubmitAdvice() {
      
      // 完结工单  调提交建议接口
      this.getCurrentTime();
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.userId;
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
      param.spId = this.woInfo.distributorCompanyId;
      param.accountId = this.woInfo.companyId;
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.engineerInfoToatl = res.data.totalCount;
            if (val == "select") {
              this.engineerInfoList = [];
              this.engineerInfoList = res.data.list;
            } else if (val == "more") {
              this.engineerInfoList = this.engineerInfoList.concat(res.data.list);
            } else {
              this.engineerInfoList = [];
              this.engineerInfoList = res.data.list;
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
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 编辑意见
    editAssect() {
      this.editAssectVisiable = true;
    },
    loadMore() {
      if (this.loadMoreData && this.engineerInfoList.length < this.engineerInfoToatl) {
        this.pageIndexDistributive++;
        this.handleDistributive("more");
      }
    },
    customColorMethod(percentage) {
      if (percentage <= 50) {
        return "#dd0000";
      } else {
        return "#008888";
      }
    },
    // 创建服务任务
    addLubricationPoints() {
      this.addLubricationPointsVisiable = true;
    },
    //编辑
    handleClose() {
      if (this.mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 4 || this.mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 6) {
        this.$message({
          message: "仅油样状态为已登记时可取消注册",
          type: "warning"
        });
      } else {
        this.dialogFormVisible = !this.dialogFormVisible;
        this.ruleForm.close = 0;
      }
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
            let desc = "";
            if (this.ruleForm.close == "3") {
              desc = this.ruleForm.text;
            } else {
              this.closeList.forEach(item => {
                if (this.ruleForm.close == item.value) {
                  desc = item.label;
                }
              });
            }
            const params = {
              userNumber: this.userInfo.userNumber,
              workOrderNumber: this.woInfo.workOrderNumber,
              cancelReasonDesc: desc
            };
            this.requestMethodPost("/weChat/workOrder/cancelOilWorkOrder", params).then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "取消成功",
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.$_getWOInfo(this.$route.query.workOrderNumber);
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            });
            // let params = {
            //   closeType: this.ruleForm.close,
            //   closeReason: this.ruleForm.text,
            //   workOrderNumber: this.woInfo.workOrderNumber
            // };
            // this.requestMethodPost("/web/workOrder/webCloseWorkOrder", params)
            //   .then(res => {
            //     res = res.data;
            //     if (res.code == 1000) {
            //         this.$message({
            //           message: '工单关闭成功',
            //           type: "success"
            //         });
            //       this.dialogFormVisible = false;
            //       this.$_getWOInfo(this.$route.query.workOrderNumber);
            //     } else {
            //       this.$message({
            //         message: res.msg,
            //         type: "warning"
            //       });
            //     }
            //   })
            //   .catch(res => {});
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
      this.ruleForm.close = 0;
      this.dialogFormVisible = false;
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
    getFullpath(halfPath) {
      let params = {
        url: halfPath
      };
      this.requestMethodGet("/web/file/getFullUrl", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$set(this.woInfo, 'executePersonHeadUrl', res.data)
          } else {
            this.$message({
              type: "warning",
              message: "获取全路径失败，请稍后重试。"
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
            console.log(this.pictureDtoList,99999)
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
            this.DA_setInitialActive(res.data.customerType);
            this.promote_getBtnDisplay(res.data.workOrderNumber);
            this.woInfo = res.data;
            if(this.woInfo.executePersonHeadUrl) {
              this.getFullpath(this.woInfo.executePersonHeadUrl)
            }
            this.mslaWorkOrderReportRel = this.woInfo.mslaWorkOrderReportRel || {};
            (this.lubricationPointAttributeList = this.mslaWorkOrderReportRel.lubricationPointAttribute ? JSON.parse(this.mslaWorkOrderReportRel.lubricationPointAttribute) : []),
            this.pictureDtoList = [];
            this.originalExecuteUserNumber = this.woInfo.executePersonNumber;
            this.woInfo.serviceDtoList.forEach(item => {
              item.attachmentTitle = item.attachmentUrl.split("/")[item.attachmentUrl.split("/").length - 1];
              item.attachmentType = item.attachmentTitle.split(".")[item.attachmentUrl.split(".").length - 1].toLowerCase();
            });
            this.judgeCreateCase()
            this.judgeRevocation()
            if (this.woInfo.pictureDtoList.length) {
              await this.handleIcon(this.woInfo.pictureDtoList);
              
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
    judgeCreateCase(){
      this.requestMethodGet('/emEcReport/checkPutButton',{workIds:this.woInfo.id}).then(res=>{
        if(res.data.code == 1000){
          this.showCreateCaseBtn = res.data.data.putButton
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
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
    // 查看工单状态详情
    handleLookWOStatus() {
      this.dialogTableVisibleWO = !this.dialogTableVisibleWO;
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 314}px`;
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
    //下载服务报告
    handleDownLoad(url) {},
    // 下载油样报告
    downLoadServiceReport(url) {
      const params = {
        url: url
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
