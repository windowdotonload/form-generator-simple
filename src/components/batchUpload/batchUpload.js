export default {
  methods: {
    // 批量导入报告
    handleBatchUpload (val, sta) {
      this.$refs.batchUpload.openDrawer(val, sta)
    }
  }
}
