<template>
  <el-drawer :wrapperClosable="false" :title="state.drawerTitle" :visible.sync="state.drawerVisable" :before-close="closeDrawer" :size="state.drawerWidth">
    <div class="drawer-mask" v-loading="state.drawerLoading">
      <components :is="state.drawerComponent" element-loading-spinner="el-icon-loading" />
    </div>
    <SingleCertificate v-if="state.certificateDialogShowVis" />
  </el-drawer>
</template>

<script>
export default {
  inject: ["state", "actions"],
  components: {
    DrawerVideoDetail: () => import("./DrawerVideoDetail.vue"),
    DrawerCertificateDetail: () => import("./DrawerCertificateDetail.vue"),
    SingleCertificate: () => import("./DrawerShowCertificateSingle.vue")
  },
  data() {
    return {};
  },
  methods: {
    closeDrawer() {
      this.actions.closeDrawer();
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-mask {
  width: 100%;
  height: calc(100vh - 66px);
}
</style>
