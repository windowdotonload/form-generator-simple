<template>
  <div>
    <el-dialog
      width="30%"
      :title="workshopType == 'editNo' || workshopType == 'edit' ? '编辑车间' : '新建车间'"
      :visible.sync="createWorkshopDialog"
      :close-on-click-modal="false"
      :before-close="cancelAddOil"
    >
      <el-form :model="addWorkshopForm" :rules="addOilRules" ref="addOilRef" class="demo-ruleForm" label-width="100px" label-position="left">
        <el-form-item class="filterConditionType" prop="workshopName" label="车间名称">
          <el-input v-model="addWorkshopForm.workshopName" style="width: 60%" size="small" placeholder="请输入" clearable maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddOil('addOilRef')" size="small">取 消</el-button>
        <el-button type="danger" @click="completeAddOil('addOilRef')" size="small">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    createWorkshopDialog: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    workshopType: {
      type: String,
      default: ""
    },
    customerCompanyType: {
      type: String,
      default: ""
    },
    companyId: {
      type: String,
      default: ""
    },
    addWorkshopForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectOilTypeObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    oilBrandList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      chargeList: [], // 车间管理员数据
      serviceList: [], // 服务商数据
      userInfo: {},
      isNo: null,
      // 手动添加油品弹框
      addWorkshopForm: {
        workshopId: "", // 如果是编辑，保存需要的车间id
        workshopPrincipalPostId: "", // 编辑保存需要的    车间管理员的岗位id
        workshopName: "",
        workshopPrincipal: [],
        distributorId: "",
        distributorName: ""
      },

      addOilRules: {
        workshopName: [{ required: true, message: "请输入车间名称", trigger: "blur" }],
        distributorId: [{ required: true, message: "请选择经销商", trigger: "change" }]
      }
    };
  },
  created() {},
  mounted() {},
  watch: {
    createWorkshopDialog: function(val, oldVal) {
      if (val) {
        console.log(val);
        this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")));
        // this.getChargeUserList(); // 获取车间管理员数据
        // if (this.userInfo.userType != "2") {
        //   this.getServiceList(); // 获取服务商数据
        // } else {
        //   this.getServiceListCustomer(); // 获取服务商数据
        // }

        if (this.workshopType != "add") {
          this.queryWorkShopDetail();
        }
        this.$nextTick(() => {
          this.$refs["addOilRef"].clearValidate();
        });
        if (this.userInfo.userType == "1") {
          this.addWorkshopForm.distributorId = this.userInfo.companyId;
          this.$set(this.addWorkshopForm, "distributorName", this.userInfo.orgInfo.companyName);
        }
      }
    }
  },
  methods: {
    // 编辑的话，获取车间详情
    queryWorkShopDetail() {
      const params = {
        workshopId: Number(this.addWorkshopForm.workshopId)
      };
      this.addWorkshopForm = {};
      this.requestMethodGet("/web/system/permission/orgWorkShopManage/workShopDetail", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.workshopPrincipalUsers || [];
          let id = [];
          if (data && data.length) {
            data.forEach(it => {
              id.push(it.userId);
            });
          }
          console.log(id);
          this.isNo = res.data.data.isNo;
          this.addWorkshopForm = res.data.data;
          this.$set(this.addWorkshopForm, "workshopPrincipal", id);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 获取车间管理员列表
    getChargeUserList() {
      const params = {
        companyId: this.companyId,
        current: 1,
        size: 500
      };
      this.requestMethodGet("/web/system/permission/orgSysUserManagae/userOfWorkShopPostsByPage", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          console.log(data);
          this.chargeList = data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //  获取服务商列表
    getServiceList() {
      const companyType = this.userInfo.userType;
      console.log(this.userInfo, this.customerCompanyType);
      const params = {
        size: 500,
        current: 1
      };
      if (companyType == 1) {
        // 经销商角色
        if (this.customerCompanyType == 0) {
          // 直供客户
          params.companyType = 3;
        } else {
          // 经销商客户
          params.companyId = this.companyId;
        }
      }
      if (companyType == 0) {
        params.companyId = this.companyId;
        // 美孚角色
        if (this.customerCompanyType == 0) {
          // 直供客户
          params.companyType = 3;
        } else {
          // 经销商客户
          params.companyType = 1;
        }
      }
      this.requestMethodGet("/web/company/getCompanyByTypeByPage", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          console.log(data);
          this.serviceList = data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 登录人是客户，获取服务商列表
    getServiceListCustomer() {
      const params = {
        size: 500,
        current: 1,
        companyId: this.userInfo.companyId
      };
      if (this.userInfo.distributorCompanyType == 0) {
        params.companyType = 3;
      }
      this.requestMethodGet("/web/system/permission/orgWorkShopManage/getWorkshopDistriburorByPage", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.serviceList = data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 提交
    completeAddOil(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.addWorkshopForm);
          this.$emit("addOrEditWorkshop", this.addWorkshopForm);
        }
      });
    },
    // 取消
    cancelAddOil() {
      Object.assign(this.$data.addWorkshopForm, this.$options.data().addWorkshopForm);
      this.$emit("closeDialogAdd");
      // this.$nextTick(()=>{
      //   this.$refs["addOilRef"].resetFields();
      // })
    }
  },
  computed: {}
};
</script>
<style lang="sss" scoped></style>
