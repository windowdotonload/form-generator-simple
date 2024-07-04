<template>
  <div class="video-cover-container">
    <div class="right-top-flag" v-if="showRightTopFlag">已看</div>
    <el-image :src="coverUrl" alt="" class="video-cover-img" fit="contain">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>

    <img class="pause-icon" :src="pauseIcon" alt="" @click="getTrainDetailDrawer" />

    <div class="video-cover-info" :class="border ? 'border-box' : ''">
      <div style="font-size:15px;color:#333;margin-bottom:3px" class="video-name">{{ videoItemInfo.trainName }}</div>
      <div style="font-size:13px;color:#999">{{ likeCount }}人 已赞</div>
    </div>
  </div>
</template>

<script>
import pauseIcon from "../../../../assets/train_pause.png";
import { executeCbAfterReq, getTrainDetail } from "../../api/index";
export default {
  inject: ["state", "actions"],
  props: {
    videoItemInfo: {
      type: Object
    },
    coverUrl: {
      type: String,
      required: true
    },
    likeCount: {
      type: Number,
      default: 0
    },
    border: {
      type: Boolean,
      default: false
    },
    showRightTopFlag: {
      type: Boolean,
      default: false
    },
    callBack: {
      type: Function,
      default: () => "_"
    }
  },
  data() {
    return {
      pauseIcon
    };
  },

  methods: {
    getTrainDetailDrawerActions(res) {
      const copyDrawerComponentParams = JSON.parse(JSON.stringify(this.state.drawerComponentParams));
      Object.keys(res).forEach(key => {
        if ((res[key] && !copyDrawerComponentParams[key]) || (res[key] && res[key] != copyDrawerComponentParams[key])) {
          copyDrawerComponentParams[key] = res[key];
        }
      });
      this.actions.setDrawerComponentParams(copyDrawerComponentParams);
    },
    async getTrainDetailDrawer() {
      let itemDetail = null;
      if (!this.videoItemInfo.trainChapterDtoList) {
        this.actions.loadingDrawer();
        itemDetail = await getTrainDetail({ trainId: this.videoItemInfo.id });
        this.videoItemInfo.trainChapterDtoList = itemDetail.data.data.trainChapterDtoList;
        this.actions.endLoadingDrawer();
      }
      this.actions.openDrawer({
        title: "润滑在线课程详情",
        chapteId: this.videoItemInfo.trainChapterDtoList[0].id,
        drawerComponent: "DrawerVideoDetail",
        drawerComponentParams: this.videoItemInfo
      });
      const { id } = this.videoItemInfo;
      const params = {
        trainId: id
      };
      executeCbAfterReq(getTrainDetail, params, this.getTrainDetailDrawerActions);
      this.$gio.toTrainDetailsPage({
        entrance: this.border ? "相关课程" : "课程列表",
        trainName: this.videoItemInfo.trainName
      });
    }
  }
};
</script>

<style lang="less" scoped>
.video-cover-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 8px 8px 0px 0px;
  .right-top-flag {
    position: absolute;
    top: 0;
    right: 0;
    background: #d10000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    color: #ffffff;
    border-bottom-left-radius: 8px;
    font-size: 12px;
    padding: 5px 10px;
  }
}
.video-cover-img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 130px;
  width: 100%;
  background: #000;
}
.video-cover-info {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #ffffff;
  border-radius: 0px 0px 8px 8px;
  box-sizing: border-box;
  padding: 10px 16px;
  font-size: 13px;
}
.pause-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 126px;
  position: absolute;
  cursor: pointer;
}
.video-name {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.border-box {
  box-shadow: 0 0 5px rgba(153, 153, 153, 0.5);
}
</style>
