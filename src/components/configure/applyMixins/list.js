export default {
  data() {
    return {
      selRevetType: "",
      revertTypeList: [
        {
          label: "客户退回",
          value: 2
        },
        {
          label: "美孚/经销商撤回",
          value: 1
        },
        {
          label: "无撤回退回",
          value: 0
        }
      ],
      selCompnyPeopleList: [],
      questionForm: {
        description: "",
        contactUserId: []
      },
      lookMain: 0,
      oilTypeList: [],
      companyList: [], // 公司数据
      lubricationPointTypeList: [], // 润滑点设备类型
      selectQuestionList: [],
      applyTypeData: [],
      //  自定义属性
      industruPropsSelect: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children"
      },
      //   表单验证规则
      serviceTypeRule: {
        customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        oilNumber: [{ required: true, message: "请选择油品种类", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "blur" }]
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      addWorkorderVisibled: false, // 新建工单
      loadingInput: false,
      downLoadWorkorder: false, // 导出工单
      dialogTableVisible: false,
      list: [],
      queryParams: {
        serviceApplyStatus: "5", //状态
        serviceApplyNo: "",
        customerName: "",
        serviceApplyType: "",
        distributorName: ""
      },
      applyTime: [],
      questionList: [], //服务类型列表
      pickerOptions: {
        shortcuts: [
          {
            text: "选择今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      woTableData: [], //工单列表
      checkList: [], //选中的问题
      loading: false, //是否展示加载动画，默认隐藏
      totalNumber: 0, //总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      statusNum: {
        totalNum: 0,
        beConfirmedNum: 0,
        onGoingNum: 0,
        ToEvaluateNum: 0,
        completedNum: 0,
        closedNum: 0
      },
      selectServiceNumber: "",
      typeName: "",
      applyUserDetail: {}
    };
  },
  components: {},
  filters: {
    filterStatus(status) {
      switch (status) {
        case 0:
        case 1:
          return "color:#dd0000";
        case 2:
          return "color:#008888";
        default:
          return "color:#999";
      }
    },
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
        default:
          return "已取消";
      }
    }
  },
  computed: {},
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current;
    this.queryParams.size = this.pagenation.size;
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/ServiceApplyList/ServiceApplyDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  created() {
    if (this.userInfo.userType == 2) {
      // this.getCompanyPeople(this.userInfo.companyNumber);
      this.selCompnyPeopleList.push(this.userInfo);
    }
  },
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.getWorkorderNum();
    this.getApplyReasonConfTree();
    this.$_queryApplyType();
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 240}px`;
      })();
    };
  },

  methods: {
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
    changeCompany(companyNumber) {
      this.selCompnyPeopleList = [];
      this.questionForm.contactUserId = [];
      this.getCompanyPeople(companyNumber);
    },
    async getCompanyPeople(companyNumber) {
      if (this.userInfo.userType == 2) return;
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
    closeServiceDialog() {
      this.$refs.uploadVideoImg.cancelUplaod();
    },
    changeLookMain(val) {
      this.lookMain = val;
      this.$_getWOData();
    },
    // 查询创建类型
    $_queryApplyType() {
      this.requestMethodGet("/serviceApply/getServiceApplyType")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.applyTypeData = res.data;
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
    //查询润滑点
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
        searchCompanyName: ""
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", param)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.companyList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 新建工单
    handleAddWorkOrder() {
      this.getCompanyData();
      this.getOilTypeData();
      this.$_queryLPData();
      this.questionForm = {
        description: "",
        contactUserId: []
      };
      if (this.userInfo.userType == 2) {
        this.questionForm.contactUserId = [this.userInfo.userId];
      }
      this.checkList = [];

      this.addWorkorderVisibled = true;
    },
    handleResetAdd(formName) {
      this.addWorkorderVisibled = false;
      this.$refs[formName].resetFields();
    },
    // 确定新建申请单
    sureAddWorkOrder(formName) {
      if (!this.checkList.length) {
        this.$message({
          message: "请选择问题",
          type: "warning"
        });
        return;
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let param = {
            lubricationPointTypeCode: this.questionForm.lubricationPointTypeCode,
            oilNumber: this.questionForm.oilNumber[this.questionForm.oilNumber.length - 1],
            customerId: this.questionForm.customerId,
            description: this.checkList.includes(2) ? this.questionForm.description : "",
            distributorId: this.userInfo.distributorId,
            reasonConfList: this.checkList,
            serviceApplyType: 1
          };
          param.customerContactPersonId = this.questionForm.contactUserId.toString();

          if (this.userInfo.userType != 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.userInfo.companyId;
          } else {
            param.customerId = this.userInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);

          this.requestMethodPost("/serviceApply/addServiceApplyOrder", param)
            .then(res => {
              this.loading = false;
              res = res.data;
              if (res.code == 1000) {
                // 调取消息未读数据
                this.$parent.msgCount();
                this.$router.push({
                  path: "/ServiceApplyList/ServiceApplyDetail",
                  query: {
                    id: res.data
                  }
                });
                this.$gio.submitAssignExecutor();
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
    handleClick(item) {
      this.queryParams.serviceApplyStatus = item.serviceApplyStatus;
      this.list.forEach(it => {
        if (item.serviceApplyStatus == it.serviceApplyStatus) {
          it.active = true;
        } else {
          it.active = false;
        }
      });
      this.$_getWOData(); //获取工单列表
    },
    // 获取工单状态数量接口
    getWorkorderNum() {
      let params = {};
      if (this.userInfo.userType == 2) {
        params.customerId = this.userInfo.companyId;
      } else {
        params.distributorId = this.userInfo.companyId;
      }
      this.requestMethodGet("/serviceApply/queryServiceApplyStatusCount", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            res.data.forEach(item => {
              switch (item.serviceApplyStatus) {
                case 0:
                  item.statusName = "待确认";
                  break;
                case 1:
                  item.statusName = "待处理";
                  break;
                case 2:
                  item.statusName = "进行中";
                  break;
                case 3:
                  item.statusName = "已完成";
                  break;
                case 4:
                  item.statusName = "已取消";
                  break;
                default:
                  item.serviceApplyStatus = 5;
                  item.statusName = "全部";
                  break;
              }
            });
            this.list = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    // 查询
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_getWOData();
    },

    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getWOData();
    },
    //current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getWOData();
    },
    // 查看
    handleLook(row) {
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: row.id
        }
      });
    },
    // 获取工单列表
    $_getWOData() {
      this.loading = true;
      let params = { ...this.queryParams, ...this.pagenation };
      if (this.userInfo.userType == 2) {
        params.customerId = this.userInfo.companyId;
      } else {
        params.distributorId = this.userInfo.companyId;
      }
      params.serviceApplyStatus = this.queryParams.serviceApplyStatus == "5" ? "" : this.queryParams.serviceApplyStatus;
      if (this.applyTime) {
        params.applyStartTime = this.applyTime[0];
        params.applyEndTime = this.applyTime[1];
      }
      // 数据标识：0：全部 1：与我相关
      params.dataFlag = this.lookMain;
      if (this.selRevetType.toString()) params.revertType = this.selRevetType;

      this.requestMethodGet("/serviceApply/serviceApplyOrderListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.woTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.pagenation.current = res.data.pageIndex;
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
            this.activeQuestion = this.questionList[0].id
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
    // 复制申请单号编号
    onCopy(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onError(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 复制邮箱
    onCopyMail(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制邮箱
    onErrorMail(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 复制手机号
    onCopyTel(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onErrorTel(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(this.applyUserDetail, "headUrl", res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取客户联系人详情
    getUserDetail(val, index, type) {
      if (val) {
        this.applyUserDetail = {};
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${index}`].doShow();
                this.applyUserDetail = res.data;
                if (this.applyUserDetail.avatar) {
                  this.getFullUrl(this.applyUserDetail.avatar);
                }
                if (this.applyUserDetail.roleNames) {
                  this.applyUserDetail.roleNames = this.applyUserDetail.roleNames.join(",");
                }
                if (this.applyUserDetail.phonenumber) {
                  const phoneNum = this.applyUserDetail.phonenumber;
                  this.applyUserDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                }
              } else {
                this.$refs[`popovers-${index}`].doClose();
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
    // 查看创建人详情
    applyUserNameDetail(scope) {
      this.applyUserDetail = {};
      if (scope.row.applyUserId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.applyUserId, scope.$index, "");
      }
    }
  }
};
