<template>
  <span style="padding: 0;margin: 0;margin-right: 5px;">
    <el-checkbox :menuType="menuType" v-on="$listeners" v-model="checked" :class="checkBoxClassNameMap[type]">{{ checkItem[nameKeyMap[type]] }}</el-checkbox>
  </span>
</template>

<script>
export default {
  props: {
    checkItem: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: "menuCheckbox"
    },
    checkTargetId: {
      type: Array,
      default: () => []
    },
    menuType: {
      type: String,
      default: ""
    },
    allCheckFlag: {
      typeof: Boolean,
      default: false
    }
  },
  created() {
    this.initCheck();
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
  methods: {
    initCheck() {
      if (this.checkTargetId.includes(this.checkItem.targetId)) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.$parent.changeCheckBox(this.checked, this.checkItem);
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
