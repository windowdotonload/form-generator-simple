export default {
  data() {
    return {
      SPList: [],
      loadMoreData: false
    };
  },
  created() {
    if (this.$userInfo.userType == 2 || this.$userInfo.userType == 1) {
      this.getSpList(this.userInfo.orgInfo.companyId);
    }
    if (this.$route.query.openOrderType == "serviceApply") {
      this.getSpList(this.$route.query.companyId);
    }
    if (this.$route.query.enterFrom == "serviceApply" && this.$route.query.spId) {
      this.applylist.spId = Number(this.$route.query.spId);
    }
  },
  methods: {
    // 加载更多
    load() {
      if (this.loadMoreBon && !this.loadingLum && this.lumToTalCount == this.lumDataCustomers.length) {
        this.pagenationLumCustomer.current = ++this.pagenationLumCustomer.current;
        this.$_getCustomerLumData();
      }
    },
    // 取消分配工单
    handleReset() {
      this.executePersonNameVisiable = false;
      this.userOrRoleName = "";
    },
    // 选择执行人
    handleDistributionnChange(val) {
      this.applylist.executePersonName = val.userName;
      this.applylist.executePersonNumber = val.userNumber;
    },
    // 分配提交
    submitDistribution() {
      if (this.applylist.executePersonNumber) {
        this.executePersonNameVisiable = false;
      } else {
        this.$message({
          message: "请选择分配人",
          type: "warning"
        });
      }
    },
    // 添加图片
    handleAddFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.ImageList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.imageList = [];
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      this.applylist.imgFile.push(file.raw);
      this.imageList.push({ url: file.url });
      let params = new FormData();
      params.append("fileType", "work_order_picture");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.imageList.map(item => {
              if (item.url == file.url) {
                item.raw = res.data[0];
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

    // 删除图片
    handleRemove(file, fileList) {
      this.imageList.splice(this.imageList.findIndex(item => item.url === file.url), 1);
      setTimeout(() => {
        this.hideUpload = fileList.length >= 3;
      }, 500);
    },
    // 选择执行人数据加载更多
    loadMore() {
      if (this.loadMoreData && this.personTotal > this.engineerInfoList.length) {
        this.pageIndexDistributive++;
        this.handleDistributive("more");
      }
    },
    // 分配人员的模糊搜索
    searchRoleTableData(val) {
      this.handleDistributive("noset");
    },
    // 分配工单
    handleDistributive(val) {
      if (!this.applylist.companyNumber) {
        return this.$message({
          message: "请选择客户名称",
          type: "warning"
        });
      }
      if (!this.applylist.spId && this.SPList.length > 1) {
        return this.$message({
          message: "请选择经销商",
          type: "warning"
        });
      }
      if (!this.distributiveBtn || this.pesDisabled || this.serviceApplyOrderId) {
        return;
      }
      if (val == "first") {
        this.pageIndexDistributive = 1;
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
        userOrRoleName: this.userOrRoleName,
        userId: this.userInfo.userId
      };
      // 是否已有分配人
      if (this.originalExecuteUserNumber) {
        param.originalExecuteUserNumber = this.originalExecuteUserNumber;
      }
      // 加载动画  开启
      this.loadMoreZhixingren = true;
      param.userBelongType = this.active;
      param.spId = this.applylist.spId;
      if (this.$userInfo.userType == 1) {
        param.spId = this.$userInfo.orgInfo.companyId;
      }
      param.accountId = this.companyId;
      if (!param.spId) {
        this.$message({
          message: "请选择经销商",
          type: "warning"
        });
      }
      if (!param.accountId) {
        this.$message({
          message: "请选择客户",
          type: "warning"
        });
      }
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.engineerInfoList = this.engineerInfoList.concat(res.data.list);
            this.personTotal = res.data.totalCount;
            if (this.personTotal > this.engineerInfoList.length) {
              this.loadMoreData = true;
            } else {
              this.loadMoreData = false;
            }
            // 加载动画 关闭
            this.loadMoreZhixingren = false;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询客户车间下的联系人
    getContactPerson() {
      let params = {
        companyId: this.companyId,
        workshopId: this.applylist.workshopId,
        size: 3000
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopCompanyUserListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.contactPersonList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleChangeContact(val) {
      this.contactPersonList.map(item => {
        if (item.userNumber == val) {
          this.applylist.contactName = item.userName;
          this.applylist.userNumber = item.userNumber;
          this.applylist.contactPhone = item.phonenumber;
        }
      });
    },
    // 查询所属客户
    $_queryCustomerData() {
      if (this.$route.query.enterFrom == "serviceApply") {
        this.customerList = [
          {
            companyNumber: this.$route.query.companyNumber,
            companyName: this.$route.query.companyName,
            companyId: this.$route.query.companyId
          }
        ];
        this.workorderSelectCompanyName = this.$route.query.companyName;
        this.deviceCompanyId = this.$route.query.companyId;
        this.applylist.companyNumber = this.$route.query.companyNumber;
        return;
      }
      let params = {
        current: 1,
        size: 300,
        menuCode: "NewWorkOrderList",
        accountName: this.selectCompanyName
      };
      this.requestMethodPost("/web/customer/filterAccount", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            let arr = [];
            if (data && data.length > 0) {
              if (this.pesServiceItemId) {
                data.forEach(item => {
                  arr.push(item.companyNumber);
                });
              }
            }
            if (this.applylistParams && this.applylistParams.companyNumber) {
              this.workorderSelectCompanyName = this.applylistParams.companyName;
              this.deviceCompanyId = this.applylistParams.companyId;
              let flag = arr.includes(this.applylistParams.companyNumber);
              if (!flag) {
                const obj = {
                  companyNumber: this.applylistParams.companyNumber,
                  companyName: this.applylistParams.companyName,
                  companyId: this.applylistParams.companyId
                };
                data.push(obj);
              }
            }
            this.customerList = data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    async getSpList(val) {
      if (this.$route.query.enterFrom == "serviceApply") return;
      if (this.$userInfo.userType == 1) {
        return (this.applylist.spId = this.$userInfo.orgInfo.companyId);
      }
      this.SPList = [];
      if (!val) return (this.SPList = []);

      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: val
      });
      this.SPList = res.data.data;
      if (this.SPList.length == 1) return (this.applylist.spId = this.SPList[0].spId);
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
    // 查询客户下的车间
    getCustomerWorkshopList() {
      const params = {
        companyId: this.companyId,
        noWorkShopFlag: true,
        size: 1000
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params)
        .then(async res => {
          if (res.data.code == 1000) {
            this.workshopList = res.data.data.list;
            if (this.$route.query.enterFrom == "serviceApply") {
              // type number类型 服务项类型（1：普通，2：油品）
              let res = await this.requestMethodGet("/serviceApply/applyOrderLubRel", { id: this.$route.query.serviceApplyOrderId, type: this.$route.query.isNormal });
              if (res.data.data.info) {
                this.applylist.workshopId = res.data.data.workshopId + "";
                this.confirmChooseLup([res.data.data.info]);
                if (this.$route.query.isNormal == 2) {
                  this.addLumdata = res.data.data.info;
                  this.notice = true;
                  this.companyId = this.$route.query.companyId;
                  this.applylist.lubricationPointNumber = res.data.data.info.lubricationPointNumber;
                  this.applylist.lubricationPointTypeName = res.data.data.info.lubricationPointType + "-" + this.$route.query.selectLubricatePointData[0].lubricationPointName;
                }
              }
            }
            if (this.$route.query.workshopId) {
              let res = await this.requestMethodGet("/serviceApply/applyOrderLubRelForAuto", {
                workshopId: this.$route.query.workshopId,
                lubricationPointNumber: this.$route.query.lubricationPointNumber,
                type: this.$route.query.isNormal
              });
              if (res.data.data.info) {
                this.applylist.workshopId = res.data.data.workshopId + "";
                this.confirmChooseLup([res.data.data.info]);
              }
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 车间名称change事件
    visibleWorkshopChange(val) {
      if (val) {
        this.$refs["applylist"].validateField("companyNumber");
      }
    },
    // 我已知晓，同意条款和条件
    submitAddWorkorder() {
      this.dialogVisibleHint = false;
    },
    //   同意条款
    seenNotice() {
      if (!this.applylist.companyNumber) {
        this.$message({
          message: "请选择客户名称",
          type: "warning"
        });
        return;
      }
      this.getHintCont();
      this.dialogVisibleHint = true;
    },
    // 返回
    handleResetFrom(formName) {
      this.$confirm("确认退出新建工单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs[formName].resetFields();
          // this.$router.push({
          //   path: "/NewWorkOrderList"
          // });
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    }
  }
};
