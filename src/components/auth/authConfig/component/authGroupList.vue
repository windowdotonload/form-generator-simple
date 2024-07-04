<template>
  <div>
    <MenuList :menuList="state.authGroupList" :activeKey="activeKey" @click="clickAuthGroupItem" />
  </div>
</template>

<script>
import { state, useAuthGroupConfig } from "../auth";
const AUTH = useAuthGroupConfig();
export default {
  components: {
    MenuList: () => import("../../component/menuList")
  },
  setup() {
    const AUTH = useAuthGroupConfig();
    const activeKey = AUTH.getActiveKey();

    return {
      state,
      activeKey
    };
  },
  methods: {
    clickAuthGroupItem(clickItem) {
      AUTH.swithActiveAuthGroupItem(clickItem);
    }
  }
};
</script>

<style lang="less" scoped></style>
