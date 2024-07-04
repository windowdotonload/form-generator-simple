export default {
  components: {},
  data() {
    var validateCountry = (rule, value, callback) => {
      if (!this.companyCountryFlag) {
        callback(new Error("请选择中国/海外"));
      } else {
        callback();
      }
    };
    var validateBottleId = (rule, value, callback) => {
      if (this.mslaServiceType && this.serviceType == 1 && this.serviceLevel == 3 && this.applylist.bottleId.indexOf(this.mslaServiceType) != 0) {
        return callback(new Error("请输入以“" + this.mslaServiceType + "”开头的油样瓶ID"));
      } else {
        callback();
      }
    };
    return {
      chooseDeviceAndLupDialog: false,
      checkedDevice: [],
      urlType: "MSLAWorkOrder",
      taskType: "check",
      deviceCompanyId: "",
      deviceCompanyNumber: "",
      checked: false,
      notice: false,
      expireTimeOption: {
        disabledDate(date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now();
        }
      },
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // 如果当天可选，就不用减8.64e7
        }
      },
      pickerNextDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // 如果当天可选，就不用减8.64e7
        }
      },
      oilChangeOptions: [
        {
          value: true,
          label: "是"
        },
        {
          value: false,
          label: "否"
        }
      ],
      filterChangeOptions: [
        {
          value: true,
          label: "是"
        },
        {
          value: false,
          label: "否"
        }
      ],
      personTotal: 0,

      dialogVisibleHint: false, // 免责提示弹框
      dialogVisiblePreview: false, // 信息预览弹框
      errMsg: "", // 润滑点设备类型的报错信息
      updateLumVisisble: false, // 更新润滑点弹框
      addLubricationPointsVisiable: false,
      distributionPerson: {}, // 选择分配人
      addLumdata: {}, // 添加润滑点选择数据
      addLumdataOld: {},
      lumData: [], // 润滑点信息
      imageList: [], // 上传图片数组
      imageLubricationList: [], // 润滑点图片
      uploadUrl: "",
      executePersonNameVisiable: false, // 选择执行人弹框
      engineerInfoList: [], // 点击添加人员获取列表
      hideUpload: false,
      dialogVisibleNotice: false, // 小贴士
      pagenationLumCustomer: {
        current: 1,
        size: 30
      },
      input3: "",
      select: "",
      typeProps: {
        value: "code",
        label: "name"
      },
      updateLumForm: {
        attributes: []
      },
      // 表单验证
      applylist: {
        oilChangeCode: "",
        filterChangeCode: "",
        imgFile: [], // 图片文件
        shortDesc: "",
        executePersonName: "",
        expectComingTime: "",
        contactPhone: "",
        contactName: "",
        contactCompanyName: "", // 客户名称
        userNumber: "",
        lubricationPointTypeName: "",
        bottleId: "",
        // workshopId: "",
        workshopName: "",
        executePersonNumber: "",
        deviceUseTimeUnitName: "",
        oilUserTimeUnitName: "",
        tempUnitName: "",
        repairOilUnitLabel: "",
        serviceProperty: [],
        incomeBbl: "",
        incomeRmb: ""
      },
      queryParams: {
        taskName: "",
        lDOName: ""
      },
      updateRules: {
        companyNumber: [{ validator: validateCountry, message: "请选择客户名称", trigger: "change" }]
      },
      //   表单验证规则
      rules: {
        bottleId: [
          { required: true, message: "请输入油样瓶ID", trigger: "blur" },
          { pattern: /^[a-zA-Z]\d{9}$/, message: "请输入正确的油样瓶ID", trigger: "change" },
          { required: true, validator: validateBottleId, trigger: "change" }
        ],
        serviceProperty: [{ required: true, message: "请选择服务属性", trigger: "change" }],
        companyNumber: [{ required: true, message: "请选择客户名称", trigger: "change" }],
        // workshopId: [{ required: true, message: "请选择车间名称", trigger: "change" }],
        userNumber: [{ required: true, message: "请选择联系人", trigger: "change" }],
        tankTempNumInput: [{ pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: "change" }],
        deviceAgeNumInput: [{ pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: "change" }],
        repairNumber: [{ pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: "change" }],
        executePersonName: [{ required: true, message: "请选择执行人", trigger: "change" }],
        expectComingTime: [{ required: true, message: "请选择预约日期", trigger: "change" }]
      },
      customerList: [], // 客户
      companyIndustry: "", // 客户下面的行业code
      typeList: [], // 类型
      lubricationPointTypeList: [], // 润滑点设备类型数组
      selectCompanyName: "", // 所属客户的模糊搜索
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      userOrRoleName: "",
      loadMoreData: false,
      lumToTalCount: 0,
      pageIndexDistributive: 1, // 有分配人员列表 current
      distributiveBtn: false, // 分配权限
      executeBtn: false, // 执行权限
      lumDataCustomers: [],
      lubricationPointNumbers: "",
      typeValue: [0, 0],
      seleLumsAllMsg: [],
      selectLums: [],
      seleLumsAll: [],
      loadingLum: false,
      contactPersonList: [], // 公司下边联系人的数组
      lumTypeData: [],
      lubricationPointTypeValid: true, // false 润滑点设备类型已更新，请点击重新选择
      oilAgeNumList: [], // 使用时间
      repairUnitList: [], // 补油单位
      tempUnitList: [], // 油箱温度单位
      fieldId: "",
      searchValue: "",
      dataList: [],
      listItemId: "",
      applyUserNumber: "",
      applyCompanyNumber: "",
      appilyLubricationPointName: "",
      assetClassId: "",
      assetId: "",
      typeName: "",
      selectLubricationPointTypeCode: "",
      contAttributes: [],
      pesServiceItemId: "",
      pesDisabled: false,
      serviceClause: "",
      applylistParams: {},
      serviceApplyOrderId: "",
      workshopList: [],
      companyId: "",
      cancleFlag: false,
      disabledWorkshop: false,
      servicePropertyStr: "",
      incomeInfo: "",
      servicePropertyList: [
        {
          value: 1,
          label: "维护现有生意"
        },
        {
          value: 2,
          label: "油品升级"
        },
        {
          value: 3,
          label: "竞品转换"
        },
        {
          value: 4,
          label: "服务收费"
        },
        {
          value: 5,
          label: "支持新项目生意"
        }
      ]
    };
  },
  created() {
    if (this.$userInfo.userType == 2 || this.$userInfo.userType == 1) {
      this.getSpList(this.userInfo.orgInfo.companyId);
    }
    if (this.$route.query.openOrderType == "serviceApply") {
      this.getSpList(this.$route.query.companyId);
    }
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let item of buttonpermsStr) {
      if (item.menuCode == "service_order_distribution_btn") {
        this.distributiveBtn = true;
      }
      if (item.menuCode == "service_order_execute_btn") {
        this.executeBtn = true;
      }
    }
    this.applylistParams = this.$route.query.applylistParams ? JSON.parse(this.$route.query.applylistParams) : {};
    if (this.$route.query.openOrderType == "pesPlan") {
      this.getSpList(this.applylistParams.companyId);
    }
    if (this.$route.query.selectLubricatePointData) {
      this.applylist.companyNumber = this.$route.query.customerNumber;
      this.addLumdata = this.$route.query.selectLubricatePointData[0];
      this.notice = true;
      this.companyId = this.$route.query.companyId;
      this.applylist.lubricationPointNumber = this.$route.query.selectLubricatePointData[0].lubricationPointNumber;
      this.applylist.lubricationPointTypeName = this.$route.query.selectLubricatePointData[0].lubricationPointType + "-" + this.$route.query.selectLubricatePointData[0].lubricationPointName;
    }
    if (this.$route.query.companyId) {
      this.companyId = this.$route.query.companyId;
    }
    if (this.$route.query.companyNumber) {
      this.applylist.companyNumber = this.$route.query.companyNumber;
    }
    // 申请单界面开单
    if (this.$route.query.enterFrom == "serviceApply") {
      this.oilSelectedCompanyName = this.$route.query.companyName;
      this.deviceCompanyId = this.$route.query.companyId;
      this.deviceCompanyNumber = this.$route.query.companyNumber;
    }
    if (this.$route.query.applylistParams) {
      this.applylist.executePersonName = this.applylistParams.chargeUserName;
      this.applylist.executePersonNumber = this.applylistParams.chargeUserNumber;
      this.applylist.companyNumber = this.applylistParams.companyNumber;
      this.applylist.contactPhone = this.applylistParams.customerUserPhone;
      this.oilSelectedCompanyName = this.applylistParams.companyName;
      this.deviceCompanyId = this.applylistParams.companyId;
      this.deviceCompanyNumber = this.applylistParams.companyNumber;
      this.companyId = this.applylistParams.companyId;
      this.applylist.contactName = this.applylistParams.customerUserName;
      this.applylist.userNumber = this.applylistParams.customerUserNumber;
    }
    if (!this.$route.query.applylistParams && this.executeBtn) {
      this.applylist.executePersonName = this.userInfo.userName;
      this.applylist.executePersonNumber = this.userInfo.userNumber;
    }
    // 服务申请过来
    if (this.$route.query.serviceApplyOrderId) {
      this.serviceApplyOrderId = this.$route.query.serviceApplyOrderId;
      this.applylist.executePersonName = this.userInfo.userName;
      this.applylist.executePersonNumber = this.userInfo.userNumber;
      this.applylist.companyNumber = this.$route.query.companyNumber;
      this.applylist.companyId = this.$route.query.companyId;
    }
    // pes/dpes车间不可编辑
    if (this.$route.query.servicePackFlag) {
      this.disabledWorkshop = true;
    }
    // 工业客户创建工单
    if (this.userInfo.userType == 2) {
      this.applylist.companyNumber = this.userInfo.companyNumber;
      this.companyId = this.userInfo.companyId;
    }
  },
  mounted() {
    this.getTypeList(); // 要去掉的
    this.typeName = this.$route.query.typeName;
    if (this.userInfo.userType < 2) {
      this.$_queryCustomerData(); // 查询所属客户
    } else {
      this.customerList = [
        {
          companyName: this.userInfo.orgInfo.companyName,
          companyNumber: this.userInfo.companyNumber
        }
      ];
    }
    this.$_queryLPData(); // 查询润滑点设备类型
    this.getRepairUnit("oilUnit"); // 补油单位
    this.getRepairUnit("temperature"); // 油箱温度
    this.getRepairUnit("useTime"); // 使用时间
    this.pesServiceItemId = this.$route.query.pesServiceItemId;
    this.serviceLevel = this.$route.query.serviceLevel;
    this.serviceType = this.$route.query.serviceType;
    this.mslaServiceType = this.$route.query.mslaServiceType;
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
    repairOilUnitNameChange(e) {
      this.applylist.repairOilUnitLabel = "";
    },
    deviceUseTimeUnitCodeChange(e) {
      this.applylist.deviceUseTimeUnitName = "";
    },
    oilUseTimeUnitCodeChange() {
      this.applylist.oilUserTimeUnitName = "";
    },
    tempUnitCodeChange(e) {
      this.applylist.tempUnitName = "";
    },
    showPreview() {
      // 获取油品使用时间单位值
      if (this.applylist.oilUserTimeUnitCode) {
        this.applylist.oilUserTimeUnitName = this.oilAgeNumList.filter(item => {
          return item.code == this.applylist.oilUserTimeUnitCode;
        })[0].name;
      }
      // 获取设备使用时间单位值
      if (this.applylist.deviceUseTimeUnitCode) {
        this.applylist.deviceUseTimeUnitName = this.oilAgeNumList.filter(item => {
          return item.code == this.applylist.deviceUseTimeUnitCode;
        })[0].name;
      }
      // 获取补油量单位值
      if (this.applylist.repairOilUnitName) {
        this.applylist.repairOilUnitLabel = this.repairUnitList.filter(item => {
          return item.code == this.applylist.repairOilUnitName;
        })[0].name;
      }
      // 获取油箱温度单位值
      if (this.applylist.tempUnitCode) {
        this.applylist.tempUnitName = this.tempUnitList.filter(item => {
          return item.code == this.applylist.tempUnitCode;
        })[0].name;
      }
      // 获取客户名称
      if (this.applylist.companyNumber) {
        this.applylist.contactCompanyName = this.customerList.filter(item => {
          return item.companyNumber == this.applylist.companyNumber;
        })[0].companyName;
      }
      // 获取车间名称
      // if (this.applylist.workshopId) {
      //   this.applylist.workshopName = this.workshopList.filter(item => {
      //     return item.workshopId == this.applylist.workshopId;
      //   })[0].workshopName;
      // }
      // 更新去除服务创赢属性与预估收益
      this.dialogVisiblePreview = true;
    },
    handleSearchTableData(val) {
      this.queryParams.lDOName = val;
      this.$_getCustomerLumData("first");
    },
    // 提交更新润滑点信息表单
    handleSubmitEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否确认提交数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let list = [];
              for (let item of this.updateLumForm.attributes) {
                list.push({
                  fieldId: item.fieldId,
                  fieldRequired: item.fieldRequired,
                  fieldTitle: item.fieldTitle,
                  listItemId: item.listItemId,
                  listItemValue: item.listItemValue
                });
                if (item.child) {
                  list.push({
                    fieldId: item.child.fieldId,
                    fieldRequired: item.child.fieldRequired,
                    fieldTitle: item.child.fieldTitle,
                    listItemId: item.child.listItemId,
                    listItemValue: item.child.listItemValue,
                    parentFieldId: item.fieldId
                  });
                }
              }
              if (this.userInfo.userType < 2) {
                this.applyUserNumber = this.applylist.userNumber;
                this.applyCompanyNumber = this.applylist.companyNumber;
              } else {
                this.applyUserNumber = this.userInfo.userNumber;
                this.applyCompanyNumber = this.userInfo.companyNumber;
              }
              let params = {
                userNumber: this.applyUserNumber,
                companyNumber: this.applyCompanyNumber,
                lubricationPointName: this.updateLumForm.lubricationPointName,
                lubricationPointType: this.updateLumForm.lubricationPointTypeName,
                lubricationPointTypeCode: this.updateLumForm.lubricationPointTypeCode,
                lubricationPointNumber: this.updateLumForm.lubricationPointNumber,
                attributes: list,
                lubricationPointDesc: this.updateLumForm.lubricationPointDesc,
                mslaUnitNumber: this.updateLumForm.mslaUnitNumber || ""
              };
              this.requestMethodPost("/weChat/msla/lubricationPoint/relationPointAndAsset", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.cancleFlag = true;
                    this.addLumdataNew = this.addLumdata;
                    this.notice = false;
                    this.assetId = res.data;
                    let _field = this.$refs["applylist"].fields; /* 当然，你可以打印一下fields */
                    _field.map(i => {
                      if (i.prop == "lubricationPointTypeName") {
                        // 通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
                        i.resetField();
                        return false;
                      }
                    });
                    this.applylist.lubricationPointNumber = this.updateLumForm.lubricationPointNumber;
                    this.applylist.lubricationPointName = this.updateLumForm.lubricationPointName;
                    this.applylist.lubricationPointTypeName = this.updateLumForm.lubricationPointTypeName;
                    this.updateLumVisisble = false;
                    this.$message({
                      message: "润滑点信息更新成功",
                      type: "success"
                    });
                  } else if (res.code == 3803 || res.msg == "资产类型失效") {
                    // 判断数据已禁用
                    let toastData = res.data[0];
                    let filterData = this.updateLumForm.attributes.filter(item => {
                      return item.listItemId == toastData;
                    });
                    this.$message({
                      message: filterData[0].fieldTitleCn + "数据已禁用，请重新选择",
                      type: "warning"
                    });
                  } else if (res.code == 504) {
                    this.$message({
                      message: "已超时，请重新提交",
                      type: "warning"
                    });
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {
                  this.$message({
                    message: "已超时，请重新提交",
                    type: "warning"
                  });
                });
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    // 取消添加润滑点
    handleResetAddLum() {
      this.addLubricationPointsVisiable = false;
      this.lubricationPointNumbers = "";
      this.queryParams.lDOName = "";
      if (!this.cancleFlag) {
        this.addLumdata = {};
      }
    },
    // 取消更新润滑点信息
    handleResetEdit(formName) {
      this.updateLumVisisble = false;
      this.$refs[formName].resetFields();
      this.updateLumForm.attributes = [];
      this.applylist.lubricationPointTypeName = "";
      this.applylist.lastOilChangeDate = "";
      this.applylist.oilAgeNumInputCont = "";
    },
    // 获取单位
    getRepairUnit(val) {
      const params = {
        code: "msla_oil_nuit"
      };
      if (val == "temperature") {
        params.code = "msla_temperature_nuit";
      }
      if (val == "useTime") {
        params.code = "msla_oil_age";
      }
      this.requestMethodGet("/weChat/common/dic/drops", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            res.data.forEach(item => {
              // if (item.name.startsWith('小时')) {
              //   this.applylist.oilUserTimeUnitCode = item.code
              // }
              item.active = false;
            });
            switch (val) {
              case "temperature":
                this.tempUnitList = res.data;
                break;
              case "oilUnit":
                this.repairUnitList = res.data;
                break;
              default:
                this.oilAgeNumList = res.data;
                break;
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
    changeManufacturer(e, val) {
      if (e) {
        // 只在下拉框显示时调用
        this.fieldId = val;
        this.getDataList();
      }
    },
    selectManufacturer(val) {
      if (val.listItemValueCn == "") {
        val.listItemValueCn = val.listItemValue;
      }
      if (val.listItemValue == "NOT LISTED") {
        let notfileid = {};
        notfileid = this.dataList.find(item => item.listItemValue == val.listItemValue);
        this.listItemId = notfileid.listItemId;
        this.getNotListDataList(val);
      } else {
        let data1 = this.dataList.find(item => item.listItemValue == val.listItemValue);
        this.updateLumForm.attributes.forEach(item => {
          if (item.fieldId == val.fieldId) {
            item.listItemValue = data1.listItemValue;
            item.listItemValueCn = data1.listItemValueCn;
            item.listItemId = data1.listItemId;
            item.child = null;
          }
        });
      }
    },
    getNotListDataList(row) {
      let params = {
        listItemId: this.listItemId
      };
      this.requestMethodGet("/weChat/msla/lubricationPoint/queryNotListedByFieldId", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.updateLumForm.attributes.forEach(item => {
              if (item.fieldId == row.fieldId) {
                item.listItemValue = row.listItemValue;
                item.listItemValueCn = row.listItemValueCn;
                item.listItemId = this.listItemId;
                item.child = res.data;
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
    getDataList(val) {
      this.dataList = [];
      let params = {
        fieldId: this.fieldId,
        itemValue: this.searchValue,
        size: 9999
      };
      this.requestMethodGet("/weChat/msla/lubricationPoint/queryListItemsByFieldId", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.dataList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 添加润滑点提交
    handleSubmitAddLum() {
      if (this.addLumdataOld) {
        this.addLumdata = this.addLumdataOld;
        this.selectLubricationPointTypeCode = this.addLumdata.lubricationPointTypeCode;
        this.applylist.LubricationPointName = this.addLumdata.lubricationPointName;
        this.applylist.lubricationPointTypeName = this.addLumdata.lubricationPointTypeName;
        this.lubricationPointNumbers = this.addLumdata.lubricationPointNumber;
        this.updateLumForm.lubricationPointTypeName = this.addLumdata.lubricationPointType;
        this.lumTypeData.map(item => {
          if (item.code == this.selectLubricationPointTypeCode) {
            this.assetClassId = item.mslaCode;
          }
        });
      }
      this.contAttributes = [];
      this.updateLumForm.attributes = [];
      if (this.lubricationPointNumbers) {
        let params = {
          userId: this.userInfo.userId,
          lubricationPointNumber: this.lubricationPointNumbers
        };
        this.requestMethodGet("/weChat/msla/lubricationPoint/queryRelationPointAndAsset", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              // 调取润滑点设备类型名称接口
              this.getTypeList();
              this.handleChangeLubTypeName(res.data.lubricationPointTypeCode, "first");
              this.addLubricationPointsVisiable = false;
              this.updateLumVisisble = true;
              this.updateLumForm = res.data;
              this.updateLumForm.mslaUnitNumber =
                this.updateLumForm.mslaUnitNumber || this.addLumdata.deviceName + (this.updateLumForm.lubricationPointName ? "," + this.updateLumForm.lubricationPointName : "");
              let desc = "";
              if (this.updateLumForm.lubricationPointName && this.addLumdata.nowOilName) {
                desc = this.updateLumForm.lubricationPointName + "," + this.addLumdata.nowOilName;
              } else if (!this.updateLumForm.lubricationPointName && this.addLumdata.nowOilName) {
                desc = this.addLumdata.nowOilName;
              } else if (this.updateLumForm.lubricationPointName && !this.addLumdata.nowOilName) {
                desc = this.updateLumForm.lubricationPointName;
              }
              this.updateLumForm.lubricationPointDesc = this.updateLumForm.lubricationPointDesc || desc;
              this.contAttributes = res.data.attributes;
              this.lubricationPointTypeValid = res.data.lubricationPointTypeValid;
              if (!this.lubricationPointTypeValid) {
                this.errMsg = "润滑点设备类型已更新，请点击重新选择";
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
          message: "请先选择润滑点",
          type: "warning"
        });
      }
    },
    // 更改润滑点设备类型
    handleChangeLubTypeName(val, cont) {
      if (cont == "") {
        this.updateLumForm.attributes = [];
        this.$nextTick(() => {
          this.$refs["updateLumForm"].clearValidate();
        });
      }
      let index = this.lumTypeData.findIndex(item => {
        return item.code == val;
      });
      this.typeValue = [index];
      if (this.selectLubricationPointTypeCode != this.lumTypeData[this.typeValue[0]].code) {
        (this.applylist.lubricationPointTypeName = this.lumTypeData[this.typeValue[0]].name),
          (this.applylist.lubricationPointTypeCode = this.lumTypeData[this.typeValue[0]].code),
          (this.updateLumForm.lubricationPointTypeName = this.lumTypeData[this.typeValue[0]].name),
          (this.updateLumForm.lubricationPointTypeCode = this.lumTypeData[this.typeValue[0]].code),
          (this.assetClassId = this.lumTypeData[this.typeValue[0]].mslaCode);
      }

      this.errMsg = "";
      let params = {
        lubricationPointTypeCode: val
      };
      this.requestMethodGet("/weChat/msla/lubricationPoint/queryAttributesByAssetClassId", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (cont == "first" && this.contAttributes.length) {
              this.updateLumForm.attributes = this.contAttributes;
            } else {
              this.updateLumForm.attributes = res.data;
            }
            if (this.updateLumForm.attributes.length == 0) {
              this.errMsg = "此类型不适用于油品分析，请选择修改";
            }
            this.lubricationPointTypeValid = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getTypeList() {
      let params = {
        userId: this.userInfo.userId,
        code: "lubrication_point_type"
      };
      this.requestMethodGet("/weChat/common/dic/drops", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.lumTypeData = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 润滑点单选事件
    handleLumDataChange(val) {
      if (val) {
        this.addLumdataOld = val;
        this.addLumdata = val;
      }
    },
    // 添加润滑点
    addLubricationPoints() {
      if (!this.applylist.spId) return this.$message.warning("请选择服务商");
      if (this.addLumdataNew) {
        this.addLumdata = this.addLumdataNew;
      }
      if (this.userInfo.userType < 2) {
        this.applyUserNumber = this.applylist.userNumber;
        this.applyCompanyNumber = this.applylist.companyNumber;
      } else {
        this.applyUserNumber = this.userInfo.userNumber;
        this.applyCompanyNumber = this.userInfo.companyNumber;
      }
      if (this.userInfo.userType < 2) {
        if (!this.applylist.companyNumber) {
          this.$message({
            message: "请先选择客户名称",
            type: "warning"
          });
          return;
        }
        // if (!this.applylist.workshopId) {
        //   this.$message({
        //     message: "请选择车间",
        //     type: "warning"
        //   });
        //   return;
        // }
        this.handleChooseLup();
      } else {
        // if (!this.applylist.workshopId) {
        //   this.$message({
        //     message: "请选择车间",
        //     type: "warning"
        //   });
        //   return;
        // }
        this.handleChooseLup();
      }
    },
    handleChooseLup() {
      // reportType: 0, // 服务类型
      this.deviceCompanyId = this.companyId;
      this.deviceCompanyNumber = this.userInfo.userType < 2 ? this.applylist.companyNumber : this.userInfo.companyNumber;
      this.chooseDeviceAndLupDialog = true;
    },
    cancelChooseDeviceAndLup() {
      this.addLumdata = {};
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      this.addLumdataOld = list[0];
      this.addLumdata = list[0];
      this.chooseDeviceAndLupDialog = false;
      this.handleSubmitAddLum();
    },
    // 获取工单中的润滑点列表
    $_getCustomerLumData(val) {
      if (val == "first") {
        this.lumDataCustomers = [];
        this.pagenationLumCustomer.current = 1;
      }
      this.loadingLum = true;
      let params = {
        companyNumber: this.applylist.companyNumber,
        current: this.pagenationLumCustomer.current,
        size: this.pagenationLumCustomer.size,
        deviceOrPointName: this.queryParams.lDOName,
        // workshopId: this.applylist.workshopId,
        webFlag: true
      };
      this.requestMethodGet("/weChat/msla/lubricationPoint/queryMslaLubricationPointByPage", params)
        .then(res => {
          this.loadingLum = false;
          res = res.data;
          if (res.code == 1000) {
            if (res.data.list.length > 0) {
              this.lumToTalCount = res.data.totalCount;
              this.lumDataCustomers = this.lumDataCustomers.concat(res.data.list);
              this.loadMoreBon = true;
              this.$nextTick(() => {
                if (this.addLumdata) {
                  let findIndex = this.lumDataCustomers.findIndex(item => item.lubricationPointNumber === this.addLumdata.lubricationPointNumber); // 返回子项的下标
                  this.$refs.tableAddLum.setCurrentRow(this.lumDataCustomers[findIndex]);
                }
              });
            } else {
              this.loadMoreBon = false;
            }
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
    // 所属客户 change 事件
    handleChangeCustomer(val) {
      this.applylist.spId = "";
      this.applylist.userNumber = "";
      this.applylist.contactName = "";
      this.applylist.lubricationPointNumber = "";
      this.applylist.lubricationPointTypeName = "";
      if (!val) {
        return;
      }
      this.companyId = this.customerList.filter(item => {
        return item.companyNumber == val;
      })[0].companyId;
      this.oilSelectedCompanyName = this.customerList.filter(item => {
        return item.companyNumber == val;
      })[0].companyName;
      this.getSpList(this.companyId);
    },
    async getSpList(val) {
      if (this.$userInfo.userType == 1) {
        return (this.applylist.spId = val);
      }
      this.SPList = [];
      if (!val) return (this.SPList = []);

      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: val
      });
      this.SPList = res.data.data;
      if (this.SPList.length == 1) return (this.applylist.spId = this.SPList[0].spId);
    },
    // 车间改变事件
    handleChangeWorkshop(val) {
      this.applylist.userNumber = "";
      this.applylist.contactName = "";
      this.applylist.lubricationPointNumber = "";
      this.applylist.lubricationPointTypeName = "";
      if (!val) {
        return;
      }
      // this.getContactPerson();
    },
    // 提交工单调接口
    submitRequest() {
      if (this.userInfo.userType != "2" || (this.userInfo.distributorCompanyType == 1 && this.userInfo.userType == "2")) {
        if (!this.checked) {
          this.dialogCheckedVisible = true;
          return;
        }
      }
      let imgListPic = [];
      if (this.imageList.length) {
        this.imageList.map(item => {
          imgListPic.push(item.raw);
        });
      }
      let params = {
        serviceNumber: this.$route.query.serviceNumber, // 服务编码
        pesServiceItemId: this.$route.query.pesServiceItemId || "",
        expectComingTime: this.applylist.expectComingTime, // 期待上门时间
        assetClassId: this.assetClassId,
        assetId: this.assetId,
        bottleId: this.applylist.bottleId,
        shortDesc: this.applylist.shortDesc, // 工单简述
        pictureList: imgListPic, // 图片列表,
        lubricationPointNumber: this.applylist.lubricationPointNumber,
        lastOilChangeDate: this.applylist.lastOilChangeDate, // 上次用油日期
        oilAgeNum: this.applylist.oilAgeNumInput, // 油品年龄
        oilAgeNumUnit: this.applylist.oilUserTimeUnitCode, // 油品使用时间单位
        fillOilQuantity: this.applylist.repairNumber, // 补油量
        fillOilQuantityUnit: this.applylist.repairOilUnitName, // 补油单位
        lubricationPointAge: this.applylist.deviceAgeNumInput, // 设备年龄
        lubricationPointAgeUnit: this.applylist.deviceUseTimeUnitCode, // 设备年龄单位
        oilBoxTemperature: this.applylist.tankTempNumInput, // 油箱温度
        oilBoxTemperatureUnit: this.applylist.tempUnitCode, // 油箱温度单位
        changeOil: this.applylist.oilChangeCode, // 油品是否更换
        changeFilterElement: this.applylist.filterChangeCode, // 滤芯是否更换
        lubricationPointAttribute: JSON.stringify(this.updateLumForm.attributes),
        spId: this.applylist.spId,
        serviceProperty: this.applylist.serviceProperty.join(","),
        incomeBbl: this.applylist.incomeBbl,
        incomeRmb: this.applylist.incomeRmb
      };
      if (this.$route.query.resource == "apply") {
        params.workOrderType = 2;
      }
      if (this.userInfo.userType < 2) {
        params.valetOrderType = 1; // 代客下单
        params.contactCompanyNumber = this.applylist.companyNumber; // 客户编码
        params.contactNumber = this.applylist.userNumber || ""; // 联系人编码
        params.contactName = this.applylist.contactName || ""; // 联系人姓名
        params.contactPhone = this.applylist.contactPhone || ""; // 联系人电话
        if (this.distributiveBtn || this.executeBtn) {
          params.executePersonNumber = this.applylist.executePersonNumber;
        }
      } else {
        params.sendBottle = 1;
        params.valetOrderType = 0; // 工业客户自己下单
      }
      if (this.serviceApplyOrderId) {
        params.serviceApplyOrderId = this.serviceApplyOrderId;
      }
      if (this.$route.query.openOrderType == "serviceApply") {
        params.applyServiceItemId = this.$route.query.applyServiceItemId;
      }
      params.contactCompanyNumber = this.applylist.companyNumber; // 客户编码
      params.spId = this.applylist.spId;
      this.requestMethodPost("/weChat/workOrder/addChangeOilWorkOrder", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            // 调取消息未读数据
            this.$parent.msgCount();
            this.$message({
              message: "工单创建成功",
              type: "success"
            });
            this.$router.push({
              path: "/NewWorkOrderList/newWorkOrderOilDetail",
              query: {
                workOrderNumber: res.data
              }
            });
          } else if (res.code == 504) {
            this.$router.push({
              name: "NewWorkOrderList"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.$router.push({
            name: "NewWorkOrderList"
          });
        });
    },
    getHintCont() {
      let params = {};
      let url = "/web/clause/getClause";
      this.requestMethodGet(url, params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceClause = res.data.content;
            this.dialogVisibleHint = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 同意免责条款
    confirmChecked() {
      this.dialogCheckedVisible = false;
      this.checked = true;
      // 调取接口
      this.submitRequest();
    },
    // 提交
    handleSubmitForm(formName) {
      this.$refs[formName].validateField("bottleId", errMsg => {
        if (errMsg) {
          this.$message({
            message: "您所选的服务和油样服务不相符，请重新选择对应的服务类型，中止下单流程。",
            type: "warning"
          });
          return;
        }
      });
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.assetClassId) {
            this.notice = true;
            this.$message({
              message: "请确认润滑点信息",
              type: "warning"
            });
            return;
          }
          if (this.applylist.oilAgeNumInput && !this.applylist.oilUserTimeUnitCode) {
            this.$message({
              message: '"油品使用时间"有值，单位必填！',
              type: "warning"
            });
            return;
          }
          if (!this.applylist.oilAgeNumInput && this.applylist.oilUserTimeUnitCode) {
            this.$message({
              message: "请输入油品使用时间！",
              type: "warning"
            });
            return;
          }
          if (this.applylist.deviceAgeNumInput && !this.applylist.deviceUseTimeUnitCode) {
            this.$message({
              message: '"设备使用时间"有值，单位必填！',
              type: "warning"
            });
            return;
          }
          if (!this.applylist.deviceAgeNumInput && this.applylist.deviceUseTimeUnitCode) {
            this.$message({
              message: "请输入设备使用时间！",
              type: "warning"
            });
            return;
          }
          if (this.applylist.repairNumber && !this.applylist.repairOilUnitName) {
            this.$message({
              message: '"补油量"有值，单位必填！',
              type: "warning"
            });
            return;
          }
          if (!this.applylist.repairNumber && this.applylist.repairOilUnitName) {
            this.$message({
              message: "请输入补油量！",
              type: "warning"
            });
            return;
          }
          if (this.applylist.tankTempNumInput && !this.applylist.tempUnitCode) {
            this.$message({
              message: '"油箱温度"有值，单位必填！',
              type: "warning"
            });
            return;
          }
          if (!this.applylist.tankTempNumInput && this.applylist.tempUnitCode) {
            this.$message({
              message: "请输入油箱温度！",
              type: "warning"
            });
            return;
          }

          this.showPreview();
        } else {
          return false;
        }
      });
    }
  }
};
