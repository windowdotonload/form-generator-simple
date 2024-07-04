<template>
  <Layout v-loading="state.roleContainerLoading">
    <template #buttonGroup>
      <CreateAuthGroupBtn />
    </template>
    <template #leftMenu v-if="state.roleList.length">
      <LeftMenu :menuList="state.roleList" />
    </template>
    <template #content v-if="state.roleList.length && state.activeRoleItem">
      <ConfigPanel />
    </template>
    <Empty emptyText="暂无权限信息" v-if="!state.roleList.length">
      <CreateAuthGroupBtn />
    </Empty>
  </Layout>
</template>

<script>
import { state, useRoleConfig } from "./role.js";
export default {
  components: {
    Empty: () => import("../component/empty"),
    Layout: () => import("../component/layout"),
    LeftMenu: () => import("./component/authGroupList"),
    CreateAuthGroupBtn: () => import("./component/createButton"),
    ConfigPanel: () => import("./component/authConfigPanel")
  },
  created() {
    useRoleConfig().getRoleList();
  },
  beforeDestroy() {
    useRoleConfig().clearState();
  },
  setup() {
    const ROLE = useRoleConfig();
    const activeKey = ROLE.getActiveKey();
    return {
      state,
      activeKey
    };
  }
};
</script>

<style lang="less" scoped></style>
