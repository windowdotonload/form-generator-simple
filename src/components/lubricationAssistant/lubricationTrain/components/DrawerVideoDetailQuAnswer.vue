<template>
  <div class="train-qa-container">
    <el-dialog
      width="50%"
      center
      :modal="false"
      :visible.sync="QADialogVisible"
      :show-close="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :top="loadingQAFeedBack ? '35px' : '16px'"
      @closed="closeDialog"
    >
      <div style="width:100%;height:100%" v-loading="loadingQAFeedBack">
        <i class="el-icon-close" style="float:right;margin-right:10px;margin-bottom:3px;cursor:pointer" @click="closeDialog" />
        <iframe v-if="QADialogVisible" :src="src" frameborder="0" class="train-qa-iframe" ref="trainQAIframe"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["state", "actions"],
  data() {
    return {
      src: "",
      QADialogVisible: false
    };
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.QADialogVisible = false;
      this.src = "";
    },
    openQuestion(src) {
      this.src = src;
      this.QADialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.train-qa-container {
  position: relative;

  /deep/ .el-dialog__wrapper {
    overflow: hidden;
  }
  /deep/ .el-dialog {
    padding: 0;
    position: relative;
    border-radius: 12px;
    height: 95vh;
    overflow: hidden;
  }
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .el-dialog__body {
    padding: 5px;
    padding-top: 10px;
  }
}
.train-qa-iframe {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: 90vh;
  border-radius: 12px;
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
