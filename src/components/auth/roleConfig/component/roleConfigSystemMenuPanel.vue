<template>
  <div class="auth-system-menu__container">
    <SystemPanelRender :checkMap="checkMap" :switchAtiveItem="switchAtiveItem" :changeCheckMap="changeCheckMap" :checkTargetId="checkTargetId" :menuList="menuList" @changeCheckSelect="selectMenu" />
  </div>
</template>

<script>
export default {
  components: {
    SystemPanelRender: () => import("./roleConfigSystemMenuPanelRender")
  },
  props: {
    checkTargetId: {
      type: Array,
      default: () => []
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkMap: {},
      switchAtiveItem: false
    };
  },
  methods: {
    refreshCheckMap(switchAtiveItem) {
      this.checkMap = {};
      this.switchAtiveItem = { ...switchAtiveItem };
    },
    changeCheckMap(check, selectItem) {
      this.checkMap[selectItem.id] = check;
      this.checkMap = Object.assign({}, this.checkMap);
      this.$emit("changeCheckSelect", {
        checkMap: Object.assign({}, this.checkMap),
        selectItem
      });
    },
    selectMenu($event) {
      this.$emit("changeCheckSelect", $event);
    }
  }
};
</script>

<style lang="less" scoped>
.auth-system-menu__container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding-right: 6px;
  height: fit-content;
  min-height: 100px;
  padding-bottom: 10px;
  overflow: hidden;
  &::-webkit-scrollbar {
    width: 3px !important;
  }
}
</style>
