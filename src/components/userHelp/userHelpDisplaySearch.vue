<template>
  <div class="container">
    <div class="userhelp-banner">
      <img src="@/assets/logo-1.png" @click="$router.go(-1)" style="width: 220px; height: auto; padding-left: 20px';cursor:pointer" />
      <div class="split-line" />
      <p class="userhelp-text">系统使用小助手</p>
    </div>

    <div class="search-box">
      <img src="@/assets/userhelp_banner.jpg" alt="" />
      <div class="img-mask"></div>
      <p class="help-text">您需要什么帮助?</p>
      <div class="input-box">
        <el-autocomplete
          clearable
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @clear="clearAuto"
          @focus.prevent.stop="focusSearch"
          @blur.prevent.stop="blurSearch"
          @select="handleSelect"
        >
          <el-button slot="append" type="danger" color="white"> 搜索</el-button>
        </el-autocomplete>
      </div>
    </div>

    <div class="help-content-box">
      <div class="top-cate-box" v-show="showCate">
        <div class="cate-item-box" :class="{ 'cate-item-box-active': item.id == activeCate.id }"  v-if="item.title!='回顾报告'"   v-for="item in cateList" :key="item.id" @click="changeCate(item)">
          <div >{{ item.title }}</div>
        </div>
      </div>
      <div v-loading="contentListLoading" class="content-box-container">
        <div class="empty-content-box" v-if="contentList.length === 0">
          <img src="@/assets/empty_search_content.png" alt="" />
          <p>暂无搜索结果</p>
        </div>
        <div v-if="!focusSearchFlag || state">
          <div class="content-item-box" v-for="item in contentList" :key="item.id" @click="toContent($event, item)">
            <img style="margin-right: 12px" src="@/assets/help-display-content-icon.png" alt="" />
            {{ item.title }}
          </div>
        </div>
        <div v-show="focusSearchFlag && !state" @click="recordClickPosition">
          <div class="content-item-box" v-for="item in recommendList" :key="item.id" @click.stop="toContent($event, item)">
            <img style="margin-right: 12px" src="@/assets/help-display-content-icon.png" alt="" />
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let wheelEvent = cateBox => {
  return e => {
    e.stopPropagation();
    e.preventDefault();
    const { wheelDeltaY } = e;

    if (wheelDeltaY < 0) {
      cateBox.scrollLeft += Math.abs(wheelDeltaY) * 0.5;
    } else {
      cateBox.scrollLeft -= Math.abs(wheelDeltaY) * 0.5;
    }
  };
};
export default {
  async mounted() {
    const cateBox = document.getElementsByClassName("top-cate-box")[0];
    this.wheelEventListener = wheelEvent(cateBox);
    cateBox.addEventListener("wheel", this.wheelEventListener);
    const cateListData = await this.requestMethodGet("/help/center/queryHelpClassListByPage", {
      isConfPage: 0,
      size: 999,
      current: 1
    });
    if (cateListData.data.data.list.length == 0) {
      this.showCate = false;
    }
    this.cateList = cateListData.data.data.list.splice(1);
    this.activeCate = this.$store.state.userHelpDisplayActiveItem ? this.$store.state.userHelpDisplayActiveItem : this.cateList[0];
    if (!this.$store.state.userHelpDisplayActiveItem) {
      this.$store.commit("changeUserHelpDisplayActiveItem", this.cateList[0]);
    }
    this.changeCate(this.activeCate);

    const recommendListBackend = await this.requestMethodGet("help/center/queryHelpContentListByPage", { current: 1, size: 999, isConfPage: 0, recommend: 1 });
    this.recommendList = recommendListBackend.data.data.list;
  },
  data() {
    return {
      wheelEventListener: null,
      activeCate: null,
      showCate: true,
      state: "",
      timeout: null,
      cateList: [],
      contentList: [],
      contentListLoading: false,
      recommendList: [],
      focusSearchFlag: false
    };
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      cb([]);
      if (!queryString) {
        this.changeCate(this.activeCate);
        return;
      }
      await this.changeCate(this.activeCate, {
        title: queryString
      });
      this.showCate = false;
    },
    focusSearch() {
      this.focusSearchFlag = true;
      this.showCate = false;
    },
    blurSearch(e) {
      setTimeout(() => {
        this.focusSearchFlag = false;
        if (!this.state) {
          this.showCate = true;
        }
      }, 100);
    },
    recordClickPosition(e) {},
    clearAuto() {
      if (!this.focusSearchFlag) {
        this.showCate = true;
      }
    },
    handleSelect(item) {},
    toContent(e, contentItem) {
      if (e) {
        e.stopPropagation();
      }

      if (contentItem.contentType == 1) {
        window.open(contentItem.path, "_blank");
      } else {
        this.$store.commit("changeUserHelpDisplayContentItem", contentItem);
        this.$store.commit("changeUserHelpState", "Content");
      }
      this.$gio.clickSearchResult({
        searchSource:"搜索"
      });
    },
    async changeCate(cateItem, search) {
      if (!cateItem) return;
      this.contentListLoading = true;
      this.activeCate = cateItem;
      const res = await this.requestMethodGet("/help/center/queryHelpContentListByPage", {
        isConfPage: 0,
        classId: search ? undefined : cateItem.id,
        ...search
      });

      this.$store.commit("changeUserHelpDisplayActiveItem", cateItem);

      this.contentListLoading = false;
      this.contentList = res.data.data.list;
      this.$gio.searchUserGuide({
        keyword: search ? search.title : ""
      });
      this.$gio.clickGuideMenuButton({
        guideMenu: cateItem.title
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
}
.userhelp-banner {
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 60px;
  line-height: 60px;

  .split-line {
    width: 1px;
    height: 16px;
    margin: 0 16px;
    background: rgb(233, 233, 233);
  }

  .userhelp-text {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: bolder;
  }
}
.search-box {
  width: 100%;
  height: 240px;
  overflow: hidden;
  position: relative;
  display: flex;

  .img-mask {
    position: absolute;
    top: 0;
    width: 100%;
    height: 240px;
    background: rgba(0, 20, 80, 0.7);
  }
  .help-text {
    margin: 0;
    top: 72px;
    position: absolute;
    color: white;
    width: 100%;
    text-align: center;
    line-height: 20px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 20px;
  }

  .input-box {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 124px;
  }

  /deep/ .el-input-group__append {
    border: none;
    background: #dd0000;
  }
  /deep/ .el-button {
    width: 88px;
    span {
      font-size: 14px;
      color: white !important;
    }
  }
  /deep/ .el-autocomplete {
    width: 560px;
  }
}
.help-content-box {
  width: 46%;
  height: 100px;
  padding-top: 20px;
  margin: 0 auto;

  .top-cate-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    overflow-x: auto;
    margin-bottom: 20px;
  }

  .top-cate-box::-webkit-scrollbar {
    height: 3px;
  }

  .cate-item-box {
    min-width: 80px;
    height: 32px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    cursor: pointer;
  }
  .cate-item-box:hover {
    font-family: MicrosoftYaHei;
    background: #dd0000;
    color: rgb(255, 255, 255);
  }
  .cate-item-box-active {
    font-family: MicrosoftYaHei;
    background: #dd0000;
    color: rgb(255, 255, 255);
  }

  .content-item-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 56px;
    line-height: 56px;
    color: rgb(51, 51, 51);
    font-size: 14px;
    font-family: MicrosoftYaHei;
    border-bottom: 1px solid #e9e9e9;
    padding-left: 10px;
    &:hover {
      cursor: pointer;
      background: #f2f2f2;
    }
  }

  .content-box-container {
    width: 100%;
    padding-bottom: 20px;
    min-height: 300px;

    .empty-content-box {
      width: 100%;
      height: 500px;
      flex-direction: column;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin-bottom: 5%;
      p {
        margin: 0;
        width: 100%;
        font-size: 13px;
        color: rgb(153, 153, 153);
        text-align: center;
      }
    }
  }
}
</style>
