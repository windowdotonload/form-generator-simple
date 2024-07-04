<template>
  <div class="drawer-recommend-container">
    <div class="drawer-video-detail-right-title">相关课程推荐</div>
    <div style="max-height:630px;overflow-y:auto">
      <div v-for="item in recommendList" :key="item.id" class="videocover-item-box">
        <VideoCover :coverUrl="item.coverURL" :likeCount="item.likeCount" :videoItemInfo="item" border :showRightTopFlag="item.watchStatus" @click.native="gioTrackRec(item)" />
      </div>
    </div>
    <div v-if="!loadingList && recommendList.length == 0" class="empty-text">
      <i class="el-icon-files" style="margin-right:10px" />
      暂无相关视频推荐
    </div>
  </div>
</template>

<script>
import { executeCbAfterReq, getRecommendTrainList } from "../../api/index";
import VideoCover from "./VideoCoverOnly.vue";

export default {
  components: {
    VideoCover
  },
  data() {
    return {
      loadingList: false,
      recommendList: []
    };
  },
  inject: ["state", "actions"],
  watch: {
    "state.drawerComponentParams.id"(val) {
      this.getRecommendTrainList();
    }
  },
  created() {
    this.getRecommendTrainList();
  },
  methods: {
    gioTrackRec(item) {
      this.$gio.clickRecommendTrain({
        trainName: this.state.drawerComponentParams.trainName,
        recommendTrainName: item.trainName
      });
      this.$gio.clickRelatedlubrService({
        trainName: this.state.drawerComponentParams.trainName
      });
    },
    getRecommendTrainListAction(res) {
      this.loadingList = false;
      this.recommendList = res;
    },
    getRecommendTrainList() {
      this.loadingList = true;
      const params = {
        trainId: this.state.drawerComponentParams.id
      };
      executeCbAfterReq(getRecommendTrainList, params, this.getRecommendTrainListAction);
    }
  }
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}
.drawer-recommend-container {
  position: relative;
  width: 100%;
  margin-top: 20px;
}
.drawer-video-detail-right-title {
  width: 100%;
  font-weight: 700;
  color: #000;
  font-size: 16px;
  margin-bottom: 8px;
}
.videocover-item-box {
  box-sizing: border-box;
  width: 100%;
  height: 215px;
}
.empty-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20px;
  text-align: center;
  font-size: 15px;
  margin-top: 60px;
  color: #666;
}
</style>
