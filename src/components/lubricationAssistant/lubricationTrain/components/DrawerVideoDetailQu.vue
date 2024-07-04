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
import { polling } from "../utils/pollingQA";
export default {
  inject: ["state", "actions"],
  data() {
    return {
      stage: 0,
      src: "",
      QADialogVisible: false,
      loadingQAFeedBack: false
    };
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.QADialogVisible = false;
      this.loadingQAFeedBack = false;
      this.src = "";
      this.stage = 0;
    },
    pollingCb(res) {
      if (res.code == 1000) {
        const { detailRes } = res;
        const { data } = detailRes;
        const copyObj = JSON.parse(JSON.stringify(this.state.drawerComponentParams));
        copyObj.totalValue = data.data.totalValue;
        copyObj.fullScore = data.data.fullScore;
        this.actions.setDrawerComponentParams(copyObj);
        this.actions.refreshHeaderOverviewData();
        if (data.data.totalValue != null && data.data.totalValue >= data.data.certificateScore && data.data.certificateFlag == 1) {
          this.actions.delayExec(() => this.actions.showSingleCertificate(data.data));
        }
      }
      this.closeDialog();
    },
    openQuestion(src) {
      this.src = src;
      this.QADialogVisible = true;
      this.$nextTick(() => {
        this.$refs.trainQAIframe.onload = () => {
          this.stage++;
          if (this.stage == 2) {
            this.loadingQAFeedBack = true;
            polling(this.state.drawerComponentParams, this.pollingCb);
          }
        };
      });
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
