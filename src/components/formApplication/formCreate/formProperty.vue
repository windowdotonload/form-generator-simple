<template>
  <el-form :model="form" class="form-property-container" label-position="top">
    <div class="form-property-box">
      <div class="form-property-box-header">基本信息</div>
      <div class="form-property-box-content">
        <el-form-item label="表单名称" size="mini" prop="formName" :rules="[{ required: true, message: '请输入表单名称', trigger: 'blur' }]">
          <el-input v-model="form.formName" maxlength="15" />
        </el-form-item>
        <el-form-item label="描述" size="mini">
          <el-input v-model="form.remark" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态" size="mini" prop="status" :rules="[{ required: true, message: '请输入表单名称', trigger: 'blur' }]">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </div>
    <div class="form-property-box">
      <div class="form-property-box-header">适用范围</div>
      <div class="form-property-box-content">
        <el-form-item label="使用者" size="mini" prop="fromScope" :rules="[{ required: true, message: '请输入表单名称', trigger: 'blur' }]">
          <el-radio-group v-model="form.fromScope" @input="changeScope">
            <el-radio :label="1">全公司</el-radio>
            <el-radio :label="2" v-if="false">车间</el-radio>
            <el-radio :label="0">员工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="mini" v-show="form.fromScope != 1">
          <el-select v-model="form.userIds" multiple v-show="form.fromScope == 0" @remove-tag="removeUserIds" @change="changeSeleUser">
            <el-option v-for="item in managerUserOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="form.workShopIds" multiple v-show="form.fromScope == 2">
            <el-option v-for="item in workShopList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理者（从使用者中选择）" size="mini" prop="managerUserIds" :rules="[{ required: true, message: '请输入表单名称', trigger: 'blur' }]">
          <el-select v-model="form.managerUserIds" multiple @remove-tag="removeManagerUserIds" @change="changeSelManageUser">
            <el-option v-for="item in managerUserOptionsFromUserList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { getFormRelationPersonList, getWorkShopList, getFormListConfig } from "../api/index.js";
export default {
  inject: ["editFormData"],
  async created() {
    await this.revertEditFormData();
    this.getWorkShopList();
    this.getPersonList();
  },
  data() {
    return {
      managerUserOptions: [],
      managerUserOptionsFromUserList: [],
      workShopList: [],
      form: {
        managerUserIds: [],
        workShopIds: [],
        userIds: [],
        formName: "",
        remark: "",
        status: 1,
        fromScope: 1
      }
    };
  },
  methods: {
    changeScope() {
      if (this.form.fromScope == 1) return (this.managerUserOptionsFromUserList = this.managerUserOptions);
      const handleArr = this.managerUserOptions.filter(item => this.form.userIds.includes(item.value));
      const newArrIds = handleArr.map(item => item.value);
      if (this.form.managerUserIds) {
        this.form.managerUserIds = this.form.managerUserIds.filter(item => newArrIds.includes(item));
      }
      this.managerUserOptionsFromUserList = handleArr;
    },
    removeManagerUserIds(tag) {
      if (tag == this.$userInfo.userId) {
        this.$message({
          type: "warning",
          message: "不可以把自己从管理者中移除"
        });
      }
    },
    removeUserIds(tag) {
      if (tag == this.$userInfo.userId) {
        this.$message({
          type: "warning",
          message: "不可以把自己从使用者者中移除"
        });
      }
    },
    changeSelManageUser(sel) {
      if (!sel.includes(this.$userInfo.userId)) {
        this.form.managerUserIds.push(this.$userInfo.userId);
      }
    },
    changeSeleUser(sel) {
      if (!sel.includes(this.$userInfo.userId)) {
        this.form.userIds.push(this.$userInfo.userId);
      }
      this.changeScope();
    },
    async getWorkShopList() {
      if (this.$userInfo.userType != 2) return;
      const params = {
        companyId: this.$userInfo.companyId,
        noWorkShopFlag: true,
        size: 300
      };
      const res = await getWorkShopList(params);
      this.workShopList = res.data.data.list.map(item => {
        return {
          value: parseInt(item.workshopId),
          label: item.workshopName
        };
      });
    },
    async getPersonList() {
      const res = await getFormRelationPersonList({useStateFlag: 1});

      res.data.data.forEach(item => {
        this.managerUserOptions.push({
          value: item.userId,
          label: item.nameCn
        });
      });
      if (!this.managerUserOptions.map(item => item.value).includes(this.$userInfo.userId))
        this.managerUserOptions.push({
          value: this.$userInfo.userId,
          label: this.$userInfo.userName
        });
      this.changeScope();
      if (!this.form.managerUserIds.length && !this.$route.query.formData) {
        this.form.managerUserIds.push(this.$userInfo.userId);
        this.form.userIds.push(this.$userInfo.userId);
      }
    },
    async revertEditFormData() {
      if (!this.$route.query.formData) return;
      const revertData = JSON.parse(this.$route.query.formData);
      if (!revertData.id.toString()) return;
      const confitRevertInfo = await getFormListConfig({
        formId: revertData.id
      });
      const backEndForm = confitRevertInfo.data.data;
      delete backEndForm.componentList;
      this.form = Object.assign({}, this.form, revertData, backEndForm);
      this.form.formId = revertData.id;
      this.form.status = this.form.status ? 1 : 0;
      if (!this.form.managerUserIds) this.form.managerUserIds = [];
      if (!this.form.userIds) this.form.userIds = [];
      if (this.form.managerUserIds && !this.form.managerUserIds.includes(this.$userInfo.userId)) {
        this.form.managerUserIds.push(this.$userInfo.userId);
      }
      if (this.form.userIds && !this.form.userIds.includes(this.$userInfo.userId)) {
        this.form.userIds.push(this.$userInfo.userId);
      }
    },
    getFormMOdel() {
      return this.form;
    }
  }
};
</script>

<style lang="less" scoped>
.form-property-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.form-property-box {
  width: 60%;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.5);
  margin-top: 20px;
  overflow: hidden;
}
.form-property-box-header {
  background-color: #f9f9f9;
  padding: 0 20px;
  height: 39px;
  display: flex;
  align-items: center;
  color: #000;
  font-size: 15px;
  font-weight: bolder;
}
.form-property-box-header::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 20px;
  margin-right: 10px;
  background-color: rgb(209, 0, 0, 0.8);
}
.form-property-box-content {
  padding: 20px;
}
.form-create-tip {
  margin-top: -1%;
  font-size: 12px;
  color: #d10000;
}
</style>
