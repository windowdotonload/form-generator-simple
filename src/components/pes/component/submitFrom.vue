<template>
  <div class="form-container">
    <div class="module-title" v-show="serviceDrawerType == 2">更新字段</div>
    <el-form ref="submitFromValidate" :model="submitForm" :rules="serviceDrawerType == 1 ? submitFormRules : editFormRules" class="search-form" label-position="top">
      <el-form-item label="计划目标" prop="planId" v-if="planAdd">
        <el-input size="small" style="width:100%" v-model="planAdd" disabled></el-input>
      </el-form-item>
      <el-form-item label="计划目标" prop="planId" v-if="!planAdd && serviceDrawerType != 2" :rules="[{ required: true, message: '请选择计划目标', trigger: 'blur' }]">
        <el-select v-model="submitForm.planId" clearable placeholder="请选择" size="small" style="width:100%">
          <el-option v-for="(item, index) in planList" :key="item.id" :label="`计划目标${index + 1}`" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划目标" prop="planId" v-if="!planAdd && serviceDrawerType == 2">
        <el-select v-model="submitForm.planId" clearable placeholder="请选择" size="small" style="width:100%">
          <el-option v-for="(item, index) in planList" :key="item.id" :label="`计划目标${index + 1}`" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务类型" prop="serviceNumber">
        <el-cascader
          ref="serviceTypeCascader"
          clearable
          filterable
          :options="serviceTypeTreeOptions"
          :props="{ value: 'serviceNumber', label: 'serviceName', children: 'children' }"
          :show-all-levels="false"
          v-model="submitForm.serviceNumber"
          size="small"
          style="width:100%"
          @change="handleChange"
        >
          <template #default="slotScope">
            <div @click="clickServiceItem(slotScope)">{{ slotScope.data.serviceName }}</div>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="数量（最大300条）" v-show="serviceDrawerType == 1" prop="num">
        <el-input-number v-model="submitForm.num" :min="1" :max="300" size="small" />
      </el-form-item>
      <el-form-item label="计划开始时间" prop="planStartTime">
        <el-date-picker clearable size="small" v-model="submitForm.planStartTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" style="width:100%"></el-date-picker>
      </el-form-item>
      <el-form-item label="服务负责人" prop="chargeUserId">
        <el-cascader
          filterable
          clearable
          ref="selectChargeUserId"
          size="small"
          placeholder="请选择"
          v-if="$userInfo.userType == 0"
          v-model="submitForm.chargeUserId"
          :options="chargePersonList"
          :props="{ value: 'userId', label: 'userName', children: 'userList' }"
          :show-all-levels="false"
          style="width:100%"
        />
        <el-select v-if="$userInfo.userType == 1" size="small" ref="selectChargeUserId1" v-model="submitForm.chargeUserId" filterable clearable placeholder="请选择" style="width:100%">
          <el-option v-for="item in chargePersonList" :key="item.userId" :label="item.userName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item prop="mobilProjectUsers" v-if="overViewData.serviceCompanyType == '0'">
        <template v-slot:label>
          <div>美孚项目成员</div>
          <!-- <el-alert v-show="serviceDrawerType == 2" :title="editFormSuffix.EmptyWithoutFilling" type="warning" :closable="false" style="width:100%;padding:0;margin-bottom:10px" /> -->
        </template>
        <el-select size="small" ref="selectMobil" filterable clearable multiple v-model="submitForm.mobilProjectUsers" placeholder="请选择" style="width:100%">
          <el-option v-for="user in mobileProjectList" :key="user.userId" :label="user.nameCn" :value="user.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="distributorProjectUsers" v-if="(overViewData.distributorCompanyType == '1' && overViewData.serviceCompanyType == '0') || overViewData.serviceCompanyType == '1'">
        <template v-slot:label>
          <div>经销商项目成员</div>
          <!-- <el-alert v-show="serviceDrawerType == 2" :title="editFormSuffix.EmptyWithoutFilling" type="warning" :closable="false" style="width:100%;padding:0;margin-bottom:10px" /> -->
        </template>
        <el-select size="small" ref="selectDistributorProjectUsers" filterable multiple clearable v-model="submitForm.distributorProjectUsers" placeholder="请选择" style="width:100%">
          <el-option v-for="user in distributorProjectList" :key="user.userId" :label="user.nameCn" :value="user.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="customerProjectUsers">
        <template v-slot:label>
          <div>客户项目成员</div>
        </template>
        <el-select size="small" ref="selectCustomerProjectUsers" multiple clearable v-model="submitForm.customerProjectUsers" placeholder="请选择" style="width:100%">
          <el-option v-for="user in customerUserList" :key="user.userId" :label="user.userName" :value="user.userId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getCreateServiceTypeTreeData,
  authChangegetCustomerProjectUsers,
  getChargeUserList,
  getMobileProjectUsers,
  getDistributorProjectUsers,
  createServiceItemBatch
} from "../api/serviceBatchOperationApi";
export default {
  props: {
    serviceDrawerType: {
      type: Number
    },
    dialog: {
      type: Boolean,
      default: false
    },
    indexPlan: {
      type: Number,
      default: 0
    },
    planAdd: {
      type: String,
      default: ""
    },
    selectedData: {
      type: Array,
      default: null
    },
    planList: {
      type: Array,
      default: null
    },
    overViewData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      edit: true,
      planIndex: "",
      submitForm: {
        planId: "",
        num: 1,
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: "",
        customerProjectUsers: "",
        customerProjectUsersNames: "",
        distributorProjectUsers: "",
        distributorProjectUsersNames: "",
        mobilProjectUsers: "",
        mobilProjectUsersNames: "",
        serviceName: ""
      },
      editFormSuffix: {
        EmptyWithoutFilling: "车间重新选择后，该字段若未重新填写，将会被清空"
      },
      submitFormRules: {
        num: { required: true, message: "请选择数量", trigger: "change" },
        planStartTime: { required: true, message: "请选择计划开始时间", trigger: "change" },
        chargeUserId: { required: true, message: "请选择服务负责人", trigger: "change" },
        serviceNumber: { required: true, message: "请选择服务类型", trigger: "change" },
        customerProjectUsers: { required: false, message: "请选择客户项目成员", trigger: "blur" },
        distributorProjectUsers: { required: false, message: "请选择经销商项目成员", trigger: "blur" },
        mobilProjectUsers: { required: false, message: "请选择美孚项目成员", trigger: "blur" }
      },
      editFormRules: {
        chargeUserId: { required: false, message: "请选择服务负责人", trigger: "change" }
      },
      serviceTypeTreeOptions: [],
      authorityRole: "",
      workShopCompanyNumberMap: {},
      customerUserList: [],
      chargePersonList: [],
      mobileProjectList: [],
      distributorProjectList: [],
      serviceTypes: [{ label: "类型1", value: "1" }, { label: "类型2", value: "2" }, { label: "类型3", value: "3" }],
      serviceOwners: [{ label: "负责人1", value: "1" }, { label: "负责人2", value: "2" }, { label: "负责人3", value: "3" }]
    };
  },
  computed: {
    editFormSuffixLabel() {
      return this.serviceDrawerType == 2 ? this.editFormSuffix.EmptyWithoutFilling : "";
    }
  },
  created() {
    this.initSubmitForm();
  },
  inject: ["DRAWERVM"],
  watch: {
    "submitForm.workshopId": {
      handler(val) {
        this.setFormFieldRequired(val);
        this.changeWorkshopEvent(val);
      }
    },
    "submitForm.serviceNumber"(val) {
      if (!val || val.length == 0) return (this.submitForm.serviceName = "");
      const serviceName = this.$refs.serviceTypeCascader.getCheckedNodes(true)[0].data.serviceName;
      this.submitForm.serviceName = serviceName;
    },
    "submitForm.chargeUserId"(val) {
      if (!val || val.length == 0) return (this.submitForm.chargeUserName = "");
      if (this.$userInfo.userType == 0) {
        const chargeUserName = this.$refs.selectChargeUserId.getCheckedNodes(true)[0].data.userName;
        console.log(chargeUserName, 111);
        this.submitForm.chargeUserName = chargeUserName;
      } else {
        const serviceName = this.$refs.selectChargeUserId1;
        this.$nextTick(() => {
          let data = serviceName.selected;
          this.submitForm.chargeUserName = data;
          console.log(data);
        });
      }
    },
    "submitForm.mobilProjectUsers"(val) {
      if (!val || val.length == 0) return (this.submitForm.mobilProjectUsersName = "");
      const serviceName = this.$refs.selectMobil;
      const mobilProjectUsersNames = [];
      this.$nextTick(() => {
        let data = serviceName.selected[serviceName.selected.length - 1].select.selected;
        data.forEach(item => {
          mobilProjectUsersNames.push(item.label);
          console.log(mobilProjectUsersNames);
          this.submitForm.mobilProjectUsersNames = mobilProjectUsersNames.join();
        });
      });
    },
    "submitForm.distributorProjectUsers"(val) {
      if (!val || val.length == 0) return (this.submitForm.distributorProjectUsersName = "");
      const serviceName = this.$refs.selectDistributorProjectUsers;
      const distributorProjectUsersNames = [];
      this.$nextTick(() => {
        let data = serviceName.selected[serviceName.selected.length - 1].select.selected;
        data.forEach(item => {
          distributorProjectUsersNames.push(item.label);
          console.log(distributorProjectUsersNames);
          this.submitForm.distributorProjectUsersNames = distributorProjectUsersNames.join();
        });
      });
    },
    "submitForm.customerProjectUsers"(val) {
      if (!val || val.length == 0) return (this.submitForm.customerProjectUsersNames = "");
      const serviceName = this.$refs.selectCustomerProjectUsers;
      const customerProjectUsersNames = [];
      this.$nextTick(() => {
        let data = serviceName.selected[serviceName.selected.length - 1].select.selected;
        data.forEach(item => {
          customerProjectUsersNames.push(item.label);
          console.log(customerProjectUsersNames);
          this.submitForm.customerProjectUsersNames = customerProjectUsersNames.join();
        });
      });
    }
  },
  methods: {
    async handleChange(val) {
      if (val && val.length > 0) {
        const item = this.$refs.serviceTypeCascader.getCheckedNodes(true)[0].data;
        console.log(item);
        this.edit = false;
        this.authorityRole = item.authorityRole;
        if (this.submitForm.workshopId) {
          const asyncqueue = [this.getChargeUserList(), this.getMobileProjectUsers(), this.getDistributorProjectUsers()];
          await Promise.all(asyncqueue);
        }
      } else {
        this.edit = true;
        this.authorityRole = "";
        const asyncqueue = [this.getChargeUserList(), this.getMobileProjectUsers(), this.getDistributorProjectUsers()];
        await Promise.all(asyncqueue);
      }
    },
    clickServiceItem(slotScope) {
      const ownerRoleIds = this.$userInfo.accessTemplates.map(item => item.accessTemplateId.toString());
      const data = slotScope.data;
      let authorityRoles = [];
      if (data.authorityRole) {
        authorityRoles = data.authorityRole.split(",").map(item => item.toString());
        const authorFlag = authorityRoles.some(item => ownerRoleIds.includes(item));
        if (!authorFlag) {
          this.disabledSelServiceItem = true;
          let msg = "";
          if (this.$userInfo.userType == "2") {
            msg = `您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚当地授权经销商或者区域技术工程师解决服务申请事宜。`;
          } else {
            msg = `您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚区域技术工程师解决服务申请事宜。`;
          }
          this.$message({
            type: "warning",
            message: msg
          });
          this.$nextTick(() => {
            setTimeout(() => {
              this.submitForm.serviceNumber = "";
              this.$refs.cascaderAddr.inputValue = "";
              this.$refs.cascaderAddr.checkedValue = [];
              this.$refs.cascaderAddr.presentText = [];
            }, 100);
          });
        }
      }
    },
    switchDrawerLoading(show) {
      this.DRAWERVM.switchDrawerLoading(show);
    },
    clearSelWorkshopRelationField() {
      this.submitForm.chargeUserId = "";
      this.submitForm.distributorProjectUsers = "";
      this.submitForm.mobilProjectUsers = "";
      this.submitForm.chargeUserName = "";
      this.submitForm.distributorProjectUsersNames = "";
      this.submitForm.mobilProjectUsersNames = "";
    },
    async changeWorkshopEvent(val) {
      if (!val) {
        this.clearSelWorkshopRelationField();
        await this.$nextTick();
        this.chargePersonList = [];
        this.mobileProjectList = [];
        this.distributorProjectList = [];
        return;
      }
      this.clearSelWorkshopRelationField();
      this.getDiffChargeUserList();
    },
    async getDiffChargeUserList() {
      this.switchDrawerLoading(true);
      const asyncqueue = [this.getChargeUserList(), this.getMobileProjectUsers(), this.getDistributorProjectUsers()];
      await Promise.all(asyncqueue);
      this.switchDrawerLoading(false);
    },
    setFormFieldRequired(val) {
      if (this.serviceDrawerType == 1) return;
      const setFlag = val ? true : false;
      this.editFormRules.chargeUserId.required = setFlag;
    },
    async initSubmitForm() {
      this.switchDrawerLoading(true);
      const res = await getCreateServiceTypeTreeData();
      this.getCustomerProjectUserList();
      this.serviceTypeTreeOptions = res;
      this.switchDrawerLoading(false);
      this.getDiffChargeUserList();
    },

    async getCustomerProjectUserList() {
      const companyId = this.$route.query.companyId ? this.$route.query.companyId : this.$userInfo.companyId;
      const userType = this.$userInfo.userType;
      const params = {
        // orgId: companyId,
        current: 1,
        size: 300,
        pesId: this.$parent.$parent.pesInfo.pesInfoId
      };
      const customerUserListRes = await authChangegetCustomerProjectUsers(params);
      this.customerUserList = customerUserListRes;
    },

    getActiveWorkShopCompanyNumber() {
      if (this.workShopCompanyNumberMap[this.submitForm.workshopId]) return this.workShopCompanyNumberMap[this.submitForm.workshopId];
      this.workShopList.some(workshop => {
        if (workshop.workshopId == this.submitForm.workshopId) {
          this.workShopCompanyNumberMap[this.submitForm.workshopId] = workshop.customerCompanyNumber;
          return workshop.customerCompanyNumber;
        }
      });
    },

    getCustomerCompanyNumberParams() {
      const queryCompanyNumber = this.$route.query.companyNumber ? this.$route.query.companyNumber : this.$userInfo.companyNumber;
      return this.$userInfo.userType == 1 ? queryCompanyNumber : this.getActiveWorkShopCompanyNumber();
    },

    async getChargeUserList() {
      const params = {
        useStateFlag: 1,
        distributorCompanyType: this.overViewData.distributorCompanyType,
        customerCompanyId: this.$route.query.companyId,
        distributorCompanyId: this.overViewData.distributorCompanyId,
        customerCompanyNumber: this.overViewData.customerCompanyNumber,
        pesId: this.$parent.$parent.pesInfo.pesInfoId
      };
      if (Array.isArray(this.selectedData) && this.selectedData.length > 0 && this.selectedData[0].authorityRole && this.edit) {
        this.authorityRole = this.selectedData[0].authorityRole;
      }
      if (this.authorityRole) {
        params.authorityRole = this.authorityRole;
      }
      const res = await getChargeUserList(params);
      if (this.$userInfo.userType == 0) {
        res.forEach((item, index) => {
          item.userName = item.companyTypeName;
          item.userId = item.companyTypeName + "_" + index;
        });
      }
      this.chargePersonList = res;
      return res;
    },

    async getMobileProjectUsers() {
      if (Array.isArray(this.selectedData) && this.selectedData.length > 0 && this.selectedData[0].authorityRole && this.edit) {
        this.authorityRole = this.selectedData[0].authorityRole;
      }
      console.log(this.selectedData);
      const params = {
        workshopId: this.submitForm.workshopId,
        pesFlag: 1,
        useStateFlag: 1,
        pesInfoId: this.overViewData.pesInfoId
      };
      if (this.authorityRole) {
        params.authorityRole = this.authorityRole;
      }
      const res = await getMobileProjectUsers(params);
      this.mobileProjectList = res;
    },

    async getDistributorProjectUsers() {
      const params = {
        customerCompanyId: this.$route.query.companyId,
        workshopId: this.submitForm.workshopId,
        pesFlag: 1,
        useStateFlag: 1,
        pesInfoId: this.overViewData.pesInfoId
      };
      if (this.authorityRole) {
        params.authorityRole = this.authorityRole;
      }
      const res = await getDistributorProjectUsers(params);
      this.distributorProjectList = res;
    }
  }
};
</script>

<style lang="less" scoped>
.form-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  /deep/ .el-form-item__label {
    width: 100% !important;
  }
}
.module-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
