<template>
  <div class="drawer-certificate-contailer" v-loading="loading">
    <template v-if="certificateList && certificateList.length">
      <div class="drawer-certificate-item" v-for="item in certificateList" :key="item.id" @click="showCertificate(item)">
        <img src="@/assets/certificate_bg.png" alt="" style="position:absolute;width:100%;top:0" />
        <img src="@/assets/certificate.png" alt="" style="width:80px;height:80px" />
        <div class="drawer-certificate-item-middle">
          <div class="drawer-certificate-item-name">{{ item.certificateName }}</div>
          <div class="drawer-certificate-item-tip">观看视频并答题得分</div>
        </div>
        <div class="drawer-certificate-item-score">{{ item.totalValue }}</div>
      </div>
    </template>
    <template v-else>
      <div class="empty-content">暂无证书</div>
    </template>
  </div>
</template>

<script>
import { executeCbAfterReq, getCertificateList } from "../../api/index";
export default {
  inject: ["state", "actions"],
  data() {
    return {
      loading: false,
      certificateList: []
    };
  },
  created() {
    this.getCertificateList();
  },
  methods: {
    getCertificateListAction(res) {
      const { certificateDtoList } = res;
      this.certificateList = certificateDtoList;
      this.loading = false;
    },
    getCertificateList() {
      this.loading = true;
      executeCbAfterReq(getCertificateList, undefined, this.getCertificateListAction);
    },
    showCertificate(item) {
      this.actions.showSingleCertificate(item);
      this.$gio.viewCertificate();
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-certificate-contailer {
  padding: 0 20px;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 80px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  .drawer-certificate-item {
    margin-right: 2%;
    box-sizing: border-box;
    display: flex;
    position: relative;
    flex-wrap: wrap;
    justify-content: center;
    padding: 32px 24px;
    width: 23%;
    height: 250px;
    border: 1px solid rgba(204, 221, 255, 0.4);
    border-radius: 6px;
    background: rgba(204, 221, 255, 0.2);
    cursor: pointer;
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
.empty-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
