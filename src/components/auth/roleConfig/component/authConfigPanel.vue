<template>
  <div class="auth-panel__content-container" v-loading="loading">
    <div class="auth-panel__content-form-container">
      <el-form label-position="top" :model="configInfoForm" ref="roleConfigForm">
        <div class="auth-panel__content-title" ref="baseInfoPoint">基础信息</div>
        <el-form-item prop="accessTemplateName" label="角色名称" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input placeholder="请输入" v-model="configInfoForm.accessTemplateName" size="mini" style="width: 60%;" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item ref="accessTemplateDesc" prop="accessTemplateDesc" label="角色描述">
          <el-input placeholder="请输入" resize="none" v-model="configInfoForm.accessTemplateDesc" size="mini" type="textarea" maxlength="100" show-word-limit style="width: 60%;" />
        </el-form-item>
        <el-form-item prop="ownerType" label="角色归属" :rules="[{ required: true, message: '请输入角色归属', trigger: 'blur' }]">
          <el-radio-group v-model="configInfoForm.ownerType" :disabled="configInfoForm.ownerType == 2">
            <el-radio :label="0">美孚</el-radio>
            <el-radio :label="1">经销商</el-radio>
            <el-radio :label="2" disabled>客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="dutyType" label="职责类型" :rules="[{ required: true, message: '请选择职责类型', trigger: 'blur' }]" v-if="configInfoForm.ownerType == 0">
          <el-radio-group v-model="configInfoForm.dutyType">
            <el-radio :label="1">管理类</el-radio>
            <el-radio :label="2">执行类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row class="auth-panel__role-config">
          <el-col :span="8">创建信息</el-col>
          <el-col :span="8">最后编辑信息</el-col>
          <el-col :span="8">使用人数</el-col>
        </el-row>
        <el-row class="auth-panel__role-config">
          <el-col :span="8">{{ state.activeRoleItem.createByName ? state.activeRoleItem.createByName + " " + formatDate(new Date(state.activeRoleItem.createTime)) : "--" }}</el-col>
          <el-col :span="8">{{ state.activeRoleItem.updateByName ? state.activeRoleItem.updateByName + " " + formatDate(new Date(state.activeRoleItem.updateTime)) : "--" }}</el-col>
          <el-col :span="8">{{ state.activeRoleItem.numberOfUsers || 0 }}</el-col>
        </el-row>
        <div class="auth-panel__content-title" style="margin-bottom: 10px;">
          服务数据授权
        </div>
        <div class="auth-panel__auto-auth-container" v-show="configInfoForm.ownerType == 0">
          <div class="auth-panel__auto-auth">
            <el-form-item style="margin: 0;" v-show="configInfoForm.ownerType == 0">
              <template #label>
                <p style="margin: 0;padding: 0;font-weight: bolder;color: #000;padding: 0 5px;">直供客户</p>
              </template>
              <el-checkbox-group v-model="autoAuthConfig[0].directAccount.code" size="mini">
                <el-checkbox :label="'directAccount'">默认授权本公司范围内的所有</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="auth-panel__auto-auth">
            <div class="auth-panel__auto-auth" style="margin-bottom: 0;">
              <el-form-item style="margin: 0;" v-show="configInfoForm.ownerType == 0">
                <template #label>
                  <p style="margin: 0;padding: 0;font-weight: bolder;color: #000;padding: 0 5px">经销商</p>
                </template>
                <el-checkbox-group v-model="autoAuthConfig[0].distributor.code" size="mini">
                  <el-checkbox :label="'distributor'">默认授权一定范围内的数据</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item style="margin: 0;display: flex;flex-wrap: nowrap;" v-show="configInfoForm.ownerType == 0 && autoAuthConfig[0].distributor.code == 'distributor'">
                <span style="margin-right: 10px;">默认管理范围</span>
                <el-radio-group v-model="autoAuthConfig[0].distributor.scope" size="mini">
                  <el-radio :label="1">全部</el-radio>
                  <el-radio :label="2">个人所属区域内</el-radio>
                </el-radio-group>
              </el-form-item>
              <span v-show="configInfoForm.ownerType == 0 && autoAuthConfig[0].distributor.code == 'distributor'" style="color:#999;font-size: 13px;margin-top: 10px;"
                >提示：获得经销商数据授权后，会自动获得该范围内非直供客户的相关数据</span
              >
            </div>
          </div>
        </div>

        <div class="auth-panel__auto-auth-container" v-show="configInfoForm.ownerType == 1">
          <div class="auth-panel__auto-auth">
            <div class="auth-panel__auto-auth" style="margin-bottom: 0;">
              <el-form-item style="margin: 0;">
                <template #label>
                  <p style="margin: 0;padding: 0;font-weight: bolder;color: #000;padding: 0 5px">经销商客户</p>
                </template>
                <el-checkbox-group v-model="autoAuthConfig[1].noDirectAccount.code" size="mini">
                  <el-checkbox :label="'noDirectAccount'">默认授权本公司范围内的所有</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <div style="color:#999;font-size: 13px;margin-top: 10px;">提示：</div>
              <div style="color:#999;font-size: 13px;margin-top: 10px;">1、如果用户有分管下级用户的权限，将自动授权访问下级用户的非直供客户相关数据</div>
              <div style="color:#999;font-size: 13px;margin-top: 10px;">2、经销商用户会自动授权本公司范围内的所有直供客户数据</div>
            </div>
          </div>
        </div>

        <div class="auth-panel__auto-auth-container" v-show="configInfoForm.ownerType == 2">
          <div class="auth-panel__auto-auth">
            <div class="auth-panel__auto-auth" style="margin-bottom: 0;">
              <span style="margin-right: 10px;font-size: 13px;color: #000;">服务数据</span>
              <el-form-item style="margin: 0;display: flex;flex-wrap: nowrap;" v-show="configInfoForm.ownerType == 2">
                <el-radio-group size="mini" disabled v-model="staticRadio">
                  <el-radio :label="1">单一经销商的服务数据</el-radio>
                </el-radio-group>
              </el-form-item>
              <span style="color:#999;font-size: 13px;margin-top: 10px;">提示：用户控制客户用户能够访问的工单、申请单等数据，以及美孚、经销商能否看到该用户</span>
            </div>
          </div>
        </div>
        <div class="auth-panel__content-title" style="margin-bottom: 10px;">菜单权限</div>
        <RoleAuthMenuPanel :key="state.activeRoleItem.id" v-loading="roleAuthMenuPanelLoading" ref="RoleAuthMenuPanel" :menuList="authList" @changeCheckSelect="changeCheckSelect" />
        <div class="auth-panel__content-title" style="margin-bottom: 10px;">
          数据权限
        </div>
        <el-table :data="dataAuthTableData" border style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }">
          <el-table-column show-overflow-tooltip prop="authName" label="权限"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="authScope" label="权限生效范围">
            <template #default="scope">
              <div v-if="scope.row.existFlag == 2">
                {{ scope.row.ruleJson ? scope.row.ruleJson.map(item => roleRuleConfigOptionsMapText[configInfoForm.ownerType][item.code]).join(",") : "--" }}
              </div>
              <div v-if="scope.row.existFlag == 1">
                <el-select v-model="roleRuleConfigOptionsMap[scope.row.groupId]" placeholder="请选择" size="mini" multiple collapse-tags style="width:80%" @change="assignRule(scope.row)">
                  <el-option v-for="item in filterRoleScopeOptions(scope.row, roleRuleConfigOptions[configInfoForm.ownerType])" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="auth-system-menu__bottom-bar">
      <DeleteButton class="auth-system-menu__delte-button" v-show="configInfoForm.ownerType != 2" />
      <el-button size="mini" type="danger" @click="saveForm" style="width: 8%;">保存</el-button>
    </div>

    <el-dialog
      title="其他数据范围"
      :style="{ marginTop: otherDescMarginTop, borderRadius: '6px' }"
      :visible.sync="otherDescDialog"
      width="20%"
      :close-on-click-modal="false"
      :before-close="beforeCloseDialog"
    >
      <div class="auth-panel__other-desc">
        <div class="auth-panel__other-header">
          <span>无权限控制的数据，及权限说明</span>
          <span>
            <el-button type="text" size="mini" @click="opDataDesc(1)" v-show="!editOtherDataDescFlag">编辑</el-button>
            <el-button type="text" size="mini" style="color:#d10000" @click="opDataDesc(2)" v-show="editOtherDataDescFlag">保存</el-button>
            <el-button type="text" size="mini" style="color:#666" @click="opDataDesc(3)" v-show="editOtherDataDescFlag">取消</el-button>
          </span>
        </div>
        <div v-show="!editOtherDataDescFlag">
          <pre v-html="this.configInfoForm.otherDataScopeDesc || '暂无内容'" class="auth-panel__other-desc-show" />
        </div>
        <div v-show="editOtherDataDescFlag">
          <el-input placeholder="请输入" rows="6" resize="none" v-model="currentOtherDataDesc" size="mini" type="textarea" maxlength="200" show-word-limit />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { state, useRoleConfig } from "../role";
import { roleRuleConfigOptions, roleRuleConfigOptionsMapText } from "../roleConfig";
import * as ROLEAPI from "../roleApi";
const { watch } = VueCompositionAPI;
let __vm = null;
export default {
  components: {
    DeleteButton: () => import("./deleteButton"),
    RoleAuthMenuPanel: () => import("./roleConfigSystemMenuPanel")
  },
  setup() {
    watch(() => state.activeRoleItem, (newVal, oldVal) => __vm.updatedConfigInfoForm(newVal, oldVal));
    return {
      state
    };
  },
  async created() {
    this.setVM();
    await this.getAuthList();
    this.updatedConfigInfoForm();
  },
  beforeDestroy() {
    this.clearVM();
  },
  data() {
    return {
      staticRadio: 1,
      roleAuthMenuPanelLoading: false,
      otherDescDialog: false,
      loading: false,
      editOtherDataDescFlag: false,
      otherDescMarginTop: "12%",
      authList: [],
      currentOtherDataDesc: "",
      dataScopeConfigOptionsreferRoleType: {
        // 1-全部 2-区域 3-个人
        1: [
          {
            scope: 1,
            tip: "相关数据包括设备、申请单、工单、计划工程服务数据",
            code: "directAccount",
            name: "直供客户相关数据",
            options: [{ label: "全部", value: 1 }]
          },
          {
            scope: 3,
            tip: "相关数据包括设备、申请单、工单、计划工程服务数据",
            code: "distributorAccount",
            name: "经销商客户相关数据",
            options: [{ label: "全部", value: 1 }, { label: "个人", value: 3 }]
          },
          {
            scope: 1,
            code: "recordForm",
            name: "记录表",
            options: [{ label: "全部", value: 1 }, { label: "个人", value: 3 }]
          }
        ],
        2: [
          {
            scope: 1,
            tip: "相关数据包括设备、申请单、工单、计划工程服务数据",
            code: "serviceData",
            name: "服务数据",
            options: [{ label: "全部", value: 1 }, { label: "个人", value: 3 }]
          },
          {
            scope: 1,
            code: "record",
            name: "记录表",
            options: [{ label: "全部", value: 1 }, { label: "个人", value: 3 }]
          }
        ]
      },
      configInfoForm: {
        dutyType: state.activeRoleItem.dutyType,
        accessTemplateName: state.activeRoleItem.accessTemplateName,
        accessTemplateDesc: state.activeRoleItem.accessTemplateDesc,
        ownerType: state.activeRoleItem.ownerType || 0,
        otherDataScopeDesc: state.activeRoleItem.otherDataScopeDesc || ""
      },
      autoAuthConfig: {
        0: {
          directAccount: {
            code: ["directAccount"],
            scope: 3
          },
          distributor: {
            code: ["distributor"],
            scope: 1
          }
        },
        1: {
          noDirectAccount: {
            code: ["noDirectAccount"],
            scope: 1
          }
        },
        2: {}
      },
      dataAuthTableData: [],
      selectedItems: [],
      dataRuleTimer: null,
      roleRuleConfigOptionsMapText,
      roleRuleConfigOptionsMap: {},
      roleRuleConfigOptions
    };
  },
  methods: {
    setVM() {
      __vm = this;
    },
    clearVM() {
      __vm = null;
    },
    switchLoading(loading) {
      this.loading = loading;
    },
    clearCheckSelect() {
      this.selectedItems = [];
      this.dataAuthTableData = [];
    },
    filterRoleScopeOptions(rowItem, options) {
      if (rowItem.existFlag != 1) return;
      const ruleScopeJson = rowItem.ruleScopeJson ? JSON.parse(rowItem.ruleScopeJson) : [];
      const ruleScopeJsonCode = ruleScopeJson.map(item => item.code);
      return this.roleRuleConfigOptions[this.configInfoForm.ownerType].filter(item => ruleScopeJsonCode.includes(item.value));
    },
    async changeCheckSelect(selectInfo) {
      const { checkMap, selectItem } = selectInfo;
      if (checkMap[selectItem.id]) {
        this.selectedItems.push(selectItem);
      } else {
        this.selectedItems = this.selectedItems.filter(item => item.id !== selectItem.id);
      }
      this.getAssociatedDataRule();
    },
    async getAssociatedDataRule() {
      if (this.dataRuleTimer) clearTimeout(this.dataRuleTimer);
      this.dataRuleTimer = setTimeout(async () => {
        const rlues = await ROLEAPI.group_getAssociatedDataRule({
          accessTemplateId: state.activeRoleItem.id,
          groupIds: this.selectedItems.map(item => item.id)
        });
        this.dataRuleTimer = null;
        this.handelDataAuthTableData(rlues);
      }, 1000);
    },
    handelDataAuthTableData(rules) {
      const data = rules.data.data;
      const existRulesSelectItem = this.selectedItems.filter(item => {
        return data.some(rule => {
          const sameIdTarget = rule.groupId === item.id;
          if (sameIdTarget) {
            item.existFlag = rule.existFlag;
            item.ruleJson = rule.ruleJson;
            item.customRuleJson = rule.customRuleJson;
          }
          return sameIdTarget && rule.existFlag != 0;
        });
      });
      this.dataAuthTableData = existRulesSelectItem.map(item => {
        const configRule = data.find(rule => rule.groupId === item.id) || {};
        if (configRule.ruleJson) configRule.ruleJson = JSON.parse(configRule.ruleJson);
        if (configRule.customRuleJson) configRule.customRuleJson = JSON.parse(configRule.customRuleJson);
        this.$set(this.roleRuleConfigOptionsMap, configRule.groupId, this.roleRuleConfigOptionsMap[configRule.groupId] || []);
        return {
          authName: item.name,
          ...configRule
        };
      });
      this.state.activeRoleItem.checkMenuGroupRuleRels.forEach(item => {
        if (item.customRuleJson) {
          const customRuleJson = JSON.parse(item.customRuleJson);
          this.$set(this.roleRuleConfigOptionsMap, item.menuGroupId, customRuleJson.map(item => item.code));
        }
      });
    },

    assignRule(rowInfo) {
      const selectTarget = this.selectedItems.find(item => item.id === rowInfo.groupId);
      selectTarget.customRuleJson = this.roleRuleConfigOptionsMap[rowInfo.groupId].map(code => {
        return {
          code
        };
      });
      selectTarget.customRuleJson = JSON.stringify(selectTarget.customRuleJson);
    },

    openOtherDesc() {
      this.currentOtherDataDesc = this.configInfoForm.otherDataScopeDesc;
      this.otherDescDialog = true;
    },
    beforeCloseDialog() {
      this.editOtherDataDescFlag = false;
      this.currentOtherDataDesc = "";
      this.otherDescDialog = false;
    },
    opDataDesc(type) {
      if (type === 1) {
        this.editOtherDataDescFlag = true;
        this.currentOtherDataDesc = this.configInfoForm.otherDataScopeDesc;
      } else if (type === 2) {
        this.configInfoForm.otherDataScopeDesc = this.currentOtherDataDesc;
        this.editOtherDataDescFlag = false;
      } else if (type === 3) {
        this.currentOtherDataDesc = "";
        this.editOtherDataDescFlag = false;
      }
    },
    revertDataScopeForAutoAuthRule(dataScope, ownerType) {
      if (!dataScope) return;
      dataScope = JSON.parse(dataScope);
      Object.keys(this.autoAuthConfig[ownerType]).forEach(key => {
        const revertItem = dataScope.find(item => item.code === key);
        if (revertItem) {
          this.autoAuthConfig[ownerType][key].code = [revertItem.code];
          this.autoAuthConfig[ownerType][key].scope = revertItem.scope;
        } else {
          this.autoAuthConfig[ownerType][key].code = [];
        }
      });
      return dataScope;
    },
    updatedConfigInfoForm(nv, ov) {
      this.configInfoForm = {
        dutyType: state.activeRoleItem.dutyType,
        accessTemplateName: state.activeRoleItem.accessTemplateName,
        accessTemplateDesc: state.activeRoleItem.accessTemplateDesc,
        ownerType: state.activeRoleItem.ownerType || 0,
        otherDataScopeDesc: state.activeRoleItem.otherDataScopeDesc
      };
      this.roleRuleConfigOptionsMap = {};
      this.revertDataScopeForAutoAuthRule(state.activeRoleItem.dataScope, this.configInfoForm.ownerType);

      this.$refs.roleConfigForm.clearValidate();
      this.$refs.baseInfoPoint.scrollIntoView({
        behavior: "smooth"
      });
      if (nv && ov && nv.id !== ov.id) {
        this.clearCheckSelect();
        this.$refs.RoleAuthMenuPanel.refreshCheckMap(JSON.parse(JSON.stringify(state.activeRoleItem)));
      }
    },
    async getAuthList() {
      this.roleAuthMenuPanelLoading = true;
      const authListRes = await ROLEAPI.role_getAuthTree();
      if (authListRes) {
        this.authList = authListRes.data.data;
      }
      this.roleAuthMenuPanelLoading = false;
    },
    addSecondGroupIds() {
      let res = [];
      this.authList.map(auth => {
        auth.children &&
          auth.children.map(child => {
            if (this.$refs.RoleAuthMenuPanel.checkMap[child.id]) res.push(child.id);
          });
      });
      return res;
    },
    handeleDataScope() {
      const dataScope = [];
      const ownerType = this.configInfoForm.ownerType;
      switch (ownerType) {
        case 0:
          if (this.autoAuthConfig[0].directAccount.code.length > 0) {
            dataScope.push({
              code: "directAccount",
              scope: 3
            });
          }
          if (this.autoAuthConfig[0].distributor.code.length > 0) {
            dataScope.push({
              code: "distributor",
              scope: this.autoAuthConfig[0].distributor.scope
            });
            dataScope.push({
              code: "noDirectAccount",
              scope: this.autoAuthConfig[0].distributor.scope
            });
          }
          break;
        case 1:
          dataScope.push({
            code: "directAccount",
            scope: 3
          });
          if (this.autoAuthConfig[1].noDirectAccount.code.length > 0) {
            dataScope.push({
              code: "noDirectAccount",
              scope: 3
            });
          }
          break;
        case 2:
          dataScope.push({
            code: "account",
            scope: 3
          });
          break;
      }
      return dataScope;
    },
    saveForm() {
      this.$refs.roleConfigForm.validate(async valid => {
        if (valid) {
          const dataScope = this.handeleDataScope();
          const newMenuGroupRules = this.selectedItems
            .map(item => {
              if (item.children && Array.isArray(item.children)) return null;
              return {
                menuGroupId: item.id,
                customRuleJson: item.customRuleJson || "",
                existFlag: item.existFlag
              };
            })
            .filter(i => i);
          const roleCreateRes = await ROLEAPI.role_update({
            accessTemplate: {
              ...state.activeRoleItem,
              ...this.configInfoForm,
              dataScope: JSON.stringify(dataScope)
            },
            newMenuGroupRules
          });
          if (roleCreateRes && roleCreateRes.data.code === 1000) {
            this.$message.success("保存成功");
            useRoleConfig().refreshRoleList();
          } else {
            this.configInfoForm.accessTemplateName = state.activeRoleItem.accessTemplateName;
          }
        } else {
          this.$refs.accessTemplateDesc.$el.scrollIntoView({
            behavior: "smooth",
            block: "end"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.auth-panel__content-container {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  padding-left: 20px;
  overflow: auto;
  height: 100%;
  overflow: hidden;
}

.auth-panel__content-form-container {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  padding-left: 20px;
  overflow: auto;
  height: calc(100% - 60px);
  overflow: auto;

  &::-webkit-scrollbar {
    width: 3px !important;
  }
}

.auth-panel__content-title {
  color: var(--icon-text-1000000, #000);
  font-family: Microsoft YaHei;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  height: 30px;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 15px;
    background: #d10000;
    margin-right: 10px;
  }
}

.auth-system-menu__bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #fff;
  z-index: 100;
  margin-left: -20px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
}

.auth-panel__role-config {
  line-height: 32px;
  height: 32px;
  color: #000;
  font-family: Microsoft YaHei;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
}

.auth-panel__other-desc {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  padding-top: 10px;
}

.auth-panel__other-header {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.auth-panel__other-desc-show {
  margin-top: 5px;
  border-radius: 3px;
  line-height: 1.5;
  white-space: pre-wrap;
  font-family: Microsoft YaHei;
}

.auth-panel__data-scope-option {
  display: inline-block;
  width: 150px;
  font-weight: bold;
}
.auth-panel__auto-auth-container {
  width: 100%;
  box-sizing: border-box;
  padding-right: 10px;
}
.auth-panel__auto-auth {
  box-sizing: border-box;
  widows: 100%;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.auth-system-menu__delte-button {
  display: inline-block;
  width: 8%;
}

/deep/ .el-tabs__item {
  font-weight: 700;
}

/deep/ .el-tabs__nav-wrap::after {
  display: none;
}

/deep/ .el-tabs__item:hover {
  color: #d10000;
}

/deep/ .el-tabs__item.is-active {
  color: #000;
}

/deep/ .el-tabs__active-bar {
  background-color: #d10000 !important;
}

/deep/ .el-dialog__header {
  padding-bottom: 0 !important;
}
/deep/ .el-dialog__body {
  padding-top: 0;
  padding-bottom: 10px;
}

/deep/ .el-dialog {
  border-radius: 6px !important;
}
</style>
