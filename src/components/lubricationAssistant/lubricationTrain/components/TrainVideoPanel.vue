<template>
  <div class="train-right-container">
    <div class="search-bar">
      <el-select
        @focus="focuesSelect"
        :loading="searchLoading"
        filterable
        remote
        :remote-method="searchVideo"
        class="train-search"
        size="medium"
        placeholder="请输入培训或目录"
        style="width:40%"
        suffix-icon="el-icon-search"
        v-model="searchName"
        clearable
        @clear="clearSearchName"
      >
        <el-option style="height:auto" v-for="item in searchVideoList" :key="item">
          <p class="el-select-group__title" @click="getTrainDetailDrawer(item)" v-html="showSearchItem('培训：', item.trainName)" />
          <template v-if="item.trainChapterDtoList && item.trainChapterDtoList.length > 0 && item.trainChapterDtoList[0].chapterName">
            <el-option v-for="chapteItem in item.trainChapterDtoList" :key="chapteItem">
              <p class="el-select-option__title" @click="getTrainDetailDrawer(item, chapteItem)" v-html="showSearchItem('目录：', chapteItem.chapterName)" />
            </el-option>
          </template>
        </el-option>
      </el-select>
    </div>
    <div class="train-videopanel-container" v-loading="loadingVideo">
      <transition-group name="list" mode="in-out" tag="div" class="train-videopanel-container none-box">
        <div v-for="item in videoList" :key="item.id" class="videocover-item-box">
          <VideoCover :coverUrl="item.coverURL" :likeCount="item.likeCount" :videoItemInfo="item" />
        </div>
      </transition-group>

      <div v-if="!loadingVideo && videoList.length == 0" class="empty-tip">
        <i class="el-icon-warning" />
        <p style="width:100%;color:#666;text-align:center;font-size:15px">
          当前目录下暂无视频
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoPanelList, executeCbAfterReq, getTrainDetail, getTrainSearchResult } from "../../api/index";
import VideoCover from "./VideoCoverOnly.vue";
import debounce from "lodash/debounce";
export default {
  inject: ["state", "actions"],
  watch: {
    "state.activeTabId": {
      handler(val) {
        this.getTrainVideoPanelList(val);
      },
      immediate: true
    }
  },
  components: {
    VideoCover
  },
  data() {
    return {
      loadingVideo: false,
      searchName: "",
      videoList: [],
      searchLoading: false,
      searchVideoList: []
    };
  },

  methods: {
    clearSearchName() {
      this.searchVideoList = JSON.parse(JSON.stringify(this.state.cacheVideoSearchList));
    },
    selectBlur() {
      this.searchName = "";
      this.searchVideoList = JSON.parse(JSON.stringify(this.state.cacheVideoSearchList));
    },
    focuesSelect() {
      this.$nextTick().then(() => {
        document.querySelector(".el-select-dropdown__wrap ").scrollTop = 0;
      });
    },
    showSearchItem(prefix, heightLight) {
      if (!this.searchName) return prefix + heightLight;
      const match = new RegExp(this.searchName, "g");
      if (match.test(heightLight)) {
        return prefix + heightLight.replace(match, `<span style='color:#d10000'>${this.searchName}</span>`);
      } else {
        return prefix + heightLight;
      }
    },
    searchVideo(val) {
      debounce(async () => {
        if (!val) {
          this.searchName = "";
          this.searchVideoList = JSON.parse(JSON.stringify(this.state.cacheVideoSearchList));
        }
        this.searchLoading = true;
        const params = {
          current: 1,
          size: 100,
          name: val
        };
        const res = await getTrainSearchResult(params);
        this.searchLoading = false;
        this.searchName = val;
        const list = res.data.data.list;
        this.searchVideoList = list;
      }, 800)();
    },
    getTrainVideoPanelList(val) {
      if (!val) return;
      this.videoList = [];
      this.loadingVideo = true;
      const params = {
        trainType: val
      };
      this.PollingRequestVideoList(val);
    },
    PollingRequestVideoList(val) {
      const pageInfo = {
        current: 1,
        size: 5
      };
      const request = async (val, pageInfo) => {
        const params = {
          trainType: val,
          ...pageInfo
        };
        const res = await getVideoPanelList(params);
        if (pageInfo.current == 1) this.loadingVideo = false;
        this.videoList = this.videoList.concat(res.data.data.list);
        if (res.data.data.totalCount > this.videoList.length) {
          pageInfo.current++;
          request(val, pageInfo);
        } else {
          if (!this.state.cacheVideoSearchList) {
            this.actions.setCacheVideoSearchList(this.videoList);
            this.searchVideoList = JSON.parse(JSON.stringify(this.state.cacheVideoSearchList));
          }
        }
      };
      request(val, pageInfo);
    },
    getTrainDetailDrawerActions(res) {
      const copyDrawerComponentParams = JSON.parse(JSON.stringify(this.state.drawerComponentParams));
      Object.keys(res).forEach(key => {
        if ((res[key] && !copyDrawerComponentParams[key]) || (res[key] && res[key] != copyDrawerComponentParams[key])) {
          copyDrawerComponentParams[key] = res[key];
        }
      });
      this.actions.setDrawerComponentParams(copyDrawerComponentParams);
      this.selectBlur();
    },
    async getTrainDetailDrawer(item, chapteItem) {
      let itemDetail = null;
      if (!chapteItem && !item.trainChapterDtoList) {
        itemDetail = await getTrainDetail({ trainId: item.id });
      }

      const chapteId = chapteItem ? chapteItem.id : item.trainChapterDtoList ? item.trainChapterDtoList[0].id : itemDetail.data.data.trainChapterDtoList[0].id;
      this.actions.openDrawer({
        title: "润滑在线课程详情",
        drawerComponent: "DrawerVideoDetail",
        drawerComponentParams: item
      });

      this.state.drawerComponentParams.videoId = chapteItem
        ? chapteItem.videoId
        : item.videoId
        ? item.videoId
        : (item.trainChapterDtoList && item.trainChapterDtoList[0].videoId) || itemDetail.data.data.trainChapterDtoList[0].videoId;
      this.state.chapteId = chapteId;
      const { id } = item;
      const params = {
        trainId: id
      };
      executeCbAfterReq(getTrainDetail, params, this.getTrainDetailDrawerActions);
      this.$gio.toTrainDetailsPage({
        entrance: "课程搜索",
        trainName: item.trainName
      });
      this.$gio.toTrainDetailsPage({
        entrance: "润滑在线学堂列表",
        trainName: item.trainName
      });
    }
  }
};
</script>

<style lang="less" scoped>
.train-right-container {
  position: relative;
  box-sizing: border-box;
  width: 93%;
  border-radius: 0 6px 0 0;
}

.train-videopanel-container {
  margin-top: 20px;
  padding: 20px;
  padding-top: 65px;
  height: calc(100vh - 238px);
  overflow-y: auto;
  padding-left: 3%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
  background: #f2f2f2;
  box-sizing: border-box;
  border-radius: 0 6px 6px 0;
}
.videocover-item-box {
  width: 18%;
  height: 215px;
  margin-right: 2%;
}
.empty-tip {
  width: 100%;
  height: 80%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.search-bar {
  box-sizing: border-box;
  padding-left: 2.6%;
  width: 100%;
  display: flex;
  height: 60px;
  align-items: center;
  position: absolute;
  top: 20px;
  z-index: 9;
  background: #f2f2f2;
  border-radius: 6px;
}
::-webkit-scrollbar {
  display: none;
}
.train-search-option-item {
  margin: 0;
  color: #000;
}

.el-select-group__title {
  margin: 0;
  padding: 0;
  color: #000;
  font-size: 15px;
  box-sizing: border-box;
  padding-left: 0;
  cursor: pointer;
  &:hover {
    background: #f5f7fa;
  }
}
.el-select-option__title {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  color: #666;
  padding-left: 10px;
  font-weight: normal;
  &:hover {
    background: rgba(233, 233, 233, 0.6);
  }
}
/deep/ .el-select-dropdown__item.hover {
  background: transparent;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}
.list-enter {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  opacity: 0;
  display: none;
}
.none-box {
  padding: 0;
  margin: 0;
}
</style>
