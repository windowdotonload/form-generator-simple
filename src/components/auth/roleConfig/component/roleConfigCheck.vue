<template>
  <span style="padding: 0;margin: 0;margin-right: 5px;">
    <el-checkbox v-bind="checkStatus" v-model="checkMap[checkItem.id]" :class="checkBoxClassNameMap[type]" @change="changeCheckBox($event, item)">{{ checkItem.name }}</el-checkbox>
  </span>
</template>

<script>
import { state } from "../role";
export default {
  setup() {
    return {
      state
    };
  },
  props: {
    checkItem: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: "menuCheckbox"
    },
    allCheckFlag: {
      type: Boolean,
      defafult: false
    },
    parentCheckItem: {
      type: Object,
      default: () => ({})
    },
    checkMap: {
      type: Object,
      default: () => ({})
    },
    changeCheckMap: {
      type: Object
    },
    switchAtiveItem: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    checkStatus() {
      if (this.checkItem.level == 2) return;
      let disabled = false;
      let indeterminate = false;
      if (!this.checkItem.children || (this.checkItem.children && !this.checkItem.children.length)) disabled = true;
      if (this.checkItem.children && this.checkItem.children.length) {
        indeterminate = this.checkItem.children.some(child => this.checkMap[child.id]);
        if (indeterminate) {
          const isAllSelect = this.checkItem.children.every(child => this.checkMap[child.id]);
          if (isAllSelect) indeterminate = false;
        }
      }
      return {
        disabled,
        indeterminate
      };
    }
  },
  data() {
    return {
      checked: false,
      nameKeyMap: {
        menuCheckbox: "menuName",
        buttonCheckbox: "buttonName"
      },
      checkBoxClassNameMap: {
        menuCheckbox: "auth-system-menu__checkbox-menu",
        buttonCheckbox: "auth-system-menu__checkbox-button"
      }
    };
  },
  watch: {
    switchAtiveItem(val) {
      // active roleAuthItem change
      // If needed in the future
    }
  },
  beforeMount() {
    this.revertCheckBox();
  },
  methods: {
    changeCheckBox($event, selectItem = this.checkItem) {
      this.changeCheckMap($event, selectItem);
      if (selectItem.level == 2 && this.parentCheckItem) {
        const parentCheckFlag = this.parentCheckItem.children.every(child => this.checkMap[child.id]);
        this.changeCheckMap(parentCheckFlag, this.parentCheckItem);
      } else if (selectItem.level == 1 && selectItem.children && selectItem.children.length) {
        selectItem.children.forEach(child => {
          this.changeCheckMap($event, child);
        });
      }
    },
    revertCheckBox() {
      if (!this.state) return;
      if (!this.state.activeRoleItem) return;
      const checkGroupIds = this.state.activeRoleItem.checkMenuGroupRuleRels.map(item => item.menuGroupId);
      if (checkGroupIds) {
        if (this.checkItem.level == 2) {
          if (checkGroupIds.includes(this.checkItem.id)) this.changeCheckMap(true, this.checkItem);
        } else if (this.checkItem.level == 1) {
          if (this.checkItem.children && this.checkItem.children.length) {
            const checkFlag = this.checkItem.children.every(child => checkGroupIds.includes(child.id));
            this.changeCheckMap(checkFlag, this.checkItem);
          }
        }
      }
    },
    switchCheck(check) {
      this.checked = check;
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
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
</style>
