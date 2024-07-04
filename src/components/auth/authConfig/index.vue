<template>
  <Layout v-loading="state.loadingLayout">
    <template #buttonGroup>
      <CreateAuthGroupBtn />
    </template>
    <template #leftMenu v-if="state.authGroupList && state.authGroupList.length">
      <LeftMenu :menuList="state.authGroupList" />
    </template>
    <template #content v-if="activeKey && state.authGroupList.length">
      <ConfigPanel />
    </template>
    <Empty emptyText="暂无权限信息" v-if="!state.authGroupList.length && !state.loadingLayout">
      <CreateAuthGroupBtn />
    </Empty>
  </Layout>
</template>

<script>
import { state, useAuthGroupConfig } from "./auth.js";
export default {
  components: {
    Empty: () => import("../component/empty"),
    Layout: () => import("../component/layout"),
    LeftMenu: () => import("./component/authGroupList"),
    CreateAuthGroupBtn: () => import("./component/createButton"),
    ConfigPanel: () => import("./component/authConfigPanel")
  },
  async created() {
    useAuthGroupConfig().getAuthGroup();
  },
  setup() {
    const AUTH = useAuthGroupConfig();
    const activeKey = AUTH.getActiveKey();

    return {
      state,
      activeKey
    };
  }
};
</script>

<style lang="less" scoped>
.empty {
  position: relative;
  width: 100%;
  height: 80%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
