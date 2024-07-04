<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="state.certificateDialogShowVis" width="300px" class="certificate-single-container" append-to-body :show-close="false">
    <div style="background:#fff;width:230px;border-radius:6px;position:relative">
      <i class="el-icon-close" style="position:absolute;right:10px;top:5px;cursor:pointer;z-index:9" @click="closeShowSingleCertificate" />
      <div class="drawer-certificate-item">
        <img src="@/assets/certificate_bg.png" alt="" style="position:absolute;width:100%;top:0" />
        <img src="@/assets/certificate.png" alt="" style="width:80px;height:80px" />
        <div class="drawer-certificate-item-middle">
          <div class="drawer-certificate-item-name">{{ state.certificateInfo.certificateName }}</div>
          <div class="drawer-certificate-item-tip">观看视频并答题得分</div>
        </div>
        <div class="drawer-certificate-item-score">{{ state.certificateInfo.totalValue }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  inject: ["state", "actions"],

  methods: {
    closeShowSingleCertificate() {
      this.actions.closeShowSingleCertificate();
    }
  }
};
</script>

<style lang="less" scoped>
.certificate-single-container {
  /deep/ .el-dialog {
    background: transparent;
    border: none;
    box-shadow: none;
  }
}

.drawer-certificate-item {
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-wrap: wrap;
  justify-content: center;
  padding: 32px 24px;
  width: 230px;
  height: 280px;
  border: 1px solid rgba(204, 221, 255, 0.4);
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(204, 221, 255, 0.5) 0%, rgba(204, 221, 255, 0.1) 100%);

  &:nth-child(4n) {
    margin-right: 0;
  }
}

.drawer-certificate-item-middle {
  width: 100%;
  .drawer-certificate-item-name {
    color: #000;
    font-size: 15px;
    text-align: center;
    font-weight: bold;
  }
  .drawer-certificate-item-tip {
    color: #999;
    font-size: 12px;
    text-align: center;
  }
}
.drawer-certificate-item-score {
  color: #d10000;
  font-size: 20px;
  font-weight: bolder;
}
</style>
