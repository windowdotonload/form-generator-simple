<template>
  <div class="footer-bar">
    <el-button plain size="small" @click="toolkitBack">返回</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    toolkitBack() {
      this.$store.commit("Toolkit/toolkitBreadcrumbBack");
    },
  },
};
</script>

<style lang="less" scoped>
.footer-bar {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>