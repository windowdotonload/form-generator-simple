<template>
  <div>
    <el-dialog :visible.sync="visible" title="新建客户" width="30%" :before-close="handleClose">
      <el-form :model="formData" ref="arrCustomerForm" :rules="rules" label-width="80px">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="2">潜在客户</el-radio>
            <el-radio label="3">现有客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-select
            size="small"
            v-model="formData.companyName"
            :filter-method="handleGetCompanyNameData"
            @change="handleChangeCompany"
            filterable
            :loading="loading"
            style="width:80%;"
            placeholder="请输入4字以上查询公司"
          >
            <el-option v-for="(item, index) in companyNameList" :key="index" :label="item.companyName" :value="item.taxNumber"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在行业" prop="companyIndustryCode">
          <el-cascader
            v-model="formData.companyIndustryCode"
            :options="IndustryList"
            :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
            @change="handleCompanyIndustryChange"
            style="width:80%;"
            size="small"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-cascader
            size="small"
            placeholder="--请选择--"
            v-model="formData.city"
            :options="areaList"
            :props="{ multiple: false, value: 'code', label: 'name' }"
            clearable
            filterable
            @change="handleChangArea"
            style="width:80%;"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <p style="text-align: right;">
        <el-button type="danger" plain size="small" @click.prevent="handleClose">取消</el-button>
        <el-button type="danger" size="small" @click.prevent="handlerSave">确定</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      formData: {
        status: "2",
        companyName: "",
        companyIndustryCode: [],
        regionCityCodeList: [],
        city: []
      },
      companyNameList: [],
      IndustryList: [],
      areaList: [],
      rules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        companyName: [{ required: true, message: "请输入公司名称", trigger: "change" }],
        companyIndustryCode: [{ required: true, message: "请选择所在行业", trigger: "change" }],
        city: [{ required: true, message: "请选择区域", trigger: "change" }]
      },
      loading: false
    };
  },
  created() {
    this.getAllProvinceAndCityList();
    this.getIndustryList();
  },
  methods: {
    handleClose() {
      this.$refs.arrCustomerForm.resetFields();
      this.$parent.handleAddnewCustomerDrawerClose();
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
            if (res.code === 1000) {
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
          .catch(res => {
            this.loading = false;
          });
      }
    },
    // 获取公司名称和税号
    handleChangeCompany(val) {
      let obj = {};
      obj = this.companyNameList.find(item => {
        return item.taxNumber === val; // 筛选出匹配数据
      });
      this.formData.companyName = obj.companyName;
      this.formData.taxNumber = obj.taxNumber;
    },
    // 获取所在行业下拉框数据
    getIndustryList() {
      let params = {
        parentCode: "company_industry"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code === 1000) {
            this.IndustryList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 所在行业下拉框 change事件
    handleCompanyIndustryChange(val) {
      console.log(val);
    },
    // 获取省市数据
    getAllProvinceAndCityList() {
      this.requestMethodGet("/weChat/common/getAreaListByBusinessArea", { businessAreaCode: "" }).then(res => {
        if (res.data.code === 1000) {
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
    // 区域 change事件
    handleChangArea(val) {
      // let newList = []
      // for (let i in val) {
      //   newList.push(val[i][1])
      // }
      // this.formData.regionCityCodeList = newList
      this.formData.regionProvince = val[0];
      this.formData.regionCityCodeList = val[1];
    },
    // 确定
    handlerSave() {
      this.$refs.arrCustomerForm.validate(valid => {
        if (valid) {
          // let params = new FormData()
          // params.append('companyType', '2')
          // params.append('taxNumber', this.formData.taxNumber)
          // params.append('companyName', this.formData.companyName)
          // params.append('regionCityCodeList', this.formData.regionCityCodeList)
          // params.append('status', this.formData.status)
          // params.append('companyIndustry', this.formData.companyIndustryCode[1])
          let params = {
            companyType: "2",
            taxNumber: this.formData.taxNumber,
            companyName: this.formData.companyName,
            regionCityCodeList: [this.formData.regionCityCodeList],
            status: this.formData.status,
            regionProvince: this.formData.regionProvince,
            companyIndustry: this.formData.companyIndustryCode[1]
          };
          this.requestMethodPost("/web/customer/addCompany", params)
            .then(res => {
              if (res.data.code === 1000) {
                this.$message.success("创建成功！");
                this.$refs.arrCustomerForm.resetFields();
                this.$parent.handleAddnewCustomerDrawerClose();
                this.$router.push({
                  path: `/CustomerProfile/CustomerProfileDetail`,
                  query: {
                    companyId: res.data.data.accountId,
                    companyNumber: res.data.data.accountNumber
                  }
                });
                this.$gio.clickViewButtonInCustomerList();
              } else {
                this.$message.warning(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>
