<template>
  <div class="train_header_container">
    <div class="train_header_card" v-for="item in cardList" :key="item.title">
      <div class="train_header_leftshow_section">
        <img :src="item.icon" alt="" />
        <div class="train_header_leftshow_section_clerk">
          <span class="train_header_leftshow_section_clerk_item ">{{ item.title }}</span>
          <span class="train_header_leftshow_section_clerk_item">{{ $data[item.totalShowKey].toFixed(0) }}</span>
        </div>
      </div>
      <div class="train_header_rightop_section">
        <el-button size="mini" type="danger" plain v-if="item.needOp" @click="viewCertificate">{{ item.opText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainOverview, executeCbAfterReq } from "../../api/index";
import headerIcon1 from "../../../../assets/train_header1.png";
import headerIcon2 from "../../../../assets/train_header2.png";
import headerIcon3 from "../../../../assets/train_header3.png";

export default {
  inject: ["state", "actions"],
  data() {
    return {
      totalCount: 0,
      finishCount: 0,
      certificateCount: 0,
      cardList: [
        {
          icon: headerIcon1,
          title: "培训总数",
          total: 0,
          totalShowKey: "totalCount"
        },
        {
          icon: headerIcon2,
          title: "已看数",
          total: 0,
          totalShowKey: "finishCount"
        },
        {
          needOp: true,
          opText: "查看",
          icon: headerIcon3,
          title: "已获得证书",
          total: 0,
          totalShowKey: "certificateCount"
        }
      ]
    };
  },

  watch: {
    "state.refreshHeaderOverviewData"() {
      this.getHeaderOverview();
    }
  },
  created() {
    this.watchData();
    this.getHeaderOverview();
  },
  methods: {
    watchData() {
      this.$watch(
        () => `${this.cardList[0].total}-${this.cardList[1].total}-${this.cardList[2].total}`,
        val => {
          const arr = val.split("-");
          gsap.to(this.$data, { duration: 0.8, totalCount: parseInt(arr[0]) });
          gsap.to(this.$data, { duration: 0.8, finishCount: parseInt(arr[1]) });
          gsap.to(this.$data, { duration: 0.8, certificateCount: parseInt(arr[2]) });
        }
      );
    },
    getHeaderOverviewAction(res) {
      this.cardList[0].total = res.totalCount;
      this.cardList[1].total = res.finishCount;
      this.cardList[2].total = res.certificateCount;
    },
    getHeaderOverview() {
      executeCbAfterReq(getTrainOverview, undefined, this.getHeaderOverviewAction);
    },
    viewCertificate() {
      this.actions.openDrawer({
        drawerComponent: "DrawerCertificateDetail",
        title: "我的证书列表"
      });
      this.$gio.clickCertificate();
      this.$gio.toCertificateList();
    }
  }
};
</script>

<style lang="less" scoped>
.train_header_container {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}
.train_header_card {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 20px;
  width: 29%;
  border-radius: 10px;
  border: 1px solid #e9e9e9;
}
.train_header_leftshow_section {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  height: 100%;
}
.train_header_leftshow_section_clerk {
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
}
.train_header_leftshow_section_clerk_item {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 13px;
}
.train_header_leftshow_section_clerk_item:first-child {
  color: #666;
}
.train_header_leftshow_section_clerk_item:last-child {
  color: #333;
  margin-bottom: 0;
  font-size: 23px;
  font-weight: bold;
}
.train_header_rightop_section {
  display: flex;
  align-items: center;
}
</style>
