<template>
  <div :class="containerClassNameMap[type]" class="auth-system-menu__container" :style="{ paddingLeft: `${level * gapMap[type]}px` }">
    <div :class="classNameMap[type]" v-for="item in menuList" :key="item.menuId">
      <Check
        :switchAtiveItem="switchAtiveItem"
        :checkMap="checkMap"
        :changeCheckMap="changeCheckMap"
        :parentCheckItem="parentCheckItem"
        :checkItem="item"
        :type="type"
        :checkTargetId="checkTargetId"
        :allCheckFlag="allCheckFlag"
      />

      <SystemPanelRender
        v-if="item.children && item.children.length"
        type="buttonCheckbox"
        :switchAtiveItem="switchAtiveItem"
        :parentCheckItem="item"
        :menuList="item.children"
        :level="level + 1"
        :checkMap="checkMap"
        :changeCheckMap="changeCheckMap"
        v-on="$listeners"
        v-bind="$props"
      />
    </div>
  </div>
</template>

<script>
export default {
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
    },
    parentCheckItem: {
      type: Object,
      default: null
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
  components: {
    Check: () => import("./roleConfigCheck")
  },
  data() {
    return {
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
