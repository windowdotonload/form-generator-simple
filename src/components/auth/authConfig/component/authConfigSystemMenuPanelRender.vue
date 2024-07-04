<template>
  <div :class="containerClassNameMap[type]" class="auth-system-menu__container" :style="{ paddingLeft: `${level * gapMap[type]}px` }">
    <div v-if="type == 'buttonCheckbox'" class="auth-system-menu__select-all-btn">
      <el-button type="text" size="mini" style="color: #001450;font-weight: 700;" @click="allCheck">{{ checkText }}</el-button>
    </div>
    <div :class="classNameMap[type]" v-for="item in menuList" :key="item.menuId">
      <Check :menuType="menuType" :ref="item.targetId" :checkItem="item" :type="type" :checkTargetId="checkTargetId" @change="changeCheckBox($event, item)" />
      <SystemPanelRender v-if="item.children && item.children.length" :menuList="item.children" :level="level + 1" v-on="$listeners" v-bind="$props" :menuType="menuType" />
      <SystemPanelRender v-if="item.buttonList && item.buttonList.length" :menuList="item.buttonList" type="buttonCheckbox" :level="level + 1" v-on="$listeners" v-bind="$props" :menuType="menuType" />
    </div>
  </div>
</template>

<script>
import { state } from "../auth";
export default {
  setup() {
    return {
      state
    };
  },
  name: "SystemPanelRender",
  props: {
    menuType: {
      type: String,
      default: ""
    },
    level: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: "menuCheckbox"
    },
    menuList: {
      type: Array,
      default: () => []
    },
    checkTargetId: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Check: () => import("./authConfigCheck")
  },
  data() {
    return {
      checkText: "全选",
      checked: false,
      allCheckFlag: false,
      gapMap: {
        menuCheckbox: 20,
        buttonCheckbox: 10
      },
      nameKeyMap: {
        menuCheckbox: "menuName",
        buttonCheckbox: "buttonName"
      },
      containerClassNameMap: {
        menuCheckbox: "auth-system-panel__checkbox-line-container",
        buttonCheckbox: "auth-system-panel__checkbox-btn-container"
      },
      checkBoxClassNameMap: {
        menuCheckbox: "auth-system-menu__checkbox-menu",
        buttonCheckbox: "auth-system-menu__checkbox-button"
      },
      classNameMap: {
        menuCheckbox: "auth-system-panel__checkbox-line",
        buttonCheckbox: "auth-system-panel__checkbox-btn"
      }
    };
  },
  methods: {
    validateButtonCheck(validateItem) {
      return validateItem.buttonName && validateItem.buttonId && !validateItem.menuType;
    },
    handleButtonAllCheck(selectItem) {
      if (this.validateButtonCheck(selectItem)) {
        const buttonListId = this.menuList.map(item => item.targetId);
        const curCheckTargetId = this.state.permissionGroupMenuRels.map(item => item.targetId);
        const allCheckId = buttonListId.every(id => curCheckTargetId.includes(id));
        this.allCheckFlag = allCheckId;
        this.checkText = allCheckId ? "取消全选" : "全选";
      }
    },
    changeCheckBox($event, selectItem, delegate = false) {
      this.$emit("changeCheckSelect", { $event, selectItem: Object.assign({}, selectItem, { menuType: this.menuType }) });
      if (delegate) return;
      this.handleButtonAllCheck(selectItem);
    },
    allCheck() {
      if (this.menuType == "menuCheckbox") return;
      this.allCheckFlag = !this.allCheckFlag;
      this.checkText = this.allCheckFlag ? "取消全选" : "全选";
      this.menuList.forEach(item => {
        this.$refs[item.targetId][0].checked = this.allCheckFlag;
        this.changeCheckBox(this.allCheckFlag, item, true);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.auth-system-menu__container {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  position: relative;
}
.auth-system-menu__checkbox {
  margin-bottom: 10px;
  margin-right: 5px;
}
.auth-system-panel__checkbox-line {
  box-sizing: border-box;
}
.auth-system-panel__checkbox-btn {
  box-sizing: border-box;
  margin-right: 5px;
  display: inline-block;
}
.auth-system-panel__checkbox-btn-container {
  padding: 15px 20px;
  border-radius: 5px;
  background: var(--f-5-f-5-f-5, #f5f5f5);
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.auth-system-menu__checkbox-menu {
  margin-bottom: 10px;
}
.auth-system-menu__checkbox-button {
  margin-right: 10px;
}
.auth-system-menu__checkbox-menu {
  color: var(--icon-text-1000000, #000);
  font-family: Microsoft YaHei;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  font-weight: 700;
}
.auth-system-menu__checkbox-button {
  color: var(--icon-text-1000000, #000);
  font-family: Microsoft YaHei;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  margin-bottom: 5px;
}
.auth-system-menu__select-all-btn {
  margin-top: -10px;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
</style>
