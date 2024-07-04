<template>
  <div>
    <MenuList :menuList="menuList" lableKeyName="accessTemplateName" :activeKey="state.activeRoleItem.id" @click="clickAuthGroupItem" />
  </div>
</template>

<script>
import { openLoading, closeLoading } from "../../../../api/request.js";
import { state, useRoleConfig } from "../role.js";
export default {
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MenuList: () => import("../../component/menuList")
  },
  setup() {
    return {
      state
    };
  },
  methods: {
    async clickAuthGroupItem(clickItem) {
      closeLoading();
      await useRoleConfig().getRoleList();
      openLoading();
      useRoleConfig().swithActiveRoleItem(clickItem);
    }
  }
};
</script>

<style lang="less" scoped></style>
