<template>
  <div class="auth-system-menu__container">
    <SystemPanelRender :checkTargetId="checkTargetId" :menuList="this[`${menuType}Menu`]" :menuType="menuType" @changeCheckSelect="selectMenu" />
  </div>
</template>

<script>
import { getWebMenuList, getWechatMenuList } from "../authApi";
export default {
  components: {
    SystemPanelRender: () => import("./authConfigSystemMenuPanelRender")
  },
  props: {
    menuType: {
      type: String,
      default: ""
    },
    checkTargetId: {
      type: Array,
      default: () => []
    },
    belongSystem: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      webMenu: [],
      weChatMenu: []
    };
  },
  watch: {
    menuType: {
      handler() {
        this.getSystemMenu();
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.clearMenu();
  },
  methods: {
    clearMenu() {
      this.webMenu = [];
      this.weChatMenu = [];
    },
    async getSystemMenu() {
      const menuType = this.menuType;
      if (!menuType) return;
      if (this.menuType != this.belongSystem) return;
      this.$emit("switchSystemMenuLoading", true);
      const methodName = `get${menuType}Menu`;
      await this[methodName]();
      this.$emit("switchSystemMenuLoading", false);
    },
    async getwebMenu() {
      if (this.webMenu.length) return;
      const res = await getWebMenuList();
      if (res.data.code === 1000) {
        this.webMenu = res.data.data.list;
      }
    },
    async getweChatMenu() {
      if (this.weChatMenu.length) return;
      const res = await getWechatMenuList();
      if (res.data.code === 1000) {
        this.weChatMenu = res.data.data.list;
      }
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
  height: calc(100vh - 350px);
  padding-bottom: 10px;
  overflow: hidden;
  &::-webkit-scrollbar {
    width: 3px !important;
  }
}
</style>
