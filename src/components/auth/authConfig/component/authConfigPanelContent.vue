<template>
  <div class="auth-panel__content-container" v-loading="systemMenuLoading">
    <template v-if="activeAuthItem">
      <div class="auth-panel__content-title">权限</div>
      <el-form label-position="top">
        <el-form-item label="权限名称" :rules="[{ required: true, message: '请输入权限名称', trigger: 'blur' }]">
          <el-input @input="changeAuthName" size="mini" style="width: 60%;" type="text" maxlength="20" show-word-limit v-model="inputValue" />
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="switchTab" v-loading="tabLoading">
        <el-tab-pane label="小程序菜单&按钮" name="weChat">
          <SystemMenuPanel :checkTargetId="checkTargetId" :menuType="activeName" belongSystem="weChat" @changeCheckSelect="changeCheckBox" @switchSystemMenuLoading="switchSystemMenuLoading" />
        </el-tab-pane>
        <el-tab-pane label="Web菜单&按钮" name="web">
          <SystemMenuPanel :checkTargetId="checkTargetId" :menuType="activeName" belongSystem="web" @changeCheckSelect="changeCheckBox" @switchSystemMenuLoading="switchSystemMenuLoading" />
        </el-tab-pane>
        <el-tab-pane label="数据权限配置" name="dataConfig">
          <el-form label-position="top">
            <el-form-item label="是否存在数据权限控制" :rules="[{ required: true, message: '请选择是否存在数据权限控制', trigger: 'blur' }]">
              <el-radio-group v-model="menuGroupRule.existFlag" @change="changeDataControl">
                <el-radio :label="1">存在，并在角色中配置</el-radio>
                <el-radio :label="2">存在统一权限</el-radio>
                <el-radio :label="0">不存在</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="menuGroupRule.existFlag == 2 ? '统一权限' : '可选数据权限选项'"
              :rules="[{ required: true, message: '请选择统一权限', trigger: 'blur' }]"
              v-show="[1, 2].includes(menuGroupRule.existFlag)"
            >
              <el-checkbox-group v-model="menuGroupRule.ruleJson">
                <el-checkbox label="sp">SP</el-checkbox>
                <el-checkbox label="hand_managed_sp">手动分管SP</el-checkbox>
                <el-checkbox label="assetGroup">AG</el-checkbox>
                <el-checkbox label="service_assetGroup">服务AG</el-checkbox>
                <el-checkbox label="assistance_assetGroup">协助AG</el-checkbox>
                <el-checkbox label="personal">个人</el-checkbox>
                <el-checkbox label="company">本公司</el-checkbox>
                <el-checkbox label="workshop">车间</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="auth-system-menu__bottom-bar">
        <el-button size="mini" @click="deleteAuthItem">删除</el-button>
        <el-button size="mini" type="danger" @click="saveAuthItem">保存</el-button>
      </div>
    </template>
    <Empty v-if="!activeAuthItem" />
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import * as AUTHAPI from "../authApi";
import { state } from "../auth";
export default {
  setup() {
    return {
      state
    };
  },
  created() {
    this.initActiveName();
  },
  components: {
    Empty: () => import("../../component/empty"),
    SystemMenuPanel: () => import("./authConfigSystemMenuPanel")
  },
  props: {
    activeAuthItem: {
      type: Object,
      default: null
    }
  },
  watch: {
    activeAuthItem: {
      handler(ov, nv) {
        this.initInputValue();
        this.clearCheckTargetId(ov, nv);
        this.associatedMenus(ov, nv);
        this.associatedDataRule(ov, nv);
      },
      immediate: true
    }
  },
  data() {
    return {
      inputValue: "",
      activeName: "",
      systemMenuLoading: false,
      prevAuthItem: null,
      checkTargetId: [],
      tabLoading: false,
      permissionGroupMenuRels: [],
      menuGroupRule: {
        existFlag: 0,
        groupId: "",
        ruleJson: []
      }
    };
  },
  methods: {
    async associatedDataRule(ov, nv) {
      if (!ov) return;
      const res = await AUTHAPI.group_getAssociatedDataRule({
        groupIds: [ov.id],
        accessTemplateId: ov.id
      });
      if (res.data.code == 1000) {
        if (!res.data.data.length || !res.data.data) return;
        this.menuGroupRule = res.data.data[0];
        const ruleJson = this.menuGroupRule.ruleJson || this.menuGroupRule.ruleScopeJson;
        this.menuGroupRule.ruleJson = ruleJson ? JSON.parse(ruleJson) : [];
        this.menuGroupRule.ruleJson = this.menuGroupRule.ruleJson.map(item => item.code);
      }
    },
    clearCheckTargetId(ov, nv) {
      if (nv && ov && nv.id == ov.id) return;
      this.checkTargetId = [];
    },
    async associatedMenus(newActiveAuthItem, oldActiveAuthItem) {
      if (!newActiveAuthItem) return;
      if (oldActiveAuthItem && oldActiveAuthItem.id == newActiveAuthItem.id) return;
      this.associatedMenusDirect();
    },
    async associatedMenusDirect() {
      this.switchSystemMenuLoading(true);
      const res = await AUTHAPI.group_associatedMenus({ groupId: this.activeAuthItem.id });
      if (res) {
        this.rawAssociatedMenus = cloneDeep(res.data.data);
        this.checkTargetId = res.data.data.map(item => item.targetId);
        this.permissionGroupMenuRels = res.data.data;
      }
      this.switchSystemMenuLoading(false);
    },
    async refreshAssociatedMenus() {
      this.switchSystemMenuLoading(true);
      this.associatedMenusDirect();
      this.$forceUpdate();
    },
    changeDataControl() {
      this.menuGroupRule.ruleJson = [];
    },
    changeCheckBox($event) {
      const { $event: selectFlag, selectItem } = $event;
      const { targetId } = selectItem;
      const index = this.permissionGroupMenuRels.findIndex(item => item.targetId === targetId);
      if (index > -1) {
        if (!selectFlag) this.permissionGroupMenuRels.splice(index, 1);
      } else {
        const handleItem = {
          objectId: selectItem.menuId || selectItem.buttonId,
          groupId: this.activeAuthItem.id,
          menuChannel: selectItem.menuType.toLowerCase() == "web" ? 1 : 2,
          targetId: selectItem.targetId
        };
        if (selectFlag) this.permissionGroupMenuRels.push(handleItem);
      }
      this.state.permissionGroupMenuRels = cloneDeep([...this.permissionGroupMenuRels]);
    },
    switchSystemMenuLoading(flag) {
      this.systemMenuLoading = flag;
    },
    initActiveName() {
      this.activeName = this.state.activeName || "weChat";
    },
    initInputValue() {
      this.inputValue = this.activeAuthItem ? this.activeAuthItem.name : "";
    },
    changeAuthName(value) {
      this.$emit("changeAuthName", value);
    },
    saveAuthItem() {
      if (!this.inputValue)
        return this.$message({
          type: "warning",
          message: "请输入权限名称"
        });

      const menuGroupRule = JSON.parse(JSON.stringify(this.menuGroupRule));
      if ([1, 2].includes(menuGroupRule.existFlag) && (!menuGroupRule.ruleJson || !menuGroupRule.ruleJson.length))
        return this.$message({
          type: "warning",
          message: "请选择统一权限"
        });
      menuGroupRule.groupId = this.activeAuthItem.id;
      menuGroupRule.ruleJson = menuGroupRule.ruleJson.map(item => {
        return { code: item };
      });
      menuGroupRule.ruleJson = JSON.stringify(menuGroupRule.ruleJson);
      if (menuGroupRule.existFlag == 1) {
        menuGroupRule.ruleScopeJson = menuGroupRule.ruleJson;
        menuGroupRule.ruleJson = "";
      }
      if (menuGroupRule.existFlag == 0) menuGroupRule.ruleJson = "";
      this.$emit("saveAuthItem", { permissionGroupMenuRels: this.permissionGroupMenuRels, oldPermissionGroupMenuRels: this.rawAssociatedMenus, menuGroupRule: menuGroupRule });
    },
    deleteAuthItem() {
      this.$emit("deleteAuthItem");
    },
    switchTab() {
      this.state.activeName = this.activeName;
      this.checkTargetId = [...this.permissionGroupMenuRels.map(item => item.targetId)];
    }
  }
};
</script>

<style lang="less" scoped>
.auth-panel__content-container {
  width: 80%;
  position: relative;
  box-sizing: border-box;
  padding: 10px;
  padding-left: 20px;
  height: 100%;
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
  height: 50px;
  background: #fff;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 100;
  margin-left: -20px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
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
</style>
