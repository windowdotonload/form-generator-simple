<template>
  <div class="drawer-video-detail-container">
    <!-- 右侧 -->
    <div class="drawer-video-detail-left-section">
      <div class="drawer-video-detail-title">{{ state.drawerComponentParams.trainName }}</div>
      <div class="video-box">
        <OSSVideoPlayer v-if="realPlayUrl" :playUrl="realPlayUrl" @closed="closedVideo" ref="OSSCOVideo" />
      </div>
      <div class="drawer-video-like-bar">
        <img :src="state.drawerComponentParams.likeStatus ? likeIconActive : likeIcon" style="cursor:pointer" @click="likeOp" />
        <span>{{ state.drawerComponentParams.likeCount }}</span>
        <img @click="scoreOp" :src="state.drawerComponentParams.grade ? scoreActive : score" style="cursor:pointer;width:20px;height:20px;margin-bottom:-2px" />
        <span style="cursor:pointer" @click="scoreOp">打分</span>
      </div>
      <div style="box-sizing:border-box;padding:10px;padding-top:0px;color:#999;font-size:15px;margin-top:8px">
        {{ state.drawerComponentParams.trainContent }}
      </div>
      <!-- 随堂测试块 -->
      <TestBar v-if="state.drawerComponentParams.testUrl" />

      <!-- 底部TAB -->
      <TabSection />
    </div>

    <!-- 左侧 -->
    <div class="drawer-video-detail-right-section">
      <template v-if="state.drawerComponentParams.trainChapterDtoList && state.drawerComponentParams.trainChapterDtoList[0].chapterName && state.drawerComponentParams.trainChapterDtoList.length > 0">
        <div class="drawer-video-detail-right-title">目录</div>
        <div style="max-height:280px;overflow-y:auto;margin-top:10px">
          <div
            class="catalogue-item"
            :class="state.drawerComponentParams.videoId == item.videoId ? 'active-playing' : ''"
            v-for="(item, index) in state.drawerComponentParams.trainChapterDtoList"
            :key="item.id"
            @click="switchChapter(item)"
          >
            <div class="catalogue-item-left">
              <div class="catalogue-item-left-index">{{ (index + 1).toString().length == 1 ? "0" + parseInt(index + 1) : index }}</div>
              <div class="catalogue-item-left-cataname">
                <div style="margin-bottom:5px">{{ item.chapterName }}</div>
                <div>观看至{{ item.progress }}%</div>
              </div>
            </div>
            <div class="catalogue-item-right">{{ state.drawerComponentParams.videoId == item.videoId ? "播放中" : item.watchStatus == 1 ? "已看" : "" }}</div>
          </div>
        </div>
      </template>

      <RecommendList />
      <ScoreBox ref="ScoreBox" />
    </div>
  </div>
</template>

<script>
import { executeCbAfterReq, getTrainVideoPlayerUrl, saveWatchTime, giveALikeOrCancel, getTrainDetail } from "../../api/index";
import likeIcon from "@/assets/trainLike.png";
import likeIconActive from "@/assets/trainLikeActive.png";
import score from "@/assets/xingxing.png";
import scoreActive from "@/assets/xingxing_1.png";

export default {
  inject: ["state", "actions"],
  components: {
    OSSVideoPlayer: () => import("../../../../generalComponents/OSSVideoPlayer/index.vue"),
    TabSection: () => import("./DrawerVideoDetailTabSection.vue"),
    RecommendList: () => import("./DrawerVideoDetailRecommendList.vue"),
    TestBar: () => import("./DrawerVideoDetailTestBar.vue"),
    ScoreBox: () => import("./DrawerVideoDetailScoreBox.vue")
  },
  data() {
    return {
      likeIcon,
      likeIconActive,
      score,
      scoreActive,
      playInfoList: null
    };
  },
  watch: {
    "state.drawerComponentParams.videoId": {
      handler() {
        this.getTrainVideoPlayUrl();
      }
    }
  },
  created() {
    /***
     * 【this.state.drawerComponentParams】  ---  detail info of video when drawer opening
     *  */
    this.getTrainVideoPlayUrl();
  },
  beforeDestroy() {
    this.actions.refreshHeaderOverviewData();
  },
  computed: {
    realPlayUrl() {
      return this.playInfoList ? this.playInfoList[0].playURL : null;
    }
  },
  methods: {
    scoreOp() {
      this.$refs.ScoreBox.openBox(this.state.drawerComponentParams.grade);
      this.$gio.clickGrade({
        trainName: this.state.drawerComponentParams.trainName
      });
    },
    async likeOp() {
      const params = {
        trainId: this.state.drawerComponentParams.id,
        likeFlag: !this.state.drawerComponentParams.likeStatus
      };
      this.state.drawerComponentParams.likeStatus = !this.state.drawerComponentParams.likeStatus;
      this.state.drawerComponentParams.likeCount = this.state.drawerComponentParams.likeStatus ? this.state.drawerComponentParams.likeCount + 1 : this.state.drawerComponentParams.likeCount - 1;
      await giveALikeOrCancel(params);
      this.$gio.likeTrain({
        trainName: this.tate.drawerComponentParams.trainName,
        likeTrain: params.likeFlag ? "点赞" : "取消点赞"
      });
    },
    closedVideo(ossVideo) {
      if (this.state.drawerVisable) return;
      const params = {
        chapterId: this.state.chapteId,
        duration: ossVideo.currentTime
      };
      saveWatchTime(params);
    },
    getTrainVideoPlayUrlAction(res) {
      const { playInfoList } = res;
      this.playInfoList = playInfoList;
      this.actions.endLoadingDrawer();
    },

    getTrainVideoPlayUrl() {
      this.actions.loadingDrawer();
      const params = {
        videoId: this.state.drawerComponentParams.videoId
      };
      executeCbAfterReq(getTrainVideoPlayerUrl, params, this.getTrainVideoPlayUrlAction);
    },
    async traceVideoDuration() {
      await this.$refs.OSSCOVideo.saveWatchDuration(this.state.chapteId);
      const res = await getTrainDetail({ trainId: this.state.drawerComponentParams.id });
      this.actions.setDrawerComponentParams(res.data.data);
    },
    async switchChapter(item) {
      if (this.state.drawerComponentParams.videoId == item.videoId) return;
      this.actions.loadingDrawer();
      await this.traceVideoDuration();
      this.state.chapteId = item.id;
      const params = {
        videoId: item.videoId
      };
      this.playInfoList = null;
      this.state.drawerComponentParams.videoId = item.videoId;
      executeCbAfterReq(getTrainVideoPlayerUrl, params, this.getTrainVideoPlayUrlAction);
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-video-detail-container {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  padding: 20px;
  padding-top: 0;
  padding-right: 0;
}
.drawer-video-detail-right-section {
  box-sizing: border-box;
  padding: 0;
  width: 30%;
  margin-right: 20px;
  height: calc(100vh - 66px);
  overflow-y: auto;

  padding-bottom: 30px;
}
.drawer-video-detail-left-section {
  box-sizing: border-box;
  padding: 0;
  width: 69%;
  margin-right: 20px;
  height: calc(100vh - 66px);
  overflow-y: auto;
  padding-bottom: 30px;
}
.drawer-video-detail-title {
  padding-left: 5px;
  color: #000;
  font-weight: 700;
  font-size: 21px;
}
.video-box {
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 376px;
  background: rgba(0, 0, 0);
  border-radius: 12px;
}
.drawer-video-like-bar {
  padding: 15px;
  display: flex;
  align-items: center;
  height: 30px;
  padding-bottom: 0;
  span {
    display: inline-block;
    height: 15px;
    line-height: 20px;
    margin-left: 10px;
    margin-right: 30px;
  }
}

::-webkit-scrollbar {
  display: none;
}
.drawer-video-detail-right-title {
  font-weight: 700;
  color: #000;
  font-size: 16px;
}
.catalogue-item {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12px 16px;
  width: 100%;
  height: 60px;
  background: #f9f9f9;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  margin: 10px 0;
  cursor: pointer;
}
.catalogue-item-left {
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  width: 70%;
  align-items: center;
  .catalogue-item-left-index {
    font-weight: 700;
    font-size: 15px;
    margin-right: 10px;
  }
  .catalogue-item-left-cataname {
    font-size: 13px;
  }
}
.catalogue-item-right {
  display: flex;
  widows: 30%;
  align-items: center;
  font-size: 15px;
}
.video-box {
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 376px;
  background: rgba(0, 0, 0);
  border-radius: 12px;
}
.active-playing {
  background: rgba(0, 136, 136, 0.05);
  border: 1px solid rgba(0, 136, 136, 0.1);
  border-radius: 4px;
  .catalogue-item-left-index,
  .catalogue-item-right {
    color: #008888;
  }
  .catalogue-item-left-cataname {
    div:first-child {
      color: #008888;
    }
  }
}
</style>
