<!--
* @author vvx
* @date 2020/04/14 16:57:26
* @version V1.0.0
!-->
<template>
  <div class="add-customer-profile">
    <el-form :rules="rules" ref="customerRuleForm" label-width="200px" label-position="top" :model="ruleForm">
      <div class="detail-content">
        <!-- 基础信息 -->
        <div class="info detail-base-info">
          <div class="info-title">
            <div class="line"></div>
            <div class="title">基础信息</div>
          </div>
          <div class="detail-form">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="客户公司有无税号" prop="hasTaxNum">
                  <el-radio-group v-model="ruleForm.hasTaxNum" @change="handlerHasTaxNumChange">
                    <el-radio :label="0">无税号</el-radio>
                    <el-radio :label="1">有税号</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="客户名称" prop="companyName">
                  <el-select
                    v-if="ruleForm.taxNumber"
                    size="small"
                    style="width: 80%"
                    v-model="ruleForm.companyName"
                    :remote-method="handleGetCompanyNameData"
                    @change="handleChangeCompany"
                    filterable
                    clearable
                    remote
                    :loading="loading"
                    placeholder="请输入4字以上查询公司"
                  >
                    <el-option v-for="(item, index) in companyNameList" :key="index" :label="item.companyName" :value="item.companyName"></el-option>
                  </el-select>
                  <el-input v-else v-model="ruleForm.companyName" @change="handlerComInpChange" maxlength="20" placeholder="请输入" size="small" style="width: 80%" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="税号">
                  <span style="width: 80%">{{ ruleForm.taxNumber || "- -" }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="城市" prop="city">
                  <el-cascader
                    size="small"
                    placeholder="--请选择--"
                    v-model="ruleForm.city"
                    :options="areaList"
                    :props="{ value: 'code', label: 'name' }"
                    clearable
                    @change="handleChangArea"
                    style="width: 80%"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="行业" prop="companyIndustry">
                  <el-cascader
                    size="small"
                    v-model="ruleForm.companyIndustry"
                    :options="industryList"
                    :props="typeProps"
                    :show-all-levels="false"
                    @change="handleChangeIndustry"
                    clearable
                    style="width: 80%"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 变更原因 -->
            <el-row :gutter="20">
              <el-col :span="24" v-if="show">
                <el-form-item label="更换原因" prop="remarks">
                  <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 3 }" v-model="ruleForm.remarks" placeholder="请输入" style="width: 600px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="height: 20px"></div>
        <!-- 其他信息 -->
        <div class="info detail-other-info">
          <div class="info-title">
            <div class="line"></div>
            <div class="title">其他</div>
          </div>
          <div class="detail-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="联系电话" prop="telephone">
                  <el-input size="small" placeholder="请输入手机号" clearable v-model="ruleForm.telephone" maxlength="18" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规模">
                  <el-select size="small" v-model="ruleForm.custScale" placeholder="请选择" clearable style="width: 80%">
                    <el-option v-for="item in scaleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="存量（BBL）" prop="stockSum">
                  <el-input size="small" placeholder="请输入" clearable v-model="ruleForm.stockSum" maxlength="7" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年用量（BBL）" prop="yearSum">
                  <el-input size="small" placeholder="请输入" clearable v-model="ruleForm.yearSum" maxlength="7" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="办公地址">
                  <el-input size="small" placeholder="请输入" maxlength="100" v-model="ruleForm.address" clearable style="width: 90%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="上传LOGO">
                  <el-upload
                    :class="{ hide: hideUpload || imageList.length > 0 }"
                    :action="uploadUrl"
                    list-type="picture-card"
                    limit="1"
                    :file-list="imageList"
                    accept="image/*"
                    :auto-upload="false"
                    :on-change="handleAddFile"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <div style="font-size: 12px; color: #999">建议使用200*200px的正方形图片，支持.png.jpg.svn.gif图片格式</div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="height: 20px"></div>
        <div class="info detail-base-info" v-if="roleType == 0 && selfCompanyNumber != $route.query.customerCompanyNumber">
          <div class="info-title">
            <div class="line"></div>
            <div class="title">车间</div>
          </div>
          <div class="detail-form" style="margin: 20px 20px; position: relative; padding-bottom: 30px">
            <el-table :data="workShopData" tooltip-effect="dark" :header-cell-style="{ background: '#f7f7f7' }" stripe>
              <el-table-column prop="workshopName" label="车间名称" min-width="15%" show-overflow-tooltip />
              <el-table-column prop="userCount" label="成员数" min-width="15%" show-overflow-tooltip v-if="roleType != 0" />
              <el-table-column prop="deviceCount" label="设备数" min-width="15%" show-overflow-tooltip />
              <el-table-column prop="workOrderCount" label="工单数" min-width="15%" show-overflow-tooltip />
              <el-table-column prop="createTime" label="创建日期" min-width="15%" show-overflow-tooltip />
              <el-table-column prop="distributorName" label="车间所属经销商" min-width="15%" show-overflow-tooltip />
              <el-table-column align="center" label="操作" min-width="15%" show-overflow-tooltip v-if="roleType == 0 && selfCompanyNumber != $route.query.customerCompanyNumber">
                <template #default="slotScope">
                  <p style="color: #027db4; cursor: pointer" @click="openWorkShopDialog(slotScope.row)">编辑所属经销商</p>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="handleSizeChangeWorkShop"
              @current-change="handleCurrentChangeWorkShop"
              :current-page="workShopPagenation.current"
              :page-size="workShopPagenation.size"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="workShopDataTotal"
              style="position: absolute; bottom: -5px; right: 20px"
            />
          </div>
        </div>
        <!-- 底部按钮 -->
        <div slot="footer" style="margin: 30px 0">
          <el-button type="danger" plain @click="handleResetFrom('customerRuleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmitForm('customerRuleForm')" size="small">保存</el-button>
        </div>
      </div>
    </el-form>
    <el-dialog title="选择分管经销商" :visible.sync="workShopDialog" width="50%" :before-close="handleCloseWorkShopDialog">
      <div class="workshop_dialog_inner">
        <el-input style="width: 30%" size="small" placeholder="请输入名称" clearable v-model="searchDistributor" @clear="clearDist">
          <el-button slot="append" icon="el-icon-search" @click="searchDist"></el-button>
        </el-input>
        <div class="workshop_dialog_table" style="margin-top: 10px">
          <el-table v-loading="distLoading" @selection-change="changeSelDist" ref="distributorTable" :data="distributorData" tooltip-effect="dark" :header-cell-style="{ background: '#f7f7f7' }">
            <el-table-column type="selection" />
            <el-table-column prop="companyName" label="经销商名称" min-width="15%" show-overflow-tooltip />
            <el-table-column prop="taxNumber" label="税号" min-width="15%" show-overflow-tooltip />
          </el-table>
        </div>
        <el-pagination
          background
          @size-change="handleSizeChangedistributor"
          @current-change="handleCurrentChangedistributor"
          :current-page="distributorpagenation.current"
          :page-size="distributorpagenation.size"
          :page-sizes="[10, 20, 30, 50]"
          :total="distributorTotal"
          layout="total, sizes, prev, pager, next, jumper"
          style="position: static; bottom: -5px; right: 20px; text-align: right; margin-top: 10px"
        />
        <div style="display: flex; justify-content: flex-end; margin-top: 20px; margin-bottom: -10px">
          <el-button size="mini" type="danger" plain @click="cancelSelDist">取消</el-button>
          <el-button size="mini" type="danger" @click="confirmSelDist">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      let regPhone = /^((\+?86)|(\(\+86\)))?(1[3456789][0123456789][0-9]{8}|1349[0-9]{7})$/;
      var reg02 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      if (!value || regPhone.test(value) || reg02.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号码或座机号码"));
      }
    };
    var validateReason = (rule, value, callback) => {
      if (value && value.length > 200) {
        callback(new Error("原因最多可输入200个字符"));
      } else {
        callback();
      }
    };
    var validateCity = (rule, value, callback) => {
      if (!this.ruleForm.city || this.ruleForm.city.length == 0) {
        callback(new Error("请选择城市"));
      } else {
        callback();
      }
    };
    return {
      searchDistributor: "",
      roleType: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType,
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      imageList: [], // 图片
      uploadUrl: "", //
      areaList: [], // 区域数据源
      typeProps: {
        value: "code",
        label: "name"
      },
      show: false,
      // 表单验证
      ruleForm: {
        hasTaxNum: null,
        companyName: "",
        taxNumber: "",
        custScale: "",
        companyIndustry: [],
        industry: "",
        customerCompanyNumber: "",
        companyNameShort: "",
        city: [],
        address: "",
        telephone: "",
        status: "",
        file: "",
        createTimeStr: "",
        picDeleteFlag: "",
        yearSum: "",
        stockSum: ""
      },
      accountInfo: {},
      regionCityCodeList: [], // 选中的区域列表
      //   表单验证规则
      rules: {
        remarks: [{ required: true, message: "请输入更换经销商原因", trigger: "change" }, { validator: validateReason, trigger: "change" }],
        hasTaxNum: [{ required: true, message: "请选择客户公司有无税号", trigger: "change" }],
        companyName: [{ required: true, message: "请选择公司名称", trigger: "change" }],
        companyIndustry: [{ required: true, message: "请选择行业", trigger: "change" }],
        customerCompanyNumber: [{ required: true, message: "请选择所属经销商", trigger: "change" }],
        city: [{ required: true, validator: validateCity, trigger: "change" }],
        telephone: [{ validator: validatePhone, trigger: "blur" }],
        stockSum: [{ pattern: /^[1-9]\d*$/, message: "请输入大于等于1的整数", trigger: "blur" }],
        yearSum: [{ pattern: /^[1-9]\d*$/, message: "请输入大于等于1的整数", trigger: "blur" }]
      },
      scaleList: [], // 规模
      regionProvinceCode: "", // 省code
      statusList: [{ value: "1", label: "正常" }, { value: "0", label: "禁用" }], // 状态列表
      industryList: [], // 行业
      dealerList: [], // 经销商
      companyNameList: [], // 公司列表
      hideUpload: false, // 是否隐藏添加图片按钮
      primaryCustomerNumber: "", // 所属经销商原number
      loading: false,
      workShopPagenation: {
        current: 1,
        size: 10
      },
      workShopDataTotal: 0,
      workShopData: [],
      workShopDialog: false,
      distributorData: [],
      distributorTotal: 0,
      distributorpagenation: {
        current: 1,
        size: 10
      },
      distLoading: false,
      selDistRes: null,
      currentWorkShopId: "",
      currentDistId: "",
      selfCompanyNumber: "",
      tempTaxNumber: "", // 税号缓存
      tempCompanyNameHas: "", // 公司名称缓存
      tempCompanyNameNon: "" // 公司名称缓存
    };
  },
  created() {
    this.selfCompanyNumber = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber;
    this.getAllProvinceAndCityList(); // 获取省市数据
    this.$_queryDealerInfo(this.$route.query.companyNumber); // 查询经销商信息
    this.$_getDealerData(); // 所属经销商列表
    this.$_getIndustryData(); // 行业列表
    this.scaleList = JSON.parse(this.$route.query.scaleList); // 模块列表
    this.selfCompanyNumber = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber;
  },
  mounted() {
    this.getBindingAccountId();
    this.getWorkShopData();
  },
  methods: {
    // 有无税号切换
    handlerHasTaxNumChange(val) {
      if (val === 1) {
        this.ruleForm.taxNumber = this.tempTaxNumber ? this.tempTaxNumber : "请选择客户名称以查询税号";
        this.ruleForm.companyName = this.tempCompanyNameHas;
      } else {
        this.ruleForm.taxNumber = "";
        this.ruleForm.companyName = this.tempCompanyNameNon;
      }
    },
    // 客户名称输入框改变
    handlerComInpChange(val) {
      this.tempCompanyNameNon = val;
    },
    searchDist() {
      this.distributorpagenation.current = 1;
      this.getDistributorData();
    },
    clearDist() {
      this.distributorpagenation.current = 1;
      this.getDistributorData();
    },
    changeSelDist(selection) {
      if (selection.length > 1) {
        this.$refs.distributorTable.toggleRowSelection(selection[0], false);
      }
      this.selDistRes = selection[selection.length - 1];
    },
    cancelSelDist() {
      this.workShopDialog = false;
    },
    confirmSelDist() {
      this.requestMethodPost("/weChat/workshop/updateWorkshopDistributor", {
        companyId: this.selDistRes.id,
        workshopId: this.currentWorkShopId
      }).then(res => {
        if (res.data.code == 1000) {
          this.workShopPagenation = {
            current: 1,
            size: 10
          };
          this.getWorkShopData();
          this.$message({
            type: "success",
            message: "更新分管经销商成功"
          });
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg
          });
        }
        this.workShopDialog = false;
      });
    },
    getDistributorData() {
      this.distLoading = true;
      this.requestMethodGet("/web/company/getCompanyByTypeByPage", {
        companyName: this.searchDistributor,
        ...this.distributorpagenation,
        companyType: 1
      }).then(res => {
        if (res.data.code == 1000) {
          this.distributorData = res.data.data.list;
          this.distributorTotal = res.data.data.totalCount;
          setTimeout(() => {
            const Index = this.distributorData.findIndex(item => item.id == this.currentDistId);
            this.$refs.distributorTable.toggleRowSelection(this.distributorData[Index], true);
          }, 100);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.distLoading = false;
      });
    },
    handleSizeChangedistributor(size) {
      this.distributorpagenation.size = size;
      this.distributorpagenation.current = 1;
      this.getDistributorData();
    },
    handleCurrentChangedistributor(current) {
      this.distributorpagenation.current = current;
      this.getDistributorData();
    },
    openWorkShopDialog(item) {
      this.workShopDialog = true;
      const prevWorkShopId = this.currentWorkShopId;
      this.currentWorkShopId = item.workshopId;
      this.currentDistId = item.distributorId;
      if (this.distributorData.length == 0 || prevWorkShopId != this.currentWorkShopId) {
        this.distributorpagenation.current = 1;
        this.distributorpagenation.size = 10;
        this.getDistributorData();
      }
    },
    handleCloseWorkShopDialog() {
      this.workShopDialog = false;
      this.currentDistId = "";
    },
    handleSizeChangeWorkShop(size) {
      this.workShopPagenation.size = size;
      this.workShopPagenation.current = 1;
      this.getWorkShopData();
    },
    handleCurrentChangeWorkShop(current) {
      this.workShopPagenation.current = current;
      this.getWorkShopData();
    },
    getWorkShopData() {
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", {
        companyId: this.$route.query.companyId,
        ...this.workShopPagenation
      }).then(res => {
        if (res.data.code == 1000) {
          this.workShopData = res.data.data.list;
          this.workShopDataTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    getAllProvinceAndCityList() {
      this.requestMethodGet("/weChat/common/getAreaListByBusinessArea", { businessAreaCode: "" }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.areaList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 查询公司信息接
    handleGetCompanyNameData(val) {
      if (!this.ruleForm.taxNumber) {
        return;
      }
      let params = {
        pageSize: 1000,
        pageNum: 1,
        keyWord: val
      };
      this.loading = true;
      if (val.length < 4) {
        this.loading = false;
        this.companyNameList = [];
      } else {
        this.requestMethodGet("/web/common/getBusinessInfo", params)
          .then(res => {
            res = res.data;
            this.loading = false;
            if (res.code == 1000) {
              if (res.data.list && res.data.list.length > 0) {
                this.companyNameList = res.data.list;
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
    // 获取公司名称和税号
    handleChangeCompany(val) {
      if (val) {
        let obj = {};
        obj = this.companyNameList.find(item => {
          return item.companyName === val; // 筛选出匹配数据
        });
        this.ruleForm.taxNumber = obj.taxNumber;
        this.tempTaxNumber = obj.taxNumber;
        this.tempCompanyNameHas = obj.companyName;
      }
    },
    // 查询工业客户信息
    $_queryDealerInfo(companyNumber) {
      let params = {
        companyNumber
      };
      this.requestMethodGet("/web/customer/queryCompanyByCompanyNumber", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data.logo) {
              this.imageList.push({ url: res.data.logo });
            }
            this.ruleForm = { ...res.data };
            this.ruleForm.hasTaxNum = res.data.taxNumber ? 1 : 0;
            this.tempTaxNumber = res.data.taxNumber;
            if (res.data.taxNumber) {
              this.tempCompanyNameHas = res.data.companyName;
            } else {
              this.tempCompanyNameNon = res.data.companyName;
            }

            this.primaryCustomerNumber = res.data.customerCompanyNumber;
            if (this.ruleForm.taxNumber) {
              this.handleGetCompanyNameData(res.data.companyName);
            }
            if (this.ruleForm.custScale == null) {
              this.ruleForm.custScale = "";
            }
            if (this.ruleForm.companyNameShort == null) {
              this.ruleForm.companyNameShort = "";
            }
            if (this.ruleForm.address == null) {
              this.ruleForm.address = "";
            }
            if (this.ruleForm.telephone == null) {
              this.ruleForm.telephone = "";
            }
            if (this.ruleForm.status == null) {
              this.ruleForm.status = "";
            }
            if (res.data.companyIndustry) {
              this.$_getIndustryCode(res.data.companyIndustry);
            }
            if (this.ruleForm.regionCityList.length > 0) {
              this.ruleForm.city = this.ruleForm.regionCityList;
            }
            this.regionCityCodeList = this.ruleForm.regionCityList[1];
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取行业列表
    $_getIndustryData() {
      let params = {
        parentCode: "company_industry"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.industryList = res.data;
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
    // 回显行业
    $_getIndustryCode(param) {
      let params = {
        childCode: param
      };
      this.requestMethodGet("/web/customer/getSysDicIndustry", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.ruleForm.companyIndustry = res.data; // 回显数据

            this.ruleForm.industry = res.data[1]; // 获取传输数据
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    //  添加文件
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
      let fileName = file.name;
      this.ruleForm.picDeleteFlag = 0;
      this.hideUpload = fileList.length >= 1;
      this.imageList.push({ url: file.url });
      this.ruleForm.file = file.raw;
    },

    // 删除图片
    handleRemove(fileList) {
      this.ruleForm.file = "";
      this.ruleForm.picDeleteFlag = 1;
      this.imageList = [];
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1;
      }, 500);
    },
    // 区域 change事件
    handleChangArea(val) {
      if (val) {
        this.regionProvinceCode = val[0];
        this.regionCityCodeList = val[1];
      }
    },
    // 行业 改变 chang 事件
    handleChangeIndustry(val) {
      this.ruleForm.industry = val[1];
    },
    changeCustomerCompany(val) {
      if (val != this.primaryCustomerNumber) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    // 提交
    handleSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认提交修改工业客户?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = new FormData();
              params.append("companyType", 2);
              params.append("companyName", this.ruleForm.companyName);
              params.append("companyNumber", this.ruleForm.companyNumber);
              params.append("taxNumber", this.ruleForm.taxNumber);
              params.append("companyNameShort", this.ruleForm.companyNameShort || "");
              params.append("customerCompanyNumber", this.ruleForm.customerCompanyNumber);
              if (this.ruleForm.remarks != undefined) {
                params.append("changeReason", this.ruleForm.remarks);
              }
              params.append("regionProvince", this.regionProvinceCode);
              params.append("regionCityCodeList", this.regionCityCodeList);
              params.append("address", this.ruleForm.address || "");
              params.append("custScale", this.ruleForm.custScale || "");
              params.append("stockSum", this.ruleForm.stockSum || "");
              params.append("yearSum", this.ruleForm.yearSum || "");
              params.append("companyIndustry", this.ruleForm.industry);
              params.append("telephone", this.ruleForm.telephone);
              params.append("status", this.ruleForm.status);
              params.append("file", this.ruleForm.file);
              params.append("picDeleteFlag", this.ruleForm.picDeleteFlag);
              params.append("hasTaxNum", this.ruleForm.hasTaxNum);
              this.requestMethodPost("/web/customer/updateCompany", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    if (this.$route.query.isSaveQuery) {
                      this.$router.push({
                        name: "CustomerProfile",
                        params: { isSaveQuery: true }
                      });
                    } else {
                      history.back();
                    }
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
    // 返回
    handleResetFrom(formName) {
      this.$refs[formName].resetFields();
      if (this.$route.query.isSaveQuery) {
        this.$router.push({
          name: "CustomerProfile",
          params: { isSaveQuery: true }
        });
      } else {
        history.back();
      }
    },
    // 获取所属经销商列表
    $_getDealerData() {
      this.requestMethodPostTip("/web/company/filterSp", {
        menuCode: "DealerProfile"
      })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.dealerList = res.data;
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
    unbundling() {
      this.$confirm("小程序用户使用商品模块的必要条件之一，若为空，公司成员商品模块不开放", "提示信息", {
        confirmButtonText: "确认解绑",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let params = {
            id: this.accountInfo.id,
            companyNumber: this.$route.query.companyNumber
          };
          this.requestMethodPost("/msla/account/unBindingAccount", params)
            .then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  message: "解绑成功",
                  type: "success"
                });
                this.accountInfo = {};
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    },
    handleUpdate() {
      if (!this.accountInfo.legacyId) {
        this.$message({
          message: "请先输入MSLA  Account",
          type: "warning"
        });
        return;
      }
      let params = {
        legacyId: this.accountInfo.legacyId,
        companyNumber: this.$route.query.companyNumber
      };
      let url = "/msla/account/bindingAccount";
      this.requestMethodPost(url, params)
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: "同步成功",
              type: "success"
            });
            this.getBindingAccountId();
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getBindingAccountId() {
      let params = {
        companyNumber: this.$route.query.companyNumber
      };
      this.requestMethodGet("/msla/account/getAccount", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.accountInfo = res.data.data || {};
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    }
  }
};
</script>
<style lang="less" scoped>
.add-customer-profile {
  padding: 20px;
  height: calc(100% - 60px);
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
    span {
      color: #999999;
      font-size: 14px;
      font-weight: normal;
    }
  }
}
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.info {
  width: 960px;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}
.info-title {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e9e9e9;
}
.title {
  margin-left: 10px;
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  color: #000;
}
.line {
  width: 4px;
  height: 14px;
  background: #dd0000;
  margin-left: 20px;
}
.detail-form {
  margin-top: 20px;
  margin-left: 80px;
}
</style>
<style>
.add-customer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-customer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.add-customer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.add-customer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.add-customer-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.hide .el-upload--picture-card {
  display: none;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
  top: 15px !important;
}
</style>
