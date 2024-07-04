import { baseRemoteOauth2 } from "@/api/api";
export default {
  data() {
    return {
      selectCustomerList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      importChangeOilFlag:JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).orgInfo.importChangeOilFlag,
      revertTypeList: [
        {
          label: "客户退回",
          value: 2
        },
        {
          label: "执行人撤回",
          value: 1
        },
        {
          label: "无撤回退回",
          value: 0
        }
      ],
      screenWidth: null,
      screenW: window.screen.width,
      pageHeight: "",
      time: "", //预约时间
      serviceTypeForm: {
        serviceType: ""
      },
      //  自定义属性
      industruProps: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children",
        disabled: !"hasAuth"
      },
      //  自定义属性
      industruPropsSelect: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children"
      },
      //   表单验证规则
      serviceTypeRule: {
        serviceType: [{ required: true, message: "请选择服务类型", trigger: "change" }]
      },
      contactDetail: {},
      executeDetail: {},
      addWorkorderVisibled: false, // 新建工单
      loadingInput: false,
      timeCreated: "", // 创建日期
      downLoadWorkorder: false, // 导出工单
      totalWorkorder: 0, // 导出的数据
      downloadWay: "", //导出方式
      dialogTableVisible: false,
      list: [],
      queryParams: {
        companyIds: "",
        workOrderNumber: "", //工单编号
        serviceNumber: "", //服务类型
        orderBy: "workOrderNumber", //默认工单编号降序排序
        descFlag: true,
        workOrderStatus: "",
        distributorCompanyName: "",
        executePersonName: "",
        evaluateTimeStart:"",
        evaluateTimeEnd:"",
        expectComingTimeStart: "", //开始时间
        expectComingTimeEnd: "", //结束时间
        createTimeStart: "", //开始时间
        createTimeEnd: "", //结束时间
        pesFlag: [], // 服务等级
        workshopId: "", //车间
        revertType: [],
        isGood:''
      },
      serviceTypeList: [{ value: "1", label: "PES" }, { value: "2", label: "DPES" }, { value: "0", label: "普通" }], //服务等级
      typeList: [], //服务类型列表
      typeListData: [], // 包含禁用功能的
      addServiceType: "", // 新建工单类型
      serviceId: "",
      reportType: "",
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
      selectList: [], //选中的表格列表
      loading: false, //是否展示加载动画，默认隐藏
      totalNumber: 0, //总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      serviceNumberLast: "",
      selectServiceNumber: "",
      selectServiceLevel: '',
      selectMslaServiceType: '',
      typeName: "",
      dialogOilChangeVisible: false,
      oilChangefieldOption: [],
      valueCheckBoxList: [],
      resultBox: false,
      paramDataLubFlag: false,
      coreDataLubFlag: false,
      coreDataTemplateId: null,
      listEmptyType: "work_order",
      limitFlag: false
    };
  },
  created() {
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "service_order_new_add_btn") {
        this.limitFlag = true;
      }
    }
  },
  methods: {
    clickServiceItem(slotScope) {
      const ownerRoleIds = this.$userInfo.accessTemplates.map(item => item.accessTemplateId.toString());
      const data = slotScope.data;
      this.woFormType = data.woFormType
      let authorityRoles = [];
      if (data.authorityRole) {
        authorityRoles = data.authorityRole.split(",").map(item => item.toString());
        const authorFlag = authorityRoles.some(item => ownerRoleIds.includes(item));
        if (!authorFlag) {
          this.disabledSelServiceItem = true;
          console.log(this.userInfo.userType)
          let msg=''
          if(this.$userInfo.userType=='2') {
            msg=`您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚当地授权经销商或者区域技术工程师解决服务申请事宜。`
          } else {
            msg=`您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚区域技术工程师解决服务申请事宜。`
          }
          this.$message({
            type: "warning",
            message: msg
          });
          this.$nextTick(() => {
            setTimeout(() => {
              this.selectServiceNumber = "";
              this.selectServiceLevel = "";
              this.selectMslaServiceType = "";
              this.serviceTypeForm.serviceType = "";
              this.$refs.cascaderAddr.inputValue = "";
              this.$refs.cascaderAddr.checkedValue = [];
              this.$refs.cascaderAddr.presentText = [];
            }, 100);
          });
        }
      }
    },
    handleChangeService(val) {
      if (val) {
        this.queryParams.serviceNumber = val[val.length - 1];
        this.handleSearchTableData();
      } else {
        this.queryParams.serviceNumber = "";
        this.handleSearchTableData();
      }
    },
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
    // 创建工单选择服务类型
    handleSelectServiceType(val) {
      if (this.disabledSelServiceItem) return (this.disabledSelServiceItem = false);
      this.selectServiceNumber = val[val.length - 1];
      this.typeList.map(item => {
        if (item.children) {
          item.children.map(i => {
            if (i.children) {
              i.children.map(t => {
                if (t.serviceNumber == this.selectServiceNumber) {
                  this.addServiceType = t.serviceType;
                  this.selectServiceLevel = t.serviceLevel;
                  if(t.mslaServiceType) {
                    this.selectMslaServiceType = t.mslaServiceType
                  }
                  this.reportType = t.reportType;
                  this.typeName = t.serviceName;
                  this.serviceId = t.id;
                  this.paramDataLubFlag = t.paramDataLubFlag;
                  this.coreDataLubFlag = t.coreDataLubFlag;
                  this.coreDataTemplateId = t.coreDataTemplateId;
                }
              });
            } else {
              if (i.serviceNumber == this.selectServiceNumber) {
                this.addServiceType = i.serviceType;
                this.selectServiceLevel = i.serviceLevel;
                if(i.mslaServiceType) {
                  this.selectMslaServiceType = i.mslaServiceType
                }
                this.serviceId = i.id;
                this.reportType = t.reportType;
                this.typeName = i.serviceName;
                this.paramDataLubFlag = t.paramDataLubFlag;
                this.coreDataLubFlag = t.coreDataLubFlag;
                this.coreDataTemplateId = t.coreDataTemplateId;
              }
            }
          });
        } else {
          if (item.serviceNumber == this.selectServiceNumber) {
            this.addServiceType = item.serviceType;
            this.selectServiceLevel = item.serviceLevel;
            if(item.mslaServiceType) {
              this.selectMslaServiceType = item.mslaServiceType
            }
            this.serviceId = item.id;
            this.reportType = t.reportType;
            this.typeName = item.serviceName;
            this.paramDataLubFlag = t.paramDataLubFlag;
            this.coreDataLubFlag = t.coreDataLubFlag;
            this.coreDataTemplateId = t.coreDataTemplateId;
          }
        }
      });
    },
    // 新建工单
    handleAddWorkOrder() {
      this.$gio.clickCreateWorkorderButton();
      console.log('新建工单')
      this.addWorkorderVisibled = true;
    },
    handleResetAdd(formName) {
      this.addWorkorderVisibled = false;
      this.$refs[formName].resetFields();
      this.$gio.Track("selectServiceType", {
      });
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
    // 取消选择换油情况
    consoleOilChange() {
      this.dialogOilChangeVisible = false;
    },
    // 确认继续
    confirmContiun() {
      if (this.valueCheckBoxList.length > 0) {
        this.createdWork();
      } else {
        this.$message({
          message: "请选择换油情况",
          type: "warning"
        });
      }
      //
    },
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
    // 确定新建工单
    sureAddWorkOrder(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.reportType == "11") {
            this.dialogOilChangeVisible = true;
            this.getOilChangeStatus();
          } else {
            this.createdWork();
          }
          // this.createdWork()
          this.$gio.Track("selectServiceType", {
            serviceType: this.$gio.findValueCodeCorresponding(this.typeList, this.serviceTypeForm.serviceType[this.serviceTypeForm.serviceType.length - 1], "serviceNumber", "serviceName", true)
            
          });
        } else {
          return false;
        }
      });
    },
    createdWork() {
      if (this.addServiceType == "1") {
        this.$router.push({
          path: "/NewWorkOrderList/AddWorkOrderOil",
          query: {
            serviceType: this.addServiceType,
            serviceNumber: this.selectServiceNumber,
            serviceLevel: this.selectServiceLevel,
            mslaServiceType: this.selectMslaServiceType,
            typeName: this.typeName,
            pesServiceItemId: "",
            woFormType:this.woFormType
          }
        });
      } else if (this.addServiceType == "2" || this.addServiceType == "9" || this.addServiceType == "10") {
        this.$router.push({
          path: "/NewWorkOrderList/AddWorkOrder",
          query: {
            serviceNumber: this.selectServiceNumber,
            addServiceType: this.addServiceType,
            serviceId: this.serviceId,
            typeName: this.typeName,
            reportType: this.reportType,
            paramDataLubFlag: this.paramDataLubFlag,
            coreDataLubFlag: this.coreDataLubFlag,
            coreDataTemplateId: this.coreDataTemplateId,
            pesServiceItemId: "",
            changeOil: this.valueCheckBoxList.toString(),
            woFormType:this.woFormType
          }
        });
      } else {
        this.$message({
          message: "此服务类型不可以创建工单",
          type: "warning"
        });
      }
    },
    // 复制工单编号
    onCopy(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
      this.$gio.copyWorkorderNumber({
        workorderNumber: row.workOrderNumber
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
          this.contactDetail.headUrl = res.data.data;
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
        if (type == "contact") {
          this.contactDetail = {};
        } else {
          this.executeDetail = {};
        }
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                if (type == "contact") {
                  this.contactDetail = res.data;
                  if (this.contactDetail.avatar) {
                    this.getFullUrl(this.contactDetail.avatar);
                  }
                  if (this.contactDetail.roleNames) {
                    this.contactDetail.roleNames = this.contactDetail.roleNames.join(",");
                  }
                  if (this.contactDetail.phonenumber) {
                    const phoneNum = this.contactDetail.phonenumber;
                    this.contactDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                  }
                } else {
                  this.executeDetail = res.data;
                  if (this.executeDetail.avatar) {
                    this.getFullUrl(this.executeDetail.avatar);
                  }
                  if (this.executeDetail.roleNames) {
                    this.executeDetail.roleNames = this.executeDetail.roleNames.join(",");
                  }
                  if (this.executeDetail.phonenumber) {
                    const phoneNum = this.executeDetail.phonenumber;
                    this.executeDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                  }
                }
              } else {
                if (type == "contact") {
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                } else {
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                }
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
    // 查看联系人详情
    executePersonDetail(scope) {
      this.contactDetail = {};
      if (scope.row.contactNumber) {
        this.getUserDetail(scope.row.contactNumber, scope.$index, "contact");
      }
    },
    // 查看执行人详情
    contactPersonDetail(scope) {
      this.executeDetail = {};
      if (scope.row.executePersonId) {
        this.getUserDetail(scope.row.executePersonId, scope.$index, "execute");
      }
    },
    // 查询
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_getWOData();
    },
    // 获取时间
    handleGetDate(val) {
      if (val) {
        this.queryParams.expectComingTimeStart = val[0];
        this.queryParams.expectComingTimeEnd = val[1];
      }
      this.handleSearchTableData();
    },
    handleGetDateCreated(val) {
      if (val) {
        this.queryParams.createTimeStart = val[0];
        this.queryParams.createTimeEnd = val[1];
      }
      this.handleSearchTableData();
    },
    // 重置
    handleClearSearch() {
      sessionStorage.setItem('serviceNumberStorage',"")
      this.queryParams = {
        companyIds: "",
        workOrderNumber: "", //工单编号
        serviceNumber: "", //服务类型
        orderBy: "workOrderNumber", //默认工单编号降序排序
        descFlag: true,
        workOrderStatus: "",
        distributorCompanyName: "",
        executePersonName: "",
        evaluateTimeStart:"",
        evaluateTimeEnd:"",
        expectComingTimeStart: "", //开始时间
        expectComingTimeEnd: "", //结束时间
        createTimeStart: "", //开始时间
        createTimeEnd: "", //结束时间
        pesFlag: [], // 服务等级
        workshopId: "", //车间
        revertType: [],
        isGood:''
      };
      this.time = "";
      this.timeCreated = "";
      this.selectCustomerList = []
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
        if(item.paramValue == "workshopId"){
          item.selectOptions = []
        }
      })
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
    // 取消导出  handleResetFinish
    handleResetFinish() {
      this.downLoadWorkorder = false;
    },
    // 确认导出
    sureDownLoadOrder() {
      let url = "";
      let paramObj = {}
      this.downLoadWorkorder = false;
      if (this.downloadWay == "selectDownLoad") {
        url = "/web/workOrder/webExportAll";
        paramObj = {
          workOrderNumbers: this.selectList.toString(),
          responseTypeBlob: true
        }
      } else if (this.downloadWay == "allDownLoad") {
        //全部下载
        this.queryParams.serviceNumber = this.queryParams.serviceNumber ? this.queryParams.serviceNumber : "";
        this.queryParams.pesFlag = this.queryParams.pesFlag.length>0 ? this.queryParams.pesFlag.toString() : "";
        this.queryParams.workOrderStatus = this.queryParams.workOrderStatus==5 ? "" : this.queryParams.workOrderStatus;
        url = "/web/workOrder/webExportAll";
        paramObj = {
          workOrderNumber: this.queryParams.workOrderNumber,
          serviceNumber: this.queryParams.serviceNumber,
          distributorCompanyName: this.queryParams.distributorCompanyName,
          executePersonName: this.queryParams.executePersonName,
          companyIds: this.queryParams.companyIds,
          pesFlag: this.queryParams.pesFlag,
          createTimeStart: this.queryParams.createTimeStart,
          createTimeEnd: this.queryParams.createTimeEnd,
          expectComingTimeStart: this.queryParams.expectComingTimeStart,
          expectComingTimeEnd: this.queryParams.expectComingTimeEnd,
          evaluateTimeStart: this.queryParams.evaluateTimeStart,
          evaluateTimeEnd: this.queryParams.evaluateTimeEnd,
          revertType: this.queryParams.revertType.toString(),
          workshopId: this.queryParams.workshopId,
          workOrderStatus: this.queryParams.workOrderStatus,
          responseTypeBlob: true
        }
      }
      this.requestMethodGet(url, paramObj).then(res => {
        let data = res.data;
        let fileReader = new FileReader();
        let that = this;
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
            if (jsonData.code == 1000) {
              that.$message({
                message: jsonData.data,
                type: "success"
              });
              return;
            } else {
              that.$message({
                message: jsonData.data,
                type: "error"
              });
            }
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });
            const objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download", "工单.xls");
            document.body.appendChild(link);
            link.click();
          }
        };
        fileReader.readAsText(data);
      })
      .catch(res => {});
    },
    // 下载
    handleDownload() {
      //表格多选下载
      if (this.selectList.length > 0) {
        this.downLoadWorkorder = true;
        this.totalWorkorder = this.selectList.length;
        this.downloadWay = "selectDownLoad";
      } else {
        this.downLoadWorkorder = true;
        this.totalWorkorder = this.totalNumber;
        this.downloadWay = "allDownLoad";
      }
    },
    // 批量下载
    // handleBatchDownload() {},
    //表格多选事件
    handleSelectionChange(select) {
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push(item.workOrderNumber);
      });
    },
    // 查看
    handleLook(row) {
      if (row.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 9 || row.serviceType == 10 || row.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
      this.$gio.toWorkorderDetails({
        entrance: "工单列表"
      });
    },
    // 获取工单列表
    $_getWOData() {
      this.loading = true;
      this.queryParams.workOrderStatus = this.queryParams.workOrderStatus==5?"":this.queryParams.workOrderStatus;
      let params = { ...this.queryParams, ...this.pagenation };
      params.revertType = params.revertType.toString();
      params.pesFlag = params.pesFlag.toString();
      params.workOrderPesFlag = params.pesFlag;
      params.workOrderStatus = params.workOrderStatus.includes('5')?'':params.workOrderStatus
      params.menuCode = "NewWorkOrderList";
      this.requestMethodGet("/weChat/workOrder/customerWithWorkOrderByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.woTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.pagenation.current = res.data.pageIndex;
            this.$gio.filterWorkorder({
              serviceType: this.$gio.findValueCodeCorresponding(this.typeList, params.serviceNumber, "serviceNumber", "serviceName", true) || "无",
              serviceLevel: this.$gio.findValueCodeCorresponding(this.serviceTypeList, params.pesFlag, "value", "label") || "无",
              recallOrReject: this.$gio.findValueCodeCorresponding(this.revertTypeList, params.revertType, "value", "label") || "无",
              appointmentTime: `${this.queryParams.expectComingTimeStart || "无"} - ${this.queryParams.expectComingTimeEnd || "无"}`,
              createTime: `${this.queryParams.createTimeStart || "无"} - ${this.queryParams.createTimeEnd || "无"}`
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
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    // 服务类型
    $_getServiceList(val) {
      this.typeList = [];
      this.loadingInput = true;
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: val || "", serviceDisplay: 1 })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.loadingInput = false;
            this.typeList = res.data;
            this.typeList = this.formatData(this.typeList);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 服务类型
    $_getServiceListAll(val) {
      this.typeListData = [];
      this.loadingInput = true;
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: val || "", disabled: true })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.loadingInput = false;
            this.typeListData = res.data;
            this.typeListData = this.formatData(this.typeListData);
            // this.tableDataHeader.forEach(item=>{
            //   if(item.paramValue=='serviceNumber'){
            //     item.selectOptions = this.typeListData
            //   }
            // })
            if(this.$route.params.isSaveQuery&&this.queryParams.companyIds){
              this.getCustomerWorkshopList(this.queryParams.companyIds)
            }else{
              this.handleSearchTableData()
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
};
