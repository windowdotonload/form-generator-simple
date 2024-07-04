export default {
  components: {},
  data() {
    return {
      currentSelectCompany: null,
      chooseDeviceAndLupDialog: false,
      urlType: "workOrder",
      taskType: "check",
      deviceCompanyId: "",
      plantStudyServiceFlag: false,
      checkedDevice: [],
      checked: false,
      expireTimeOption: {
        disabledDate(date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now();
        },
      },
      typeName: "",
      addLubricationPointsVisiable: false,
      lumData: [], // 润滑点信息
      dialogVisibleHint: false, // 免责提示弹框
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      imageList: [], // 上传图片数组
      imageLubricationList: [], // 润滑点图片
      uploadUrl: "",
      executePersonNameVisiable: false, // 选择执行人弹框
      engineerInfoList: [], // 点击添加人员获取列表
      hideUpload: false,
      pagenationLumCustomer: {
        current: 1,
        size: 30,
      },
      typeProps: {
        value: "code",
        label: "name",
      },
      // 表单验证
      applylist: {
        imgFile: [], // 图片文件
        shortDesc: "",
        executePersonName: "",
        expectComingTime: "",
        contactMapAddress: "",
        contactPhone: "",
        userNumber: "",
        executePersonNumber: "",
        contactCompanyName: "", // 客户名称
        serviceProperty: [],
        incomeBbl: "",
        incomeRmb: "",
        spId: "",
      },
      queryParams: {
        taskName: "",
        lDOName: "",
        selectGroupId: [],
      },
      //   表单验证规则
      rules: {
        companyNumber: [{ required: true, message: "请选择客户名称", trigger: "change" }],
        executePersonName: [{ required: true, message: "请选择执行人", trigger: "change" }],
        expectComingTime: [{ required: true, message: "请选择预约日期", trigger: "change" }],
        serviceProperty: [{ required: true, message: "请选择服务属性", trigger: "change" }],
        spId: [{ required: true, message: "请选择经销商", trigger: "change" }],
      },
      customerList: [], // 客户
      companyIndustry: "", // 客户下面的行业code
      typeList: [], // 类型
      lubricationPointTypeList: [], // 润滑点设备类型数组
      selectCompanyName: "", // 所属客户的模糊搜索
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      // userInfo: JSON.parse(this.$cookies.get("userInfo")),
      userOrRoleName: "",
      loadMoreData: false,
      loadMoreZhixingren: false,
      pageIndexDistributive: 1, // 有分配人员列表 current
      distributiveBtn: false, // 分配权限
      executeBtn: false, // 执行权限
      lumDataCustomers: [],
      lumToTalCount: 0,
      lubricationPointNumbers: [],
      lubricationPointNumbersNew: [],
      seleLumsAllMsg: [],
      selectLums: [],
      seleLumsAll: [],
      loadingLum: false,
      contactPersonList: [], // 公司下边联系人的数组
      addServiceType: "",
      serviceClause: "",
      pesServiceItemId: "",
      pesDisabled: false,
      isLumData: false, // 是否有润滑点
      reportType: 0, // 服务类型
      applylistParams: {},
      serviceApplyOrderId: "", // 服务申请id
      personTotal: 0,
      taskData: [], // 调查任务信息
      lubricationPointNumbersNewArr: [],
      lubricationPointNumbersNewArrDetail: [],
      workshopList: [],
      companyId: "",
      disabledWorkshop: false,
      groupList: [],
      paramDataLubFlag: false,
      coreDataLubFlag: false,
      coreTemplateId: 0,
      serviceId: "",
      selectedCompany: null,
    };
  },
  created() {
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let item of buttonpermsStr) {
      if (item.menuCode == "service_order_distribution_btn") {
        this.distributiveBtn = true;
      }
      if (item.menuCode == "service_order_execute_btn") {
        this.executeBtn = true;
      }
    }
    if (this.$route.query.customerNumber) {
      this.applylist.companyNumber = this.$route.query.customerNumber;
    }
    if (this.$route.query.companyNumber) {
      this.applylist.companyNumber = this.$route.query.companyNumber;
    }

    this.applylistParams = this.$route.query.applylistParams ? JSON.parse(this.$route.query.applylistParams) : {};
    if (this.$route.query.applylistParams) {
      this.applylist.executePersonName = this.applylistParams.chargeUserName;
      this.applylist.executePersonNumber = this.applylistParams.chargeUserNumber;
      this.applylist.companyNumber = this.applylistParams.companyNumber;
      this.applylist.contactPhone = this.applylistParams.customerUserPhone;
      this.companyId = this.applylistParams.companyId;
      this.applylist.contactName = this.applylistParams.customerUserName;
      this.applylist.userNumber = this.applylistParams.customerUserNumber;
      // this.getCustomerWorkshopList();
    }
    if (!this.applylistParams.companyNumber && this.executeBtn) {
      this.applylist.executePersonName = this.userInfo.userName;
      this.applylist.executePersonNumber = this.userInfo.userNumber;
    }
    if (this.$route.query.customerNumber) {
      this.applylist.companyNumber = this.$route.query.customerNumber;
      this.applylist.customerNumber = this.$route.query.customerNumber;
    }
    if (this.$route.query.electLubricatePointData) {
      let seleLumsAllMsg = [];
      seleLumsAllMsg = this.$route.query.electLubricatePointData;
      this.lumData = [];
      this.lumData = JSON.parse(JSON.stringify(seleLumsAllMsg));
      this.lumData.map((item) => {
        this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
      });
      let arr = [];
      this.lumData.map((item) => {
        arr.push(item.lubricationPointNumber);
      });
      this.lubricationPointNumbersNewArrDetail = JSON.parse(JSON.stringify(seleLumsAllMsg));
      this.lubricationPointNumbersNewArr = JSON.parse(JSON.stringify(arr));
      this.companyId = this.$route.query.companyId;
      this.seleLumsAllMsg = JSON.parse(JSON.stringify(seleLumsAllMsg));
      // this.getCustomerWorkshopList();
    }
    // 服务申请过来
    if (this.$route.query.serviceApplyOrderId) {
      this.serviceApplyOrderId = this.$route.query.serviceApplyOrderId;
      this.applylist.executePersonName = this.userInfo.userName;
      this.applylist.executePersonNumber = this.userInfo.userNumber;
      this.applylist.companyNumber = this.$route.query.companyNumber;
      this.companyId = this.$route.query.companyId;
      // this.getCustomerWorkshopList();
    }
    // pes/dpes车间不可编辑
    if (this.$route.query.servicePackFlag) {
      this.disabledWorkshop = true;
    }
    // 工业客户创建工单
    if (this.userInfo.userType == 2) {
      this.applylist.companyNumber = this.userInfo.companyNumber;
      this.companyId = this.userInfo.companyId;
      // this.getCustomerWorkshopList();
    }
  },
  mounted() {
    if (this.userInfo.userType < 2) {
      this.$_queryCustomerData(); // 查询所属客户
    } else {
      this.customerList = [
        {
          companyName: this.userInfo.orgInfo.companyName,
          companyNumber: this.userInfo.companyNumber,
        },
      ];
    }

    this.addServiceType = this.$route.query.addServiceType;
    this.reportType = this.$route.query.reportType;
    this.paramDataLubFlag = this.$route.query.paramDataLubFlag == "true";
    this.coreTemplateId = this.$route.query.coreDataTemplateId;
    this.coreDataLubFlag = this.$route.query.coreDataLubFlag == "true";
    this.typeName = this.$route.query.typeName;
    this.woFormType = this.$route.query.woFormType;

    this.$_queryLPData(); // 查询润滑点设备类型
    this.pesServiceItemId = this.$route.query.pesServiceItemId;
    if (this.pesServiceItemId) {
      this.pesDisabled = true;
      this.applylist.spId = Number(this.$route.query.spId);
      if (this.$route.query.openOrderType == "pesPlan") {
        this.getSpList(this.applylistParams.companyId);
      } else {
        this.getSpList(this.$userInfo.orgInfo.companyId);
      }
    }
  },

  methods: {
    requestMethodCustomer(query) {
      this.selectCompanyName = query;
      this.$_queryCustomerData();
    },
    // 新建设备
    handleAddDevice() {
      let routeUrl = this.$router.resolve({
        path: "/EquipmentProfile/AddEquipmentProfile",
        query: { companyNumber: this.applylist.companyNumber, companyId: this.companyId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 刷新润滑点数据
    handleRefresh() {
      this.$_getCustomerLumData("first");
    },
    // 取消添加润滑点
    handleResetAddLum() {
      this.addLubricationPointsVisiable = false;
      this.queryParams.lDOName = "";
      this.queryParams.selectGroupId = [];
      this.seleLumsAllMsg = this.lumData;
      this.lubricationPointNumbersNew = [];
      this.seleLumsAllMsg.map((item) => {
        this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
      });
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
    // 添加润滑点提交
    handleSubmitAddLum() {
      this.lubricationPointNumbersNew = [];
      this.lumData = [];
      this.lumData = JSON.parse(JSON.stringify(this.seleLumsAllMsg));
      this.lumData.map((item) => {
        this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
      });
      this.addLubricationPointsVisiable = false;
      let arr = this.lubricationPointNumbersNew.concat(this.lubricationPointNumbersNewArr);
      let arrNew = [...new Set(arr)];
      let arrDetail = this.lumData.concat(this.lubricationPointNumbersNewArrDetail);
      filter_arrObj = arrDetail.filter(
        (item, index, origin) =>
          index ===
          origin.findIndex((itemInner) => {
            return itemInner.name === item.name;
          })
      );
      this.lumData = filter_arrObj;
      this.lubricationPointNumbersNew = arrNew;
      if (this.lubricationPointNumbersNew.length > 0) {
        this.isLumData = false;
      }
    },
    // 添加润滑点单个选择
    handleSelectLum(rows, row) {
      // selected    true就是选中，0或者false是取消选中
      let selected = rows.length && rows.indexOf(row) !== -1;
      if (selected == false || selected == 0) {
        if (this.seleLumsAllMsg.length) {
          this.seleLumsAllMsg.splice(
            this.seleLumsAllMsg.findIndex((item) => item.lubricationPointNumber === row.lubricationPointNumber),
            1
          );
        }
        this.lubricationPointNumbersNew.splice(
          this.lubricationPointNumbersNew.findIndex((item) => item === row.lubricationPointNumber),
          1
        );
      } else {
        if (this.seleLumsAllMsg.length) {
          let cont = this.seleLumsAllMsg.filter((item) => item.lubricationPointNumber == row.lubricationPointNumber);
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
    getDevice(e) {
      this.selDeviceNumbers = e.map((item) => item.deviceNumber);
      console.log("selDeviceIds", this.selDeviceNumbers);
    },
    // 添加润滑点
    addLubricationPoints() {
      this.plantStudyServiceFlag = this.addServiceType == "2";
      if (this.userInfo.userType < 2) {
        if (!this.applylist.companyNumber) {
          this.$message({
            message: "请先选择客户名称",
            type: "warning",
          });
          return;
        }
        this.deviceCompanyId = this.customerList.filter((it) => {
          return it.companyNumber == this.applylist.companyNumber;
        })[0].companyId;
        this.checkedDevice = this.lumData;
        this.chooseDeviceAndLupDialog = true;
      } else {
        this.deviceCompanyId = this.userInfo.companyId;
        this.checkedDevice = this.lumData;
        this.chooseDeviceAndLupDialog = true;
      }
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      this.lumData = list;
      this.lubricationPointNumbersNew = [];
      if (list.length) {
        list.forEach((item) => {
          this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
        });
      }
      this.chooseDeviceAndLupDialog = false;
    },
    // 移除
    removeLupItem(item) {
      this.lumData.forEach((it, index) => {
        if (it.lubricationPointNumber == item.lubricationPointNumber) {
          this.lumData.splice(index, 1);
        }
      });
      this.lubricationPointNumbersNew = [];
      this.lumData.map((item) => {
        this.lubricationPointNumbersNew.push(item.lubricationPointNumber);
      });
    },
    rowKey(row) {
      return row.lubricationPointNumber;
    },
    // 获取工单中的润滑点列表
    $_getCustomerLumData(val) {
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
        companyNumber: this.applylist.companyNumber,
        current: this.pagenationLumCustomer.current,
        size: this.pagenationLumCustomer.size,
        LDOName: this.queryParams.lDOName,
        plantStudyServiceFlag: this.addServiceType == "2",
      };
      if (this.reportType != 0) {
        params.reportType = this.reportType;
      }
      // 处理分组入参
      if (this.queryParams.selectGroupId.length) {
        params.groupId = this.queryParams.selectGroupId[this.queryParams.selectGroupId.length - 1];
      } else {
        params.groupId = "";
      }
      this.requestMethodGet("/workOrder/getLubricationPointByCompany", params)
        .then((res) => {
          this.loadingLum = false;
          res = res.data;
          if (res.code == 1000) {
            if (res.data.list.length > 0) {
              this.lumDataCustomers = this.lumDataCustomers.concat(res.data.list);
              this.lumToTalCount = res.data.totalCount;
              this.$refs.tableAddLum.clearSelection();
              this.$nextTick(() => {
                if (this.lubricationPointNumbersNew.length) {
                  this.lumDataCustomers.map((item) => {
                    this.lubricationPointNumbersNew.map((element) => {
                      if (item.lubricationPointNumber == element) {
                        this.seleLumsAllMsg.push(item);
                        this.$refs.tableAddLum.toggleRowSelection(item);
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
              this.loadMoreBon = true;
            } else {
              this.loadMoreBon = false;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {
          this.loadingLum = false;
        });
    },
    // 所属客户 change 事件
    handleChangeCustomer(val) {
      this.applylist.spId = "";
      this.applylist.userNumber = "";
      if (!val) {
        return;
      }
      this.companyId = this.customerList.filter((item) => {
        if (item.companyNumber == val) {
          this.selectedCompany = item;
        }
        return item.companyNumber == val;
      })[0].companyId;
      this.workorderSelectCompanyName = this.customerList.filter((item) => {
        return item.companyNumber == val;
      })[0].companyName;
      this.lumData = [];
      this.lubricationPointNumbersNew = [];
      this.lubricationPointNumbersNewArr = [];
      this.lubricationPointNumbersNewArrDetail = [];
      this.seleLumsAllMsg = [];
      this.getSpList(this.companyId);
    },
    getHintCont() {
      let params = {
        valetOrderType: 0,
        customerCompanyNumber: "",
      };
      if (this.userInfo.userType < 2) {
        params.valetOrderType = 1; // 代客下单
        params.customerCompanyNumber = this.applylist.companyNumber; // 客户编码
      } else {
        params.valetOrderType = 0; // 工业客户自己下单
      }
      let url = "/weChat/clause/getServiceClause";
      this.requestMethodGet(url, params)
        .then((res) => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceClause = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {});
    },
    // 提交
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid, validateRes) => {
        if (valid) {
          // 判断是否有选中的润滑点
          if ((this.addServiceType == "9" || this.addServiceType == "2") && this.lubricationPointNumbersNew.length == 0 && (this.paramDataLubFlag || this.coreDataLubFlag)) {
            this.isLumData = true;
            return;
          }
          // if(this.reportType==0 && this.coreTemplateId==0 && this.lubricationPointNumbersNew.length == 0){
          //   this.isLumData = true
          //   return
          // }
          if (this.userInfo.userType != "2" || (this.userInfo.distributorCompanyType == 1 && this.userInfo.userType == "2")) {
            if (!this.checked) {
              // this.$message({
              //   message: "请勾选免责条款",
              //   type: "warning"
              // });
              this.dialogCheckedVisible = true;
              return;
            }
          }
          this.$confirm("是否确认提交数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // 调取接口
              this.submitRequest();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 提交工单调接口-----更新去除期待上门时间、详细地址、服务创盈属性
    submitRequest() {
      let imgListPic = [];
      if (this.imageList.length) {
        this.imageList.map((item) => {
          imgListPic.push(item.raw);
        });
      }
      let params = {
        serviceNumber: this.$route.query.serviceNumber, // 服务编码
        contactNumber: this.applylist.userNumber || "", // 联系人编码
        contactName: this.applylist.contactName || "", // 联系人姓名
        shortDesc: this.applylist.shortDesc, // 工单简述
        pictureList: imgListPic, // 图片列表,
        contactPhone: this.applylist.contactPhone || "", // 联系人电话
        lubricationPointNumbers: this.lubricationPointNumbersNew.join(",") || "",
        pesServiceItemId: this.$route.query.pesServiceItemId || "",
        oilChangeState: this.$route.query.changeOil || "",
        accountId: this.companyId,
      };

      if (this.userInfo.userType < 2) {
        params.valetOrderType = 1; // 代客下单
        params.contactCompanyNumber = this.applylist.companyNumber; // 客户编码
        if (this.distributiveBtn || this.executeBtn) {
          params.executePersonNumber = this.applylist.executePersonNumber;
        }
      } else {
        params.valetOrderType = 0; // 工业客户自己下单
        params.distributorCompanyNumber = this.userInfo.distributeCompanyNumber; // 服务商编码
        params.accountId = this.userInfo.orgInfo.companyId;
      }
      if (this.serviceApplyOrderId) {
        params.serviceApplyOrderId = this.serviceApplyOrderId;
      }
      if (this.$route.query.resource == "apply") {
        params.workOrderType = 2;
      }
      let url = "/weChat/workOrder/add";
      if (this.addServiceType == "2") {
        params.serviceType = 2;
      }
      // 设备润滑调查
      if (this.userInfo.userType != 2) {
        url = "/weChat/workOrder/valetAdd";
      }
      if (this.$route.query.openOrderType == "serviceApply") {
        params.applyServiceItemId = this.$route.query.applyServiceItemId;
      }
      params.spId = this.applylist.spId;
      if (this.$route.query.woFormType) {
        params.woFormType = this.$route.query.woFormType;
      }
      // params.deviceNumbers = this.selDeviceNumbers.join(",");
      this.requestMethodPost(url, params)
        .then((res) => {
          res = res.data;
          if (res.code == 1000) {
            // 调取消息未读数据
            this.$parent.msgCount();
            this.$message({
              message: "工单创建成功",
              type: "success",
            });
            if (this.addServiceType == "2") {
              this.$router.push({
                path: "/NewWorkOrderList/newWorkorderTaskDetail",
                query: {
                  workOrderNumber: res.data,
                },
              });
            } else {
              this.$router.push({
                path: "/NewWorkOrderList/newWorkOrderDetail",
                query: {
                  workOrderNumber: res.data,
                },
              });
            }
            this.$gio.Track("handInWorkorder", {
              serviceType: this.typeName,
              customer: this.$userInfo.orgInfo.companyName,
              operation: "点击提交按钮",
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {
          console.log("t his is ers", res);
        });
    },
  },
};
