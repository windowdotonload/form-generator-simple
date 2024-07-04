<!--
* @description  新建工业客户档案
* @fileName AddCustomerProfile.vue
* @author vvx
* @date 2020/04/14 16:57:26
* @version V1.0.0
!-->
<template>
  <div style="position:relative">
    <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer">
      <el-button type="danger" plain size="small" @click="handleResetFrom('ruleForm')"
        ><img src="../../assets/back.png" style="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px" />返回</el-button
      >
    </div>
    <div class="add-customer-profile" :style="mainminheight">
      <p class="add-customer-profile-title">
        公司LOGO
        <span>建议公司LOGO宽高上传比例为：200*200</span>
      </p>
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
      <p class="add-customer-profile-title">基本信息</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" label-position="top" class="add-dealer-profile-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="名称" prop="taxNumber">
              <el-select
                size="small"
                style="width:80%;"
                v-model="ruleForm.taxNumber"
                :filter-method="handleGetCompanyNameData"
                @change="handleChangeCompany"
                filterable
                :loading="loading"
                placeholder="请输入4字以上查询公司"
              >
                <el-option v-for="(item, index) in companyNameList" :key="index" :label="item.companyName" :value="item.taxNumber ? item.taxNumber : false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="税号" prop="taxNumber">
              <span style="width:80%;">{{ ruleForm.taxNumber || "- -" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规模">
              <el-select size="small" v-model="ruleForm.custScale" clearable placeholder="请选择" style="width:80%;">
                <el-option v-for="item in scaleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="行业" prop="companyIndustry">
              <el-cascader
                size="small"
                v-model="ruleForm.companyIndustry"
                :options="industryList"
                :show-all-levels="false"
                :props="industruProps"
                @change="handleChangIndustry"
                clearable
                style="width:80%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属经销商" prop="customerCompanyNumber">
              <el-select size="small" v-model="ruleForm.customerCompanyNumber" clearable placeholder="请选择" style="width:80%;">
                <el-option v-for="item in dealerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区域" prop="city">
              <el-cascader
                size="small"
                v-model="ruleForm.city"
                :options="areaList"
                :props="{ value: 'code', label: 'name' }"
                clearable
                filterable
                @change="handleChangArea"
                style="width:80%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="办公地址">
              <el-input size="small" placeholder="请输入" maxlength="100" v-model="ruleForm.address" clearable style="width:90%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="联系电话" prop="telephone">
              <el-input size="small" placeholder="请输入手机号" clearable v-model="ruleForm.telephone" maxlength="18" style="width:80%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select size="small" v-model="ruleForm.status" disabled clearable placeholder="请选择" style="width:80%;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建日期">
              <span>{{ ruleForm.nowDate }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="margin:30px 0">
        <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from "element-china-area-data"; // 引入省市级别联动
import { baseRemoteOauth2 } from "@/api/api";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      // var regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
      let regPhone = /^((\+?86)|(\(\+86\)))?(1[3456789][0123456789][0-9]{8}|1349[0-9]{7})$/;
      var reg02 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      if (!value || regPhone.test(value) || reg02.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号码或座机号码"));
      }
    };
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      uploadUrl: "",
      imageList: [], // 图片
      areaList: [], // 区域数据源
      companyNameList: [], // 公司列表
      // 表单验证
      ruleForm: {
        file: "", // 图片
        companyType: "2", // 公司类型，1：经销商 2，工业客户
        companyName: "",
        companyNameShort: "",
        taxNumber: "",
        custScale: "",
        city: "",
        regionCityCodeList: "",
        address: "",
        telephone: "",
        companyIndustry: "",
        customerCompanyNumber: "",
        status: "1",
        nowDate: ""
      },
      regionProvinceCode: "", // 选中的省code
      //   表单验证规则
      rules: {
        taxNumber: [{ required: true, message: "请输入名称", trigger: "blur" }],
        companyIndustry: [{ required: true, message: "请选择行业", trigger: "change" }],
        customerCompanyNumber: [{ required: true, message: "请选择所属经销商", trigger: "change" }],
        city: [{ required: true, message: "请选择市", trigger: "change" }],
        telephone: [{ validator: validatePhone, trigger: "blur" }]
      },
      scaleList: [], // 规模
      statusList: [{ value: "1", label: "正常" }, { value: "0", label: "禁用" }], // 状态列表
      industryList: [], // 行业
      //  行业自定义属性
      industruProps: {
        value: "code",
        label: "name"
      },
      accountInfo: {},
      loading: false,
      dealerList: [], // 经销商
      hideUpload: false // 是否隐藏添加图片按钮
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.ruleForm.nowDate = this.moment(new Date()).format("YYYY-MM-DD");
    if (this.$route.query.scaleList !== undefined) {
      this.scaleList = JSON.parse(this.$route.query.scaleList);
    }
    this.$_getDealerData(); // 所属经销商列表
    this.$_getIndustryData(); // 行业列表
  },
  created() {
    this.getAllProvinceAndCityList(); // 获取省市数据
  },
  methods: {
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
      this.hideUpload = fileList.length >= 1;
      this.imageList.push({ url: file.url });
      this.ruleForm.file = file.raw;
    },
    // 删除图片
    handleRemove(fileList) {
      this.ruleForm.file = "";
      this.imageList = [];
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1;
      }, 500);
    },
    // 区域多选
    handleChangArea(val) {
      this.regionProvinceCode = val[0];
      this.ruleForm.regionCityCodeList = val[1];
    },
    // 行业选择
    handleChangIndustry(val) {
      this.companyIndustry = val[1];
    },

    // 提交
    handleSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确定提交新建工业客户?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              var params = new FormData();
              params.append("companyType", "2");
              params.append("companyName", this.ruleForm.companyName);
              params.append("companyNameShort", this.ruleForm.companyNameShort || "");
              params.append("customerCompanyNumber", this.ruleForm.customerCompanyNumber);
              params.append("taxNumber", this.ruleForm.taxNumber);
              params.append("regionCityCodeList", this.ruleForm.regionCityCodeList);
              params.append("regionProvince", this.regionProvinceCode);
              params.append("address", this.ruleForm.address || "");
              params.append("custScale", this.ruleForm.custScale || "");
              params.append("companyIndustry", this.companyIndustry);
              params.append("file", this.ruleForm.file);
              params.append("telephone", this.ruleForm.telephone);
              params.append("status", 1);
              this.requestMethodPost("/web/customer/addCompany", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "添加成功",
                      type: "success"
                    });
                    this.$router.push({
                      path: "/CustomerProfile"
                    });
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
      this.$router.push({
        path: "/CustomerProfile"
      });
    },
    // 查询公司信息接
    handleGetCompanyNameData(val) {
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
      if (!val) {
        this.ruleForm.taxNumber = "";
        this.$message({
          message: "该公司无税号或已注销，请重新选择公司",
          type: "warning"
        });
        return;
      }
      let obj = {};
      obj = this.companyNameList.find(item => {
        return item.taxNumber === val; // 筛选出匹配数据
      });
      this.ruleForm.companyName = obj.companyName;
      this.ruleForm.taxNumber = val;
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
    // 获取所属经销商列表
    $_getDealerData() {
      this.requestMethodPostTip("/web/company/filterSp", {
        params: 'DealerProfile'
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
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    },
    onKeypress() {
      this.ruleForm.mslaAccount = this.ruleForm.mslaAccount.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, "");
    },
    handleBinding() {
      if (!this.ruleForm.mslaAccount) {
        this.$message({
          message: "请先输入MSLA  Account",
          type: "warning"
        });
        return;
      }
      let params = {
        legacyId: this.ruleForm.mslaAccount,
        companyNumber: this.ruleForm.customerCompanyNumber
      };
      let url = "/msla/account/bindingAccount";
      this.requestMethodPost(url, params)
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: "同步成功",
              type: "warning"
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
        companyNumber: this.ruleForm.customerCompanyNumber
      };
      this.requestMethodGet("/msla/account/getAccount", params)
        .then(res => {
          if (res.data.code == 1000) {
            res.data.data.address = JSON.parse(res.data.data.address);
            this.accountInfo = res.data.data;
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
  height: 100%;
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
</style>
