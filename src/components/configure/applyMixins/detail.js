export default {
  name: "EquipmentLubrTable",
  components: {},
  data() {
    return {
      reportTypeMap: {},
      cascaderAddrt: 1,
      changelOilRecord: {},
      selCompnyPeopleList: [],
      revertImg: [],
      preveselArr: [],
      itemObj: {},
      prevselLen: 0,
      revertVideo: "",
      openDrawFlag: false,
      abnormalStatus: 0,
      abnormalId: 0,
      detailData: {},
      questionForm: {},
      companyList: [],
      checkList: [],
      selectQuestionList: [],
      dialogFlag: false,
      lubricationPointTypeList: [],
      questionList: [], // 服务类型列表
      serviceItemList: [],
      detailDialogFlag: false,
      reasonFormVisible: false,
      serviceListVisible: false,
      dialogFormVisible: false,
      addWorkorderVisibled: false,
      isWorkorderCharge: false,
      executePersonNameVisiable: false,
      status: 2,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      queryParams: {
        name: "", // 客户名称
        status: "" // 状态
      },
      serviceTypeForm: {
        serviceType: ""
      },
      //  自定义属性
      industruPropsSelect: {
        emitPath: false,
        value: "serviceNumber",
        label: "serviceName",
        children: "children",
        multiple: true,
        disabled: "disabled"
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      ruleForm: {
        evaluatRemark: "",
        close: "",
        cancelReason: ""
      },
      rules: {
        cancelReason: [{ required: true, message: "请输入取消原因", trigger: "blur" }]
      },
      applyOrderRules: {
        customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
        // lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        // oilNumber: [{ required: true, message: "请选择油品种类", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "change" }]
      },
      //   表单验证规则
      serviceTypeRule: {
        serviceType: [{ required: true, message: "请选择服务类型", trigger: "change" }]
      },
      closeList: [{ value: "内容填写错误", label: "内容填写错误" }, { value: "不再需要了", label: "不再需要了" }, { value: "其他", label: "其他" }],
      typeList: [], // 服务类型列表
      engineerInfoList: [],
      engineerTotal: 0,
      distributionPersonId: "",
      pagenation: {
        current: 1,
        size: 30
      },
      personTitle: "",
      serviceItemListZhi: [],
      userOrRoleName: "",
      pageIndexDistributive: 1,
      loadMoreData: false,
      totalNumber: 0, // 总条数
      orderServiceRelId: 0,
      originalExecuteUserNumber: "",
      selectList: [],
      imgsStar: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        },
        {
          id: 5
        }
      ],
      starId: 0,
      starCount: 0,
      dialogTitle: "",
      loading: false, // 是否加载
      isCustomerAdmin: false, // 是否是工业客户管理员
      dialogOilChangeVisible: false, // 换油情况弹框
      valueCheckBoxList: [], // 换油情况选择的数据
      resultBox: false, // 换油情况是否选择的是前面四种情况的其中一个
      oilTypeList: [],
      oilChangefieldOption: [],
      noCancelFlag: false,
      abnormalDialog: false,
      servcieSuggestionRenderList: [],
      videoDialogVisible: false,
      customerDistributor: "",
      reportTypeSelect: "", // 选择的服务项的reportType
      showRoleNames: false,
      editDistributionDialogAndSubmit: false,
      iconEditFlag: false,
      rowObj: {},
      applylist: {
        serviceProperty: "",
        incomeBbl: "",
        incomeRmb: ""
      },
      revocationCaseType: 0
    };
  },
  filters: {
    applyStatus(status) {
      switch (status) {
        case 0:
          return "待确认";
        case 1:
          return "待处理";
        case 2:
          return "进行中";
        case 3:
          return "已完成";
        case 4:
          return "已取消";
        default:
          return "已评价";
      }
    },
    serviceStatus(status) {
      switch (status) {
        case 0:
        case 1:
          return "未开始";
        case 2:
          return "进行中";
        case 3:
          return "已完成";
        case 4:
          return "已取消";
        default:
          return "";
      }
    }
  },
  methods: {
    // 获取换油情况
    getOilChangeStatus() {
      this.requestMethodGet("/serviceReport/queryOilChangeStates")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilChangefieldOption = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    clearHandleSelectServiceType() {
      this.preveselArr = [];
      this.prevselLen = 0;
      this.changelOilRecord = {};
    },
    handleSelectServiceType(val) {
      console.log("getCheckedNodesgetCheckedNodes", this.$refs.cascaderAddr.getCheckedNodes());
      const nodes = this.$refs.cascaderAddr.getCheckedNodes();
      nodes
        .filter(node => !node.hasChildren)
        .some(item => {
          if (item.data.authorityRole) {
            const ownerRoleIds = this.$userInfo.roles.map(item => item.roleId.toString());
            const data = item.data;
            let authorityRoles = [];
            if (data.authorityRole) {
              authorityRoles = data.authorityRole.split(",").map(item => item.toString());
              const authorFlag = authorityRoles.some(item => ownerRoleIds.includes(item));
              console.log("this is authorFlag", authorFlag, authorityRoles, ownerRoleIds);
              if (!authorFlag) {
                this.disabledSelServiceItem = true;
                let msg = "";
                if (this.$userInfo.userType == "2") {
                  msg = `您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚当地授权经销商或者区域技术工程师解决服务申请事宜。`;
                } else {
                  msg = `您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚区域技术工程师解决服务申请事宜。`;
                }
                this.$message({
                  type: "warning",
                  message: msg
                });

                item.checked = false;
                this.$nextTick(() => {
                  setTimeout(() => {
                    const index = this.serviceTypeForm.serviceType.findIndex(number => number == item.data.serviceNumber);
                    if (index > -1) {
                      this.serviceTypeForm.serviceType.splice(index, 1);
                    }
                  }, 100);
                });
              }
              return true;
            }
          }
        });
      let increaseItem = null;
      if (val.length > this.prevselLen) {
        val.some(item => {
          if (!this.preveselArr.includes(item)) {
            increaseItem = item;
            return true;
          }
        });
      }
      // setTimeout(() => {
      //   if (this.serviceTypeForm.serviceType.length > 1) {
      //     this.serviceTypeForm.serviceType = [...this.serviceTypeForm.serviceType.splice(1)];
      //   }
      // }, 100);
      this.prevselLen = val.length;
      this.preveselArr = val;
      if (this.reportTypeMap[increaseItem] == 11) {
        this.currentSelChangeOilServiceNumber = increaseItem;
        this.dialogOilChangeVisible = true;
        this.valueCheckBoxList = [];
        this.getOilChangeStatus();
      }
      let selectServiceNumber = val;
      this.typeList.map(item => {
        if (item.children) {
          item.children.map(i => {
            if (i.children) {
              i.children.map(t => {
                if (t.serviceNumber == selectServiceNumber) {
                  this.reportTypeSelect = t.reportType;
                }
              });
            } else {
              if (i.serviceNumber == selectServiceNumber) {
                this.reportTypeSelect = t.reportType;
              }
            }
          });
        } else {
          if (item.serviceNumber == selectServiceNumber) {
            this.reportTypeSelect = t.reportType;
          }
        }
      });
    },
    getCustomerDistributor() {
      this.requestMethodGetTip("/serviceApply/serviceApplyCustomerDdealerCompany").then(res => {
        if (res.data.code == 1000) {
          this.customerDistributor = res.data.companyName;
        }
      });
    },
    selCompanyPeople() {
      if (this.userInfo.userType == 2) return;
      if (!this.questionForm.customerId) {
        return this.$message({
          type: "warning",
          message: "请先选择客户"
        });
      }
    },
    clearPeopleList() {
      this.questionForm.contactUserId = [];
      this.selCompnyPeopleList = [];
    },
    async getCompanyPeople(companyNumber, companyId) {
      if (companyId) {
        this.distributionPersonId = "";
        this.executeUserName = "";
        this.executeUserRoles = "";
        // 获取当前客户是否是分管人且有执行权限
        const res = await this.requestMethodGet("/serviceApply/applyLoginUserJudgement", { companyId });
        if (res.data.code == 1000) {
          const { userId, userName, accessTemplateNames } = res.data.data;
          this.distributionPersonId = userId;
          this.executeUserRoles = accessTemplateNames.join("/");
          this.executeUserName = userName;
          this.showRoleNames = true;
        } else {
          this.showRoleNames = false;
        }
      }
      // if (!(this.executePermissionFlag && !this.hasDistributeBtn)) {
      //   // this.distributionPersonId = "";
      //   // this.executeUserName = "";
      //   // this.executeUserRoles = "";
      //   // this.showRoleNames = false;
      // }
      this.questionForm.contactUserId = [];
      this.selCompnyPeopleList = [];
      const params = {
        useFlag: 1,
        companyNumber,
        current: 1,
        size: 300
      };
      if (this.userInfo.userType == 1) params.companyFlag = true;
      const peopleListRes = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", params);
      if (peopleListRes.data.code == 1000) {
        this.selCompnyPeopleList = peopleListRes.data.data.list;
      }
    },
    openVideo() {
      this.videoDialogVisible = true;
    },
    closeVideo() {
      this.videoDialogVisible = false;

      this.$refs.videoPlayer.pause();
    },
    handleRenderServiceList() {
      const renderList = [];
      const { reasonConfList } = this.detailData;
      const suggestionsMap = new Map();
      this.questionList.map(item => {
        const { children } = item;
        children.map(item => suggestionsMap.set(item.id.toString(), item));
      });
      reasonConfList.forEach(item => {
        renderList.push(suggestionsMap.get(item.toString()));
      });
      this.servcieSuggestionRenderList = renderList;
    },
    viewSuggestions() {
      this.handleRenderServiceList();
      this.$refs.serviceSuggestion.open();
    },
    // 查看异常
    viewAbnormal() {
      this.abnormalDialog = true;
    },
    // 异常详情
    handleAbnormal(item) {
      this.abnormalDialog = false;
      this.abnormalStatus = item.abnormalStatus;
      this.abnormalId = item.id;
      this.openDrawFlag = true;
    },
    refreshList() {
      this.getApplyOrderDetail(this.$route.query.id);
      this.openDrawFlag = false;
    },
    closeDraw() {
      this.openDrawFlag = false;
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
          this.scoreRemark = "极差";
          break;
        case 2:
          this.scoreRemark = "一般";
          break;
        case 3:
          this.scoreRemark = "满意";
          break;
        case 4:
          this.scoreRemark = "非常满意";
          break;
        default:
          this.scoreRemark = "无可挑剔";
          break;
      }
    },
    handleResetAdd() {
      this.dialogFlag = false;
    },
    getOilTypeData() {
      this.requestMethodGet("/serviceApply/getOilLv2")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilTypeList = this.formatData1(res.data.list);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData1(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.formatData1(data[i].children);
        }
      }
      return data;
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      // this.getCompanyData(val)
    },
    getCompanyData(val) {
      if (this.$userInfo.userType == 2) return;
      let param = {
        size: 500,
        searchCompanyName: val,
        menuCode:'CustomerProfileList'
      };
      this.companyList = [];
      this.requestMethodPostTip("/web/customer/filterAccount", param)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            let list = data.filter(it => {
              return it.companyId == this.detailData.customerId;
            });
            let obj = {
              companyName: this.detailData.customerCompanyName,
              companyNumber: this.detailData.customerCompanyNumber,
              companyId: this.detailData.customerId,
              customerType: this.detailData.customerType
            };
            if (!list.length) {
              data.push(obj);
            }
            this.companyList = data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询润滑点
    $_queryLPData() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lubricationPointTypeList = res.data;
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
    //  获取问题列表
    getApplyReasonConfTree() {
      let params = { status: 1 };
      this.requestMethodGet("/serviceApply/reasonConf/queryServiceApplyReasonConfTree", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.questionList = res.data;
            this.questionList.forEach(item => {
              item.checkList = [];
            });
            this.activeQuestion = this.questionList[0].id;
            this.checkboxList = this.questionList[0].children;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
    },
    // 编辑申请单
    editApplyOrder() {
      this.getCompanyData();
      this.getOilTypeData(); // 获取二级油品
      this.$_queryLPData();
      this.questionForm = {
        customerId: this.detailData.customerId,
        // oilNumber: JSON.parse(this.detailData.oilNumber)[JSON.parse(this.detailData.oilNumber).length - 1],
        // lubricationPointTypeCode: JSON.parse(this.detailData.lubricationPointTypeCode)[0],
        description: this.detailData.description,
        contactUserId: this.detailData.customerContactPersonId ? this.detailData.customerContactPersonId.split(",") : ""
      };
      (this.applylist = {
        serviceProperty: this.detailData.serviceProperty,
        incomeBbl: this.detailData.incomeBbl,
        incomeRmb: this.detailData.incomeRmb
      }),
        this.servicePropertyChange(this.detailData.serviceProperty);
      this.handleExcuteUserInfo();
      this.selectQuestionList = this.detailData.questionKeyList;
      this.checkList = this.detailData.reasonConfList.map(i => parseInt(i, 0));
      this.questionList.forEach(item => {
        item.checkList = [];
        this.checkList.forEach(it => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(check => {
              if (it == check.id) {
                item.checkList.push(it);
                item.checkList = [...new Set(item.checkList)];
              }
            });
          }
        });
      });

      this.dialogFlag = true;
      this.$gio.ServiceApplyDetail({
        applicationNumber: this.detailData.applicationNumber
      });
    },
    handleExcuteUserInfo() {
      let roles = "";
      let name = "";
      let userId = "";
      if (this.executePermissionFlag && !this.hasDistributeBtn) {
        roles = this.userInfo.accessTemplateNames.join("/");
        name = this.userInfo.userName;
        userId = this.userInfo.userId;
      }
      if (this.detailData.executeUserRoleNameList && this.detailData.executeUserRoleNameList.length) {
        roles = this.detailData.executeUserRoleNameList.join("/");
        name = this.detailData.executeUserName;
      }
      if (this.detailData.executeUserId) {
        userId = this.detailData.executeUserId;
      }
      this.executeUserRoles = roles;
      this.executeUserName = name;
      if ((!this.hasDistributeBtn && this.executePermissionFlag) || this.hasDistributeBtn) {
        this.showRoleNames = true;
      }
      this.distributionPersonId = userId;
    },
    closeDialog() {
      this.dialogFlag = false;
    },
    // 服务类型
    $_getServiceList(val) {
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceApplyOrderId: this.detailData.id,serviceDisplay: 1 })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.typeList = this.formatData(res.data);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children.length) {
          this.reportTypeMap[data[i].serviceNumber] = data[i].reportType;
          data[i].children = null;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    addServiceItem() {
      this.$_getServiceList(); // 获取服务类型列表
      this.serviceTypeForm.serviceType = "";
      this.addWorkorderVisibled = true;
    },
    changebox(val) {
      if (val.length) {
        if (val[val.length - 1] == "0") {
          this.valueCheckBoxList = ["0"];
        }
        if (val[val.length - 1] != "0") {
          // 有正常得选项
          let index = val.findIndex(it => it == "0");
          if (index > -1) {
            val.splice(index, 1);
            this.valueCheckBoxList = val;
          }
        }
      }
      this.resultBox = this.valueCheckBoxList.find(item => {
        return item == 1 || item == 2 || item == 3 || item == 4;
      });
    },
    // 确认继续
    confirmContiun() {
      if (this.valueCheckBoxList.length > 0) {
        this.changelOilRecord[this.currentSelChangeOilServiceNumber] = this.valueCheckBoxList.toString();
        this.dialogOilChangeVisible = false;
        this.currentSelChangeOilServiceNumber = "";
        this.valueCheckBoxList.length = 0;
      } else {
        this.$message({
          message: "请选择换油情况",
          type: "warning"
        });
      }
      //
    },
    // 取消选择换油情况
    consoleOilChange() {
      var index = this.serviceTypeForm.serviceType.indexOf(this.currentSelChangeOilServiceNumber);
      this.$nextTick(() => {
        this.serviceTypeForm.serviceType.splice(index, 1);
      });
      this.$refs.cascaderAddr.$refs.panel.checkedValue = []; //也可以是指定的值，默认返回值是数组，也可以返回单个值
      this.$refs.cascaderAddr.$refs.panel.activePath = [];
      this.$refs.cascaderAddr.$refs.panel.syncActivePath();
      this.$refs.cascaderAddr.$refs.panel.calculateCheckedNodePaths();
      this.$refs.cascaderAddr.$refs.panel.calculateMultiCheckedValue();
      ++this.cascaderAddrt;
      this.dialogOilChangeVisible = false;
      this.prevselLen = this.prevselLen - 1;
    },
    // 新建工单调接口
    submitWorkOrder(params) {
      this.requestMethodPost("/serviceApply/addServiceItem", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogOilChangeVisible = false;
            this.addWorkorderVisibled = false;
            this.getApplyOrderDetail(this.$route.query.id);
            this.$gio.submitAddServiceItems({
              applicationNumber: this.detailData.serviceApplyNo
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 确定新建工单
    sureAddWorkOrder(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const applyOrderItemList = this.serviceTypeForm.serviceType.map(item => {
            const obj = {
              serviceNumber: item
            };
            if (this.reportTypeMap[item] == 11) {
              obj.oilChangeState = this.changelOilRecord[item];
            }
            return obj;
          });
          const params = {
            id: this.detailData.id,
            applyOrderItemList
          };
          this.submitWorkOrder(params);
        } else {
          return false;
        }
      });
    },
    selectOilNumber(val) {
      this.questionForm.oilNumber = val[val.length - 1];
    },
    // 编辑-确定
    sureAddWork(formName) {
      if (
        this.detailData.serviceApplyStatus < 3 &&
        this.hasDistributeBtn &&
        ((this.detailData.buttonFlag && this.userInfo.userType == 1) || ((this.detailData.customerType == 1 || this.detailData.customerType == 2) && this.userInfo.userType == 0)) &&
        !this.distributionPersonId
      ) {
        this.$message({
          message: "请选择执行人",
          type: "warning"
        });
        return;
      }
      if (this.checkList.length == 0) {
        this.$message({
          message: "请先选择遇到的问题",
          type: "warning"
        });
        return;
      }
      if (this.userInfo.userType != 2 && !this.applylist.serviceProperty) {
        this.$message({
          message: "请选择服务创盈属性",
          type: "warning"
        });
        return;
      }
      if (this.userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty == 4 && !this.applylist.incomeRmb) {
        this.$message({
          message: "请输入预估收益",
          type: "warning"
        });
        return;
      }
      if (this.userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty != 4 && !this.applylist.incomeBbl) {
        this.$message({
          message: "请输入预估收益",
          type: "warning"
        });
        return;
      }
      if (this.checkList.indexOf(2) != -1 && !this.questionForm.description) {
        this.$message({
          message: "请输入详情描述",
          type: "warning"
        });
        return;
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let param = {
            id: this.detailData.id,
            customerId: this.questionForm.customerId,
            serviceNumber: this.serviceTypeForm.serviceType,
            description: this.checkList.indexOf(2) != -1 ? this.questionForm.description : "",
            distributorId: this.userInfo.distributorId,
            reasonConfList: this.checkList,
            serviceApplyType: 1,
            executeUserId: this.distributionPersonId,
            serviceProperty: this.applylist.serviceProperty,
            incomeBbl: this.applylist.incomeBbl,
            incomeRmb: this.applylist.incomeRmb
          };
          if (this.userInfo.userType != 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.userInfo.companyId;
          } else {
            param.customerId = this.userInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);
          this.requestMethodPost("/serviceApply/editServiceApplyOrder", param)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.dialogFlag = false;
                // if (this.userInfo.userType != 2 && (this.hasDistributeBtn || (this.executePermissionFlag && !this.hasDistributeBtn)) && this.distributionPersonId) {
                //   this.submitApplyOrder();
                // }
                if (this.distributionPersonId != this.userInfo.userId) {
                  this.$router.push({
                    path: "/ServiceApplyList"
                  });
                } else {
                  setTimeout(() => {
                    this.getApplyOrderDetail(this.$route.query.id);
                  }, 1000);
                }
                this.$gio.editApplication({
                  applicationNumber: this.detailData.serviceApplyNo
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 取消申请单
    cancelApplyOrder() {
      for (let item of this.detailData.serviceApplyOrderServiceItemDtoList) {
        if (item.workOrderStatus != 0 && item.workOrderStatus != 4 && item.workOrderStatus) {
          this.$message({
            message: "服务项需要处于未开始/已关闭状态时，才允许取消申请单",
            type: "warning"
          });
          flag = true;
          return;
        }
      }
      this.ruleForm.close = "";
      this.ruleForm.cancelReason = "";
      this.dialogFormVisible = true;
    },
    handServiceItem(row = {}) {
      let param = {
        id: this.detailData.id,
        serviceNumber: row.serviceNumber
      };
      this.requestMethodGet("/serviceApply/queryServiceItemList", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceItemListZhi = res.data;
            this.serviceItemList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
      if (row.serviceNumber) {
        this.serviceListVisible = true;
      }
    },
    handReport(row) {
      if (row.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
      if (row.serviceType == 9 || row.serviceType == 10 || row.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
      if (row.serviceType == 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
      this.$gio.clickViewServiceItemsButton({
        applicationNumber: row.serviceNumber
      });
    },
    openAddOrder(row) {
      console.log("row.......", row);
      if (row.serviceType == "1") {
        this.getHintContOil();
      } else {
        this.getHintCont();
      }
      this.rowObj = row;
      this.dialogCheckedVisible = true;
    },
    // 同意免责条款
    confirmChecked() {
      this.dialogCheckedVisible = false;
      if (this.rowObj.serviceType == "1") {
        this.$router.push({
          path: "/NewWorkOrderList/AddWorkOrderOil",
          query: {
            serviceType: this.rowObj.serviceType,
            serviceLevel: this.rowObj.serviceLevel,
            mslaServiceType: this.rowObj.mslaServiceType,
            serviceNumber: this.rowObj.serviceNumber,
            typeName: this.rowObj.serviceName,
            serviceApplyOrderId: this.detailData.id,
            companyNumber: this.detailData.customerCompanyNumber,
            companyName: this.detailData.customerCompanyName,
            companyId: this.detailData.customerId,
            resource: "apply",
            enterFrom: "serviceApply",
            applyServiceItemId: this.rowObj.id,
            openOrderType: "serviceApply",
            isNormal: 2,
            isChecked: true,
            spId: this.detailData.distributorId
          }
        });
      } else {
        this.$router.push({
          path: "/NewWorkOrderList/AddWorkOrder",
          query: {
            serviceNumber: this.rowObj.serviceNumber,
            addServiceType: this.rowObj.serviceType,
            typeName: this.rowObj.serviceName,
            serviceId: this.rowObj.serviceId,
            reportType: this.rowObj.reportType,
            paramDataLubFlag: this.rowObj.paramDataLubFlag,
            coreDataLubFlag: this.rowObj.coreDataLubFlag,
            coreDataTemplateId: this.rowObj.coreDataTemplateId,
            serviceApplyOrderId: this.detailData.id,
            companyNumber: this.detailData.customerCompanyNumber,
            companyName: this.detailData.customerCompanyName,
            companyId: this.detailData.customerId,
            resource: "apply",
            enterFrom: "serviceApply",
            applyServiceItemId: this.rowObj.id,
            openOrderType: "serviceApply",
            isNormal: 1,
            isChecked: true,
            spId: this.detailData.distributorId
          }
        });
      }
    },
    deletePerson() {
      this.$confirm("确认删除执行人?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          this.requestMethodPost("/serviceApply/deleteExecuteUser", { id: this.detailData.id })
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getApplyOrderDetail(this.$route.query.id);
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        })
        .catch(err => {});
    },
    deleteServiceItem(id) {
      this.$confirm("确认删除服务项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          this.requestMethodPost("/serviceApply/deleteServiceItem", { orderServiceRelId: id })
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$gio.deleteServiceItems({
                  applicationNumber: this.detailData.serviceApplyNo
                });
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getApplyOrderDetail(this.$route.query.id);
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        })
        .catch(err => {});
    },
    handleEvaluateRemark() {
      this.reasonFormVisible = true;
    },
    submitEvaluateRemark(formName) {
      // 提交前请先打分或评价
      if (!this.ruleForm.evaluatRemark && this.starId == 0) {
        this.$message({
          message: "提交前请先打分或评价",
          type: "error"
        });
        return;
      }
      this.$gio.evaluateApplication({
        applicationNumber: this.detailData.serviceApplyNo,
        operation: "点击评价按钮"
      });
      let param = {
        id: this.detailData.id,
        evaluateContent: this.ruleForm.evaluatRemark,
        point: this.starId
      };
      this.requestMethodPost("serviceApply/evaluateServiceApplyOrder", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "评价成功",
              type: "success"
            });
            this.reasonFormVisible = false;
            this.getApplyOrderDetail(this.$route.query.id);
            this.$gio.evaluateApplication({
              applicationNumber: this.detailData.serviceApplyNo,
              operation: "提交评价"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
      //   }
      // })
    },
    // 获取详情信息
    async getApplyOrderDetail(val) {
      if (!val) return;
      this.loading = true;
      let params = {
        id: val
      };
      await this.requestMethodGet("/serviceApply/serviceApplyOrderDetail", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            ++this.serviceItemKey
            ++this.refreshBtnKey
            this.promote_getBtnDisplay_apply(res.data.id);
            this.serviceItemList = res.data.serviceApplyOrderServiceItemDtoList;
            res.data.executeUserRoleName = res.data.executeUserRoleNameList ? res.data.executeUserRoleNameList.join("/") : "";
            this.detailData = res.data;
            this.getCompanyPeople(res.data.customerCompanyNumber);
            if (this.detailData.serviceImgFullUrlList && this.detailData.serviceImgFullUrlList.length > 0) {
              const arr = this.detailData.serviceImgFullUrlList.map((item, index) => ({
                url: item.url,
                halfPath: item.submitImgUrl,
                name: "img" + index
              }));
              this.revertImg = arr;
            }
            if (this.detailData.videoFullUrl) {
              this.revertVideo = res.data.videoFullUrl;
            }
            // 更新---接收详情接口返回服务创赢收益与预估收益并赋值
            this.applylist.serviceProperty = this.detailData.serviceProperty;
            this.applylist.incomeBbl = this.detailData.incomeBbl;
            this.applylist.incomeRmb = this.detailData.incomeRmb;

            this.loading = false;
            // this.judgeCreateCase();
            this.judgeRevocation();
            switch (this.detailData.point) {
              case 0:
                this.scoreRemark = "";
                break;
              case 1:
                this.scoreRemark = "极差";
                break;
              case 2:
                this.scoreRemark = "一般";
                break;
              case 3:
                this.scoreRemark = "满意";
                break;
              case 4:
                this.scoreRemark = "非常满意";
                break;
              default:
                this.scoreRemark = "无可挑剔";
                break;
            }
            this.distributionPersonId = res.data.executeUserId;
            if (this.userInfo.userType < 2) {
              this.handServiceItem();
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // judgeCreateCase() {
    //   this.requestMethodGet("/emEcReport/checkPutButton", { workIds: this.detailData.workIds.toString() }).then(res => {
    //     if (res.data.code == 1000) {
    //       // putButton ： 1，有；0，无
    //       this.showCreateCaseBtn = res.data.data.putButton;
    //     } else {
    //       this.$message({
    //         message: res.data.msg,
    //         type: "error"
    //       });
    //     }
    //   });
    // },
    judgeRevocation() {
      this.requestMethodGet("/emEcReport/getFromTypeRelatedId", { relatedId: this.detailData.id, type: 1 }).then(res => {
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
    // 详情执行人-分配
    distributionAndSumbit() {
      this.handleExcuteUserInfo();
      this.DA_setInitialActive(this.detailData.customerType);
      this.personTitle = "分配人员";
      this.iconEditFlag = true;
      this.executePersonNameVisiable = true;
      this.handleDistributive();
    },
    // 编辑申请单-分配
    editDistributionDialog() {
      this.$refs["questionForm"].validateField(["customerId"], err => {
        if (!err) {
          this.DA_setInitialActive(this.detailData.customerType);
          this.personTitle = "分配人员";
          this.editDistributionDialogAndSubmit = true;
          this.executePersonNameVisiable = true;
          this.handleDistributive();
        }
      });
    },
    changeContact() {
      this.distributionPersonId = "";
      this.executeUserRoles = "";
      this.executeUserName = "";
      this.showRoleNames = false;
    },
    // 分配弹窗
    distributionDialog(val, item) {
      this.DA_setInitialActive(this.detailData.customerType);
      this.personTitle = val;
      if (item) {
        this.orderServiceRelId = item.id;
        this.originalExecuteUserNumber = item.serviceChargeUserNumber;
        this.itemObj = item;
      }
      if (this.personTitle == "服务负责人") {
        this.distributionPersonId = item.serviceChargeUserId;
      } else {
        this.distributionPersonId = this.detailData.executeUserId;
      }
      this.executePersonNameVisiable = true;
      this.handleDistributive("");
    },
    // 获取分配人员
    handleDistributive(val) {
      if (val == "more") {
        this.pageIndexDistributive++;
      } else {
        this.pageIndexDistributive = 1;
        this.engineerInfoList = [];
      }
      this.loadMoreData = true;
      let param = {
        useStateFlag: 1,
        current: this.pageIndexDistributive,
        userOrRoleName: this.userOrRoleName,
        workOrderBelongCompanyId: this.detailData.customerId
      };
      if (this.itemObj && this.itemObj.authorityRole) {
        param.authorityRole = this.itemObj.authorityRole;
      }
      param.userBelongType = this.active;
      if (this.detailData.distributorCompanyType == 1) {
        param.distributorId = this.detailData.distributorId;
      }
      if (this.active == 3) {
        if (this.iconEditFlag) {
          let customerContactPersonId = this.detailData.customerContactPersonId;
          param.contactPersonId = customerContactPersonId ? customerContactPersonId.split(",")[0] : "";
        } else {
          let contactUserId = this.questionForm.contactUserId;
          param.contactPersonId = contactUserId && contactUserId.length ? contactUserId[0] : "";
        }
      }
      // 新建申请单是已经去掉了联系人字段
      if (this.personTitle == "服务负责人") {
        let customerContactPersonId = this.detailData.customerContactPersonId;
        param.contactPersonId = customerContactPersonId ? customerContactPersonId.split(",")[0] : "";
      }
      param.accountId = this.detailData.customerId;
      param.spId = this.detailData.distributorId;
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          this.loadMoreData = false;
          if (res.code == 1000) {
            this.engineerInfoList = [...this.engineerInfoList, ...res.data.list];
            this.engineerTotal = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getRowKey(row) {
      return row.userId;
    },
    // 选择分配人
    handleDistributionnChange(row) {
      this.distributionPersonId = row.userId;
      this.executeUserRoles = row.roleDtoList
        .map(it => {
          return it.accessTemplateName;
        })
        .join("/");
      this.executeUserName = row.userName;
      this.showRoleNames = true;
    },
    cancelDistribution(){
      this.executePersonNameVisiable = false;
      this.distributionPersonId = detailData.executeUserId;
      this.executeUserName = detailData.executeUserName;
    },
    loadMore() {
      if (!this.loadMoreData && this.engineerTotal > this.engineerInfoList.length) {
        this.handleDistributive("more");
      }
    },
    // 提交分配
    submitDistribution() {
      if (this.editDistributionDialogAndSubmit && this.distributionPersonId) {
        this.executePersonNameVisiable = false;
        this.editDistributionDialogAndSubmit = false;
        return;
      }
      if (!this.distributionPersonId) {
        this.$message({
          message: "请选择执行人",
          type: "warning"
        });
        return;
      }
      if (this.distributionPersonId) {
        let param = {
          executeUserId: this.distributionPersonId,
          id: this.detailData.id
        };
        let url = "/serviceApply/distributeExecuteUser";
        if (this.personTitle == "服务负责人") {
          param = {
            serviceChargeUserId: this.distributionPersonId,
            orderServiceRelId: this.orderServiceRelId
          };
          url = "/serviceApply/addServiceItemChargeUser";
        }
        this.requestMethodPost(url, param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              // 调取消息未读数据
              this.$parent.msgCount();
              this.$message({
                message: this.personTitle == "服务负责人" ? "服务负责人分配成功" : "申请单分配成功",
                type: "success"
              });
              this.showRoleNames = true;
              this.executePersonNameVisiable = false;
              if (this.personTitle == "服务负责人") {
                this.getApplyOrderDetail(this.$route.query.id);
              } else {
                if (this.userInfo.userType != 2 && (this.hasDistributeBtn || (this.executePermissionFlag && !this.hasDistributeBtn)) && this.distributionPersonId) {
                  this.submitApplyOrder();
                }
                if (this.distributionPersonId != this.userInfo.userId) {
                  this.$router.push({
                    path: "/ServiceApplyList"
                  });
                } else {
                  setTimeout(() => {
                    this.getApplyOrderDetail(this.$route.query.id);
                  }, 1500);
                }
              }
              this.$gio.submitAssignExecutor({
                applicationNumber: this.detailData.serviceApplyNo
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
          message: "请选择用户",
          type: "warning"
        });
      }
    },
    submitApplyOrder() {
      if (!this.distributionPersonId) {
        this.$message({
          message: "请先分配执行人",
          type: "warning"
        });
        return;
      }
      let param = {
        executeUserId: this.distributionPersonId,
        id: this.detailData.id
      };
      this.requestMethodPost("/serviceApply/submitServiceApplyOrder", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            // 调取消息未读数据
            this.$parent.msgCount();
            // this.$message({
            //   message: "提交成功",
            //   type: "success"
            // });
            if (this.detailData.executeUserId == this.userInfo.userId) {
              setTimeout(() => {
                this.getApplyOrderDetail(this.$route.query.id);
              }, 1000);
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
    handleSubmitCloseReason(formName) {
      if (!this.ruleForm.close) {
        this.$message({
          message: "请选择取消原因",
          type: "warning"
        });
        return;
      }
      this.$gio.cancelApplication({
        applicationNumber: this.detailData.serviceApplyNo,
        operation: "弹窗中点击提交"
      });
      this.$refs[formName].validate(valid => {
        if (valid) {
          //  校验是否可取消
          const params = {
            serviceApplyOrderId: this.detailData.id
          };
          this.requestMethodGet("/serviceApply/cancelServiceApplyOrderCheck", params).then(res => {
            if (res.data.code == 1000) {
              if (res.data.data) {
                this.cancelApply();
              } else {
                this.noCancelFlag = true;
              }
              this.$gio.cancelApplication({
                applicationNumber: this.detailData.serviceApplyNo,
                operation: "申请单详情页点击取消按钮"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    // 取消申请
    cancelApply() {
      let param = {
        id: this.detailData.id,
        cancelReason: this.ruleForm.close == "其他" ? this.ruleForm.cancelReason : this.ruleForm.close
      };
      this.requestMethodPost("/serviceApply/cancelServiceApplyOrder", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$router.back();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    endApplyOrder() {
      if (!this.detailData.serviceApplyOrderServiceItemDtoList.length) {
        this.$message({
          message: "请先添加服务项",
          type: "warning"
        });
        return;
      }
      let flag = false;
      for (let item of this.detailData.serviceApplyOrderServiceItemDtoList) {
        if (item.workOrderStatus < 2) {
          this.$message({
            message: "请先完成服务项",
            type: "warning"
          });
          flag = true;
          break;
        }
      }
      if (flag) {
        return;
      }
      // TODO - 这里需要提示补全申请单
      if (
        this.detailData.serviceApplyStatus < 3 &&
        this.hasDistributeBtn &&
        ((this.detailData.buttonFlag && this.userInfo.userType == 1) || ((this.detailData.customerType == 1 || this.detailData.customerType == 2) && this.userInfo.userType == 0)) &&
        !this.distributionPersonId
      ) {
        this.openShowCompleteModal();
        return;
      }
      if (this.userInfo.userType != 2 && !this.applylist.serviceProperty) {
        this.openShowCompleteModal();
        return;
      }
      if (this.userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty == 4 && !this.applylist.incomeRmb) {
        this.openShowCompleteModal();
        return;
      }
      if (this.userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty != 4 && !this.applylist.incomeBbl) {
        this.openShowCompleteModal();
        return;
      }
      let param = {
        id: this.detailData.id
      };
      this.requestMethodPost("/serviceApply/finishServiceApplyOrder", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$gio.clickCompleteButton({
              applicationNumber: this.detailData.serviceApplyNo
            });
            // 调取消息未读数据
            this.$parent.msgCount();
            this.$message({
              message: "申请单已完成",
              type: "success"
            });
            this.getApplyOrderDetail(this.$route.query.id);
            this.$router.push({
              path: "/ServiceApplyList"
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
    // 提示补全申请单信息
    openShowCompleteModal() {
      this.$confirm("申请单必填信息缺失，请补全后重新尝试完结申请单", "补全申请单信息", {
        confirmButtonText: "前往补全",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        this.editApplyOrder();
      });
    }
  }
};
