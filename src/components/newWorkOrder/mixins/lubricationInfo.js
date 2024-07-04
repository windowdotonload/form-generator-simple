export default {
  data() {
    return {
      addOilDialog: false,
      addOilForm: {
        oilBrand: "",
        oilType: "",
        oilName: ""
      },
      addOilRules: {
        oilBrand: [{ required: true, message: "请选择油品品牌", trigger: "change" }],
        oilName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
        oilType: [{ required: true, message: "请选择油品类型", trigger: "change" }]
      },
      oilBrandListAdd: [],
      oilTypeListAdd: [],
      lubricationForm: {},
      lubricationRules: {
        typeName: [{ required: true, message: "请输入润滑设备类型", trigger: "blur" }],
        recommendOilName: [{ required: true, message: "请选择设备制造商推荐油品", trigger: "change" }],
        oilName: [{ required: true, message: "请选择在用油名称", trigger: "change" }],
        realNum: [{ required: true, message: "请选择系统内实际容量", trigger: "change" }],
        lastChangeOil: [{ required: true, message: "请选择上次换油日期", trigger: "change" }],
        lastTestOilDate: [{ required: true, message: "请选择上次油品实验室检测日期", trigger: "change" }]
      },
      uploadUrl: "",
      imgDialogVisible: false,
      dialogImageUrl: "",
      recommendOilList: [],
      oilBrandList: [],
      oilNameList: [],
      cylinderOilNameList: [],
      notShowUploadBtn: false,
      cylinderCurrentBrandCode: "",
      cylinderCurrentBrandName: "",
      oilNameKey: 0,
      cylinderOilNameKey: 0,
      fileList: [],
      dicList: [],
      tempImagePath: "",
      tempOilBrandCode: "",
      addType: "",
      addBrandNameType: "",
      currentOilBrandName: "",
      recommendAddOilType: "",
      lubricationMethodList: [],
      classList: [],
      radioVal: null,
      lubClassifyDetailList: [],
      oilAppearanceList: [],
      ruleForm:{}
    };
  },
  computed: {
    showOrHideState() {
      /**
       * 控制显隐整体分为三种情况：
       * 1 - 普通油润滑类 - return [ 0:common]
       * 2 - 特殊油类润滑 - return [1:special]
       * 3 - 脂类润滑 - return [2:lipid]
       *
       * lubricationPointTypeCode - 润滑点设备类型
       * lubricationMethod - 润滑方式
       *
       * 循环 - lubrication_method_0001
       * 飞溅/油谷 - lubrication_method_0002
       * 喷射 - lubrication_method_0003
       * 油雾 - lubrication_method_0004
       * 手刷 - lubrication_method_0005
       * 脂滑枪 - lubrication_method_0006
       * 集中供脂 - lubrication_method_0007
       * 其他油润滑 - lubrication_method_0008
       * 其他脂润滑 - lubrication_method_0009
       */
      const { lubricationPointTypeCode, lubricationMethod } = this.ruleForm;
      // console.log("lubricationPointTypeCode, lubricationMethod", lubricationPointTypeCode, lubricationMethod);
      if (lubricationMethod == "lubrication_method_0004" || (lubricationMethod == "lubrication_method_0003" && lubricationPointTypeCode == "lubrication_point_type_0011")) {
        return 1;
      } else if (
        lubricationMethod == "lubrication_method_0001" ||
        lubricationMethod == "lubrication_method_0002" ||
        lubricationMethod == "lubrication_method_0008" ||
        (lubricationMethod == "lubrication_method_0003" && lubricationPointTypeCode != "lubrication_point_type_0011")
      ) {
        return 0;
      } else if (
        lubricationMethod == "lubrication_method_0005" ||
        lubricationMethod == "lubrication_method_0006" ||
        lubricationMethod == "lubrication_method_0007" ||
        lubricationMethod == "lubrication_method_0009"
      ) {
        return 2;
      } else {
        return null;
      }
    }
  },
  methods: {
    // 刷新数据
    handleRefresh() {
      this.$_getLubricationPointDetail();
    },
    // 前往编辑
    async handleEdit() {
      // let routeUrl = this.$router.resolve({
      //   path: "/EquipmentProfile/EditEquipmentProfile",
      //   query: { deviceNumber: this.saveParams.deviceNumber, resource: 'task', currentLupNum: this.saveParams.lubricationPointNumber, lubricationPointNumber: this.saveParams.lubricationPointNumber }
      // });
      // window.open(routeUrl.href, "_blank");
      this.resource = 'task'
      let res = await this.requestMethodGet("/web/device/queryDevice", {deviceNumber: this.saveParams.deviceNumber})
      if(res.data.code==1000){
        const data = res.data.data;
        data.createTime = this.moment(new Date(data.createTime)).format("YYYY-MM-DD");
        const date = new Date().getTime();
        if (Math.floor((date - data.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.creatNew = true;
        }
        if (Math.floor((date - data.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.editNew = true;
        }
        this.epInfo = data;
      }
      this.selectLubricationPointNumber = this.saveParams.lubricationPointNumber
      this.addDeviceDialog = true
    },
    // 查看润滑点详情
    $_getLubricationPointDetail() {
      let params = {
        lubricationPointNumber: this.saveParams.lubricationPointNumber
      };
      this.requestMethodGet("/web/device/queryLubricationPointDetail", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.ruleForm = res.data
            console.log(this.showOrHideState)
            let list = [];
            let childList = [];
            // 按质不展示，是否自动生成下次换油计划
            let isShowLastChangeOilDate = false;
            let changeValue = false;
            let changeTime = false;
            try {
              this.lubricationForm.forEach(item => {
                if (item.nameKey == "lup_last_test_date") {
                  item.value = res.data.lastTestDate;
                }
                if (item.nameKey == "lup_name") {
                  // 润滑点设备名称
                  item.value = res.data.lubricationPointName;
                }
                if (item.nameKey == "lup_manufacturer_name") {
                  // 润滑点设备制造商名称
                  item.value = res.data.lubricationPointManufacturer;
                }
                if (item.nameKey == "lup_recommend_oil") {
                  // 设备制造商推荐油品
                  item.value = res.data.recommendOilName
                  item.valueCode = res.data.recommendOilCode
                }
                if (item.nameKey == "lup_oil_brand") {
                  // 在用油品牌
                  item.value = res.data.oilBrandName;
                }
                if (item.nameKey == "lup_current_oil") {
                  // 在用油品名称
                  item.value = res.data.currentOilName;
                  item.valueCode = res.data.currentOilCode
                }
                if (item.nameKey == "lup_oil_box_capacity") {
                  // 油箱容量
                  item.value = res.data.oilBoxCapacity;
                  if (item.children.length && item.children[0].value) {
                    item.children[0].value = res.data.oilBoxCapacityUnit;
                  }
                }
                if (item.nameKey == "lup_has_done_test") {
                  // 是否做过油品实验室检测
                  item.value = res.data.hasDoneTest ? "是" : "否";
                  item.valueCode = res.data.hasDoneTest ? "1" : "0";
                  if (item.value == "是") {
                    if (item.children.length && item.children[0].value) {
                      item.children[0].value = res.data.lastTestDate;
                    }
                  }
                }
                if (item.nameKey == "lup_img") {
                  // 润滑点图片
                  if (res.data.lubricationPointPicPath) {
                    let urlPic = res.data.lubricationPointPicPath;
                    item.imgFullDtoUrl = [];
                    item.imgFullDtoUrl.push({ url: urlPic });
                    item.value = res.data.lubricationPointPicRelativePath;
                  } else {
                    item.imgFullDtoUrl = [];
                    item.value = "";
                  }
                }
                // 找出油类/脂类对应字段
                let key = this.oilType == 1 ? "key_you_lei" : "key_zhi_lei";
                this.lubricationForm.forEach(it => {
                  if (it.nameKey == "lup_method") {
                    list = it.children;
                  }
                });
                list.forEach(item => {
                  if (item.nameKey == key) {
                    childList = item.children;
                  }
                });
              });
            } catch (e) {
              console.log(e);
            }

            if (this.oilType == 1) {
              //油类
              childList.forEach(it => {
                if (it.nameKey == "key_ding_qi") {
                  // 定期或者按质
                  it.value = res.data.oilChangeMethod == "2" ? "按质" : res.data.oilChangeMethod == "1" ? "定期" : "暂无";
                  it.valueCode = res.data.oilChangeMethod;
                }
                if (it.nameKey == "key_ding_qi" && it.valueCode == "2" ) {
                  isShowLastChangeOilDate = true;
                }
                if (it.nameKey == "lup_oil_change_period") { 
                  // 换油周期
                  it.value = res.data.oilChangePeriod;
                  it.children[0].value = res.data.oilChangePeriodUnitDesc;
                }
                if (it.nameKey == "lup_last_oil_change_date") {
                  // 上次换油日期
                  it.value = res.data.lastOilChangeDate;
                }
                if (it.nameKey == "key_lup_2") {
                  // // 上次换油时加注的油量
                  it.value = res.data.fillingQuantity;
                  it.children[0].value = res.data.fillingQuantityUnit;
                }
                if (it.nameKey == "key_lup_4") {
                  // 加油周期
                  it.value = res.data.oilAddPeriod;
                  it.children[0].value = res.data.oilAddPeriodUnit == "M" ? "月" : res.data.oilAddPeriodUnit == "Y" ? "年" : res.data.oilAddPeriodUnit == "D" ? "天" : res.data.oilAddPeriodUnit == "KM" ? '公里' : "小时";
                  if (it.value) {
                    changeValue = true;
                  }
                }
                if (it.nameKey == "key_lup_5") {
                  // 每次加油量
                  it.value = res.data.everyTimeOilAddQuantity;
                  it.children[0].value = res.data.everyTimeOilAddQuantityUnit;
                }
                if (it.nameKey == "key_lup_6") {
                  // 上次加油日期
                  it.value = res.data.lastOilAddDate;
                  if (it.value) {
                    changeTime = true;
                  }
                }
                if (it.nameKey == "key_lup_8") {
                  // 每月油品添加量
                  it.value = res.data.preMonthOilAddQuantity;
                  it.children[0].value = res.data.preMonthOilAddQuantityUnit;
                }
                //  是否自动生成下次换油计划  并给下次换油日期赋值
                if (it.nameKey == "key_lup_3") {
                  if(res.data.oilChangePeriodUnitDesc =='公里' || this.showOrHideState==1) {
                    it.display = false;
                  } else {
                    it.display = true;
                  }
                  it.value = res.data.autoCreateOilChangePlan ? "是" : "否";
                  it.valueCode = res.data.autoCreateOilChangePlan ? "1" : "0";
                }
                if (it.nameKey == "lup_next_scheduled_oil_change_date") {
                  it.value = res.data.nextScheduledOilChangeDate;
                  if(res.data.oilChangePeriodUnitDesc =='公里' || this.showOrHideState==1) {
                    it.display = false;
                    
                  } else {
                    it.display = true;
                  }
                  
                  
                }
              });
                
                // key_lup_7 是否自动生成下次加油计划
                childList.forEach((it, index) => {
                  if (it.nameKey == "key_lup_7") {
                    if(res.data.oilAddPeriodUnit == 'KM') {
                      it.display = false;
                    } else {
                      it.display = true;
                    }
                    
                    it.value = res.data.autoCreateOilAddPlan ? "是" : "否";
                    it.valueCode = res.data.autoCreateOilAddPlan ? "1" : "0";
                  }
                  if(it.nameKey == 'lup_next_add_oil_date') {
                    it.value = res.data.nextScheduledOilAddDate;
                    if(res.data.oilAddPeriodUnit == 'KM') {
                      it.display = false;
                    } else {
                      it.display = true;
                    }
                  }
                });
            } else {
              //脂类
              childList.forEach(it => {
                console.log(it.nameKey)
                if (it.nameKey == "key_lup_9") {
                  // 加脂周期
                  it.value = res.data.oilAddPeriod;
                  it.children[0].value = res.data.oilAddPeriodUnit == "M" ? "月" : res.data.oilAddPeriodUnit == "Y" ? "年" : res.data.oilAddPeriodUnit == "D" ? "天" : res.data.oilAddPeriodUnit == "KM" ? '公里' : "小时";
                }
                if (it.nameKey == "key_lup_10") {
                  // 每次加脂量
                  it.value = res.data.everyTimeOilAddQuantity;
                  it.children[0].value = res.data.everyTimeOilAddQuantityUnit;
                }
                if (it.nameKey == "key_lup_11") {
                  // 上次加脂日期
                  it.value = res.data.lastOilAddDate;
                }
                if (it.nameKey == "key_lup_12") {
                  // 是否自动生成下次加脂计划
                  it.valueCode = res.data.autoCreateOilAddPlan ? "1" : "0";
                  it.value = res.data.autoCreateOilAddPlan ? "是" : "否";
                  if(res.data.oilAddPeriodUnit == 'KM') {
                    it.display = false;
                  } else {
                    it.display = true;
                  }
                  
                }
                if (it.nameKey == "key_lup_13") {
                  // 预计下次加脂日期
                  it.value = res.data.nextScheduledOilAddDate;

                  console.log(res.data.oilAddPeriodUnit)
                  if(res.data.oilAddPeriodUnit == 'KM') {
                    it.display = false;
                  } else {
                    it.display = true;
                  }
                }
                if (it.nameKey == "key_lup_14") {
                  // 每月滑脂添加量
                  it.value = res.data.preMonthOilAddQuantity;
                  it.children[0].value = res.data.preMonthOilAddQuantityUnit;
                }
              });
            }
            this.classList = childList;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 油类/脂类日期显示时调用接口填充日期
    dateRadioChange(val, nameKey) {
      //油类== 是否自动生成下次换油计划---按质换油不展示--key_lup_3
      //油类== 是否自动生成下次加油计划--key_lup_7
      // 脂类== 是否自动生成下次加脂计划--key_lup_12
      // 找出换油周期单位和数值，以及选中的上次换油日期作为入参查出下次换油日期
      const list = this.classList;
      let lastOilDate = ""; //上次日期
      let cycleNum = ""; //周期数值
      let cycleUnit = ""; //周期单位
      // 根据nameKey找出对应参数调用接口
      if (val == "1") {
        list.forEach(it => {
          if (nameKey == "key_lup_3") {
            //是否自动生成下次换油计划
            if (it.nameKey == "lup_oil_change_period") {
              cycleUnit = it.value.slice(-1);
              cycleNum = it.split(cycleUnit)[0];
            }
            if (it.nameKey == "lup_last_oil_change_date") {
              lastOilDate = it.value;
            }
          }
          if (nameKey == "key_lup_7") {
            //是否自动生成下次加油计划
            if (it.nameKey == "key_lup_4") {
              //加油周期
              cycleNum = it.value;
              cycleUnit = it.children[0].value;
            }
            if (it.nameKey == "key_lup_6") {
              //上次加油日期
              lastOilDate = it.value;
            }
          }
          if (nameKey == "key_lup_12") {
            //是否自动生成下次加脂计划
            if (it.nameKey == "key_lup_9") {
              cycleNum = it.value;
              cycleUnit = it.children[0].value;
            }
            if (it.nameKey == "key_lup_11") {
              lastOilDate = it.value;
            }
          }
        });
        this.handlerDate(lastOilDate, cycleNum, cycleUnit, list, nameKey);
      }
    },
    handlerDate(lastOilDate, cycleNum, cycleUnit, list, nameKey) {
      // 提示不能为空
      let title = nameKey == "key_lup_3" ? "换油" : nameKey == "key_lup_7" ? "加油" : "加脂";
      let cycleTitle = title + "周期";
      let lastDateTitle = "上次" + title + "日期";
      if (!lastOilDate) {
        this.$message({
          type: "warning",
          message: lastDateTitle + "不能为空"
        });
        return;
      }
      if (!cycleNum || !cycleUnit) {
        this.$message({
          type: "warning",
          message: cycleTitle + "不能为空"
        });
        return;
      }
      const params = {
        oilChangePeriod: cycleNum,
        oilChangePeriodUnit: cycleUnit,
        oilLastTime: lastOilDate
      };
      this.requestMethodGet("/web/service/ps/plusChangeOilDate", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          list.forEach(it => {
            if (it.nameKey == nameKey) {
              it.children[0].value = data;
            }
          });
          this.classList = list;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 润滑点设备类型细分
    handleRadio1(val, radioItem) {
      if (radioItem.nameKey != "lup_device_detail") {
        return;
      }
      const list = radioItem.children;
      list.forEach(item => {
        if (item.id == val) {
          this.lubClassifyDetailList = item.children;
        }
      });
      if (val == "814" || val == "815") {
        this.getOilAppearanceList();
      }
      this.radioVal = val;
    },
    // 油品外观下拉数据
    getOilAppearanceList() {
      this.getDicDataList("oil_appearance").then(res => {
        this.oilAppearanceList = res;
      });
    },
    addOilName(val) {
      this.addType = "name";
      this.addBrandNameType = val;
      this.addOilForm.oilBrand = val == "1" ? this.tempOilBrandCode : this.cylinderCurrentBrandCode;
      this.getOilTypeData(this.addOilForm.oilBrand);
      this.addOilDialog = true;
    },
    addRecommendOil(val) {
      this.addType = "recommend";
      this.recommendAddOilType = val;
      this.addOilDialog = true;
    },
    // 获取品牌数据
    getOilBrandData() {
      const params = {
        status: 1,
        parentCode: 0
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          let brandList = [];
          if (data.length !== 0) {
            brandList = data.filter(it => {
              return it.code !== "oil_0001";
            });
          }
          this.oilBrandListAdd = brandList;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    selectOilBrandAdd(val) {
      if (val) {
        this.getOilTypeData(val);
      } else {
        this.oilTypeListAdd = [];
      }
    },
    // 取消自定义油品
    cancelAddOil(formName) {
      this.addOilDialog = false;
      this.$refs[formName].resetFields();
    },
    completeAddOil(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            oilBrand: this.addOilForm.oilBrand,
            oilName: this.addOilForm.oilName,
            customerCompanyNumber: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber,
          };
          this.requestMethodPost("mdm/oil/addOil", params).then(res => {
            if (res.data.code == 1000) {
              if (this.addType == "recommend") {
                if (this.recommendAddOilType == "1") {
                  this.lubricationForm.forEach(item => {
                    if (this.type == "edit" && item.type == "dropdown" && item.nameKey == "lup_recommend_oil") {
                      item.value = res.data.data;
                      item.valueCode = res.data.data;
                    }
                  });
                } else {
                  //radio5的情况
                }
                this.getOilList(this.tempOilBrandCode);
                this.getOilList(this.cylinderCurrentBrandCode);
                this.getOilList();
              } else {
                if (this.addBrandNameType == "1") {
                  //在用油名称
                  this.lubricationForm.forEach(item => {
                    if (item.nameKey == "lup_current_oil") {
                      item.value = res.data.data;
                      item.valueCode = res.data.data;
                    }
                  });
                  this.handleAddOilName(this.tempOilBrandCode);
                } else {
                  //radio5情况
                }
              }
              this.cancelAddOil(formName);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleAddOilName(val) {
      this.requestMethodGet("/mdm/oil/queryOilList",{oilName:'', parentCode:val, status:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.oilNameList = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取润滑方式下拉值
    getLubricationPointTypeList() {
      const params = {
        typeCode: this.lubricationPointTypeCode
      };
      this.requestMethodGet("/web/device/getLubricationMethodByType", params)
        .then(res => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            this.lubricationMethodList = data;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取dropdown1类型的dic下拉数据源
    getDicList(key) {
      this.requestMethodGet("/web/common/dic/drops", { name: key }).then(res => {
        res = res.data;
        if (res.code == 1000) {
          this.lubricationForm.forEach(item => {
            if (item.nameKey == key) {
              item.dicList = res.data;
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 日期框事件
    dateChange(item) {
      if (item.nameKey != "lup_last_oil_change_date") {
        return;
      } else {
        // 找出换油周期单位和数值，以及选中的上次换油日期作为入参查出下次换油日期
        let oilChangePeriod;
        let oilChangePeriodUnit;
        let oilLastTime = item.value;
        this.lubricationForm.forEach(it => {
          if (it.nameKey == "lup_oil_change_period") {
            //换油周期
            oilChangePeriodUnit = it.unit;
            oilChangePeriod = it.value;
          }
        });
        const params = {
          oilChangePeriod: oilChangePeriod,
          oilChangePeriodUnit: oilChangePeriodUnit,
          oilLastTime: oilLastTime
        };
        this.requestMethodGet("/web/service/ps/plusChangeOilDate", params).then(res => {
          if (res.data.code == 1000) {
            this.lubricationForm.forEach(it => {
              if (it.nameKey == "lup_next_scheduled_oil_change_date") {
                //换油周期
                it.value = res.data.data;
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
        // console.log('params.......',params)
      }
    },
    getCylinderListDic(key) {
      this.requestMethodGet("/web/common/dic/drops", { name: key }).then(res => {
        res = res.data;
        if (res.code == 1000) {
          this.lubricationForm.forEach(item => {
            if (item.type == "radio5") {
              item.children.forEach(it => {
                if (it.type == "dropdown1") {
                  it.dicList = res.data;
                }
              });
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取油品下拉
    getOilList(val) {
      const params = {oilName:'', status:1}
      if(val) params.parentCode =val 
      this.requestMethodGet("/mdm/oil/queryOilList",params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (val==this.tempOilBrandCode) {
              this.oilNameList = res.data.list
            }
            if (val==this.cylinderCurrentBrandCode) {
              this.cylinderOilNameList = res.data.list
            }
            if(!val) this.oilBrandList = data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 递归设置三级可选
    setOilName(data) {},
    // 油品品牌改变
    changeOilBrand(val) {
      ++this.oilNameKey;
      let currentOilBrandName = "";
      if (this.tempOilBrandCode != val) {
        this.oilBrandList.forEach(it => {
          if (it.oilNumber == val) {
            currentOilBrandName = it.oilName;
            this.oilNameList = it.children;
          }
        });
        this.tempOilBrandCode = val;
        this.currentOilBrandName = currentOilBrandName;
      }
      this.lubricationForm.forEach(item => {
        if (item.nameKey == "lup_oil_brand") {
          item.value = currentOilBrandName;
          item.valueCode = val;
        }
      });
    },
    // 气缸润滑方式-在用油品牌选中
    cylinderChangeOilBrand(val) {
      ++this.cylinderOilNameKey;
      let currentOilBrandName = "";
      if (this.tempOilBrandCode != val) {
        this.oilBrandList.forEach(it => {
          if (it.oilNumber == val) {
            currentOilBrandName = it.oilName;
            this.cylinderOilNameList = it.children;
          }
        });
        this.cylinderCurrentBrandCode = val;
        this.cylinderCurrentBrandName = currentOilBrandName;
      }
      this.lubricationForm.forEach(item => {
        if (item.type == "radio5") {
          item.children.forEach(it => {
            if (it.nameKey == "lup_oil_brand") {
              it.value = currentOilBrandName;
              it.valueCode = val;
            }
          });
        }
      });
    },
    // 清除油品品牌置空在用油名称
    clearOilBrand(type) {
      if (type == "cylinder") {
        this.lubricationForm.forEach(item => {
          if (item.type == "radio5") {
            item.children.forEach(it => {
              if (it.nameKey == "lup_current_oil" || it.nameKey == "lup_oil_brand") {
                it.value = "";
                it.valueCode = "";
              }
            });
          }
        });
        this.cylinderOilNameList = [];
      } else {
        this.lubricationForm.forEach(item => {
          if (item.nameKey == "lup_current_oil" || it.nameKey == "lup_oil_brand") {
            item.value = "";
            item.valueCode = "";
          }
        });
        this.oilNameList = [];
      }
    },
    // 设备制造商推荐油品
    recommendChange(item) {
      const data = this.lubricationForm;
      const checkedData = this.$refs.recommendRef[0].getCheckedNodes()[0];
      let lastCheckedNode = checkedData.pathNodes[checkedData.pathNodes.length - 1];
      let lastNum = 0;
      if (lastCheckedNode.children && lastCheckedNode.children.length > 0) {
        lastNum = lastCheckedNode.level + 1;
      } else {
        lastNum = lastCheckedNode.level;
      }
      if (checkedData.pathNodes[0].value == "oil_0001") {
        //选中的是美孚
        this.judgeRecommend(lastCheckedNode.level, lastNum, data, lastCheckedNode);
      } else {
        //选中的是其他品牌
        this.judgeRecommend(lastCheckedNode.level, lastNum, data, lastCheckedNode);
      }
    },
    judgeRecommend(lastLevel, val, data, lastCheckedNode) {
      if (lastLevel != val) {
        //没有选到最后一级
        this.$message({
          message: "请选择油品名称",
          type: "warning"
        });
        return;
      }
      data.forEach(item => {
        if (item.nameKey == "lup_recommend_oil") {
          item.value = lastCheckedNode.label;
          item.valueCode = lastCheckedNode.value;
        }
      });
    },
    // 气缸润滑方式-设备制造商推荐油品
    cylinderRecommendChange(item) {
      const data = this.lubricationForm;
      const checkedData = this.$refs.cylinderRef[0].getCheckedNodes()[0];
      let lastCheckedNode = checkedData.pathNodes[checkedData.pathNodes.length - 1];
      let lastNum = 0;
      if (lastCheckedNode.children && lastCheckedNode.children.length > 0) {
        lastNum = lastCheckedNode.level + 1;
      } else {
        lastNum = lastCheckedNode.level;
      }
      if (checkedData.pathNodes[0].value == "oil_0001") {
        //选中的是美孚
        this.cylinderJudgeRecommend(lastCheckedNode.level, lastNum, data, lastCheckedNode);
      } else {
        //选中的是其他品牌
        this.cylinderJudgeRecommend(lastCheckedNode.level, lastNum, data, lastCheckedNode);
      }
    },
    cylinderJudgeRecommend(lastLevel, val, data, lastCheckedNode) {
      if (lastLevel != val) {
        //没有选到最后一级
        this.$message({
          message: "请选择油品名称",
          type: "warning"
        });
        return;
      }
      data.forEach(item => {
        if (item.type == "radio5") {
          item.children.forEach(it => {
            if (it.nameKey == "lup_recommend_oil") {
              it.value = lastCheckedNode.label;
              it.valueCode = lastCheckedNode.value;
            }
          });
        }
      });
    },
    // 用油名称改变
    oilNameChange(item) {
      const data = this.lubricationForm;
      const checkedData = this.$refs.cascaderRef[0].getCheckedNodes()[0];
      let oilNameValueCode = [];
      let oilBrandValueCode = "";
      data.forEach(it => {
        if (it.nameKey == "lup_oil_brand") {
          oilBrandValueCode = it.valueCode;
        }
        if (it.nameKey == "lup_current_oil") {
          oilNameValueCode = it.valueCode;
        }
      });
      if (oilBrandValueCode == "oil_0001") {
        //美孚
        if (oilNameValueCode.length != 3) {
          this.$message({
            message: "请选择油品名称",
            type: "warning"
          });
          return;
        } else {
          item.value = checkedData.label;
          item.valueCode = checkedData.path[checkedData.path.length - 1];
        }
      } else {
        if (oilNameValueCode.length != 2) {
          this.$message({
            message: "请选择油品名称",
            type: "warning"
          });
          return;
        } else {
          item.value = checkedData.label;
          item.valueCode = checkedData.path[checkedData.path.length - 1];
        }
      }
    },
    // 气缸润滑方式-在用油名称
    cylinderOilNameChange(item) {
      const checkedData = this.$refs.cylinderCurrentOilRef[0].getCheckedNodes()[0];
      let oilNameValueCode = [];
      let oilBrandValueCode = "";
      this.lubricationForm.forEach(it => {
        if (it.type == "radio5") {
          it.children.forEach(lup => {
            if (lup.nameKey == "lup_oil_brand") {
              oilBrandValueCode = lup.valueCode;
            }
            if (lup.nameKey == "lup_current_oil") {
              oilNameValueCode = lup.valueCode;
            }
          });
        }
      });
      if (oilBrandValueCode == "oil_0001") {
        //美孚
        if (oilNameValueCode.length != 3) {
          this.$message({
            message: "请选择油品名称",
            type: "warning"
          });
          return;
        } else {
          item.value = checkedData.label;
          item.valueCode = checkedData.path[checkedData.path.length - 1];
        }
      } else {
        if (oilNameValueCode.length != 2) {
          this.$message({
            message: "请选择油品名称",
            type: "warning"
          });
          return;
        } else {
          item.value = checkedData.label;
          item.valueCode = checkedData.path[checkedData.path.length - 1];
        }
      }
    },
    // 上传前置
    beforelubricationImgUpload(file) {},
    // 上传
    addFileChange(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      if (fileList.length) {
        this.notShowUploadBtn = true;
        let params = new FormData();
        params.append("fileType", "lubrication_point");
        params.append("multipartFiles", file.raw);
        this.requestMethodPost("/web/file/uploadFiles", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.tempImagePath = res.data[0];
              this.getFullImgPath(res.data[0]);
            } else {
              this.notShowUploadBtn = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(path) {
      const params = {
        url: path
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.lubricationForm.forEach(item => {
            if (item.nameKey == "lup_img") {
              item.value = path;
              item.imgFullDtoUrl = [];
              item.imgFullDtoUrl.push({
                name: item.nameKey,
                url: res.data.data
              });
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 预览
    handlePictureCardPreview(file, fileList) {
      const params = {
        url: this.tempImagePath
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.dialogImageUrl = res.data.data;
          this.imgDialogVisible = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 移除
    removeFileChange() {
      this.notShowUploadBtn = false;
      this.lubricationForm.forEach(item => {
        if (item.nameKey == "lup_img") {
          item.value = "";
          item.imgFullDtoUrl = [];
        }
      });
    },
    // dic下拉改变事件
    changeselect(val) {
      // console.log('this.lubricationForm',this.lubricationForm)
    },
    // 验证
    validateDevice() {
      const data = this.lubricationForm;
      const lubDetail = this.lubClassifyDetailList; //细分
      const classList = this.classList; //油类/脂类
      // let isTestOilVal = ''
      let lastTestOilDate = [];
      let radio5EmptyList = [];
      let emptyChildList = [];
      let emptyList = data.filter(item => {
        return item.required && !item.value && item.display;
      });
      let emptyLubList = lubDetail.filter(it => {
        return it.required && !it.value  && it.display;
      });
      let emptyClassList = classList.filter(it => {
        return it.required && !it.value && it.display;
      });
      // 找出radio5类型
      data.forEach(item => {
        if (item.type == "radio5" && item.value == "1") {
          radio5EmptyList = item.children.filter(it => {
            return it.required && !it.value && it.display;
          });
        }
      });
      emptyChildList = emptyChildList
        .concat(emptyList)
        .concat(radio5EmptyList)
        .concat(emptyLubList)
        .concat(emptyClassList);
      // console.log('data',data,emptyList,radio5EmptyList,emptyChildList)
      data.forEach(item => {
        if (item.nameKey == "lup_has_done_test") {
          lastTestOilDate = item.children[0];
          // isTestOilVal = item.value
        }
      });
      // if(isTestOilVal == '1' && !lastTestOilDate.value){
      //   emptyChildList.push(lastTestOilDate)
      // }
      // 去重值唯一
      var obj = {};
      emptyChildList = emptyChildList.reduce(function(item, next) {
        obj[next.nameKey] ? "" : (obj[next.nameKey] = true && item.push(next));
        return item;
      }, []);
      let validateDataList = this.lubricationForm.concat(this.classList);
      // 加油/加脂周期规则  key_lup_4/key_lup_9
      let key = this.oilType == 1 ? "key_lup_4" : "key_lup_9";
      let msg = this.oilType == 1 ? "加油" : "加脂";
      let inputVal = "";
      let inputUnit = "";
      let maxNum = null;
      validateDataList.forEach(it => {
        if (it.nameKey == key) {
          inputVal = it.value;
          inputUnit = it.children[0].value;
        }
      });
      if (inputVal && inputUnit) {
        let rangMax = inputUnit == "Y" ? 20 : inputUnit == "M" ? 240 : inputUnit == "D" ? 7300 : 175200;
        if (this.oilType == 1) {
          //加油
          maxNum = rangMax;
        } else {
          //加脂
          maxNum = rangMax / 10;
        }
        if (!(inputVal >= 1 && inputVal <= maxNum)) {
          this.$message({
            message: msg + "周期填写内容错误",
            type: "warning"
          });
          return;
        }
      }
      // 输入正数，小数点后三位小数校验
      // 油类
      // 1.上次换油时加注的油量 key_lup_2
      // 2.每次加油量 key_lup_5
      // 3.每月油品添加量 key_lup_8
      // 脂类
      // 1.每次加脂量 key_lup_10
      // 2.每月滑脂添加量 key_lup_14
      const floatNumList = [];
      validateDataList.forEach(it => {
        if ((it.nameKey == "key_lup_2" || it.nameKey == "key_lup_5" || it.nameKey == "key_lup_8" || it.nameKey == "key_lup_10" || it.nameKey == "key_lup_14") && it.value) {
          floatNumList.push(it);
        }
      });
      let validateNotEmptyList = [];
      floatNumList.forEach(it => {
        let floatReg = /^[0-9]+(\.[0-9]{1,3})?$/g;
        it.resultFlag = floatReg.test(it.value);
        if (!it.resultFlag) {
          validateNotEmptyList.push(it);
        }
      });
      if (validateNotEmptyList.length) {
        this.$message({
          type: "warning",
          message: validateNotEmptyList[0].name + "填写错误，请输入正数，且小数点后最多三位小数"
        });
        return;
      }

      if (emptyChildList.length > 0) {
        this.$message({
          message: emptyChildList[0].name + "必填",
          type: "warning"
        });
      } else {
        this.$emit("passModulValidate");
      }
    }
  }
};
