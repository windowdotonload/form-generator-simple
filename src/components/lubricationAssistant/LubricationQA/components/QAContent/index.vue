<template>
  <div class="qa-content-container" :class="!loading && QAContentList.length == 0 ? 'qa-content-container-center' : ''" v-loading="loading">
    <div class="qa-search-bar">
      <el-input clearable v-model="searchName" size="mini" placeholder="请输入问题或关键词" style="width:40%;" suffix-icon="el-icon-search"></el-input>
    </div>
    <div
      v-show="!loading && ((QAContentList && QAContentList.length > 0) || (searchContentList && searchContentList.length > 0))"
      class="qa-content-list empty-content"
      :class="dataFilled ? 'list-fill-content' : ''"
      @scroll="scrollLoad"
      ref="qaContentList"
    >
      <QANormalContentList :QAContentList="QAContentList" v-show="!searching" />
      <QASerchContentList v-show="searching" :QASearchContentList="searchContentList" @flushSerchLocateNormalList="flushSerchLocateNormalList" :searchName="searchName" />
    </div>
    <div class="empty-tip" v-show="!loading && QAContentList.length == 0 && searchContentList.length == 0">
      <template v-if="!provide.activeId">
        请先选择左侧分类或在上方直接搜索
      </template>
      <template v-if="provide.activeId">
        <i class="el-icon-question" />
        此分类下暂无问答
      </template>
    </div>
  </div>
</template>

<script>
import { queryQAContent, getQAContentSearchTree, getQAContentSearchTreeToSpecificQA } from "../../../api/LubQA";
import debounce from "lodash/debounce";
export default {
  inject: ["provide"],
  watch: {
    "provide.activeId": {
      handler(val) {
        this.searchName = "";
        this.normalPageInfo = {
          size: 50,
          current: 1
        };
        if (this.provide.searchLocate) return;
        if (!val) return;
        this.QAContentList = [];
        this.getQAContentList();
      },
      immediate: true
    },
    searchName: debounce(function() {
      this.searchContentList = [];
      this.searchPageInfo = {
        size: 50,
        current: 1
      };
      if (!this.searchName) {
        this.searchContentList = [];
        this.searching = false;
        if ((!this.QAContentList || this.QAContentList.length == 0) && !this.provide.searchLocate) {
          this.resetInitNormalList();
        }
        return;
      }
      this.getSearchTree();
    }, 500)
  },
  components: {
    QANormalContentList: () => import("./QANormalContentList.vue"),
    QASerchContentList: () => import("./QASearchContentList.vue")
  },
  updated() {
    if (!this.searching && this.provide.searchLocate && this.$refs.qaContentList) {
      this.$refs.qaContentList.scrollTop = 5;
    }
  },
  data() {
    return {
      loading: false,
      QAContentList: [],
      searchContentList: [],
      searchName: "",
      normalPageInfo: {
        size: 50,
        current: 1
      },
      normalPageInfoTotal: 0,
      searchPageInfo: {
        size: 50,
        current: 1
      },
      searchPageInfoTotal: 0,
      searchLocatePageInfo: {},
      searchLocatePageInfoTotal: 0,
      searching: false,
      searchLocateSecondIdRecord: "",
      searchLocateQaIdRecord: ""
    };
  },
  computed: {
    dataFilled() {
      return (
        (this.searchContentList.length == this.searchPageInfoTotal && this.searchContentList.length) ||
        (this.QAContentList.length && this.QAContentList.length == this.normalPageInfoTotal) ||
        (this.QAContentList.length && this.QAContentList[this.QAContentList.length - 1].bottomEnd)
      );
    }
  },
  methods: {
    resetSearchLocateInfo() {
      this.searchLocateSecondIdRecord = "";
      this.searchLocateQaIdRecord = "";
    },
    scrollLoad(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.target;
      if (scrollTop + offsetHeight >= scrollHeight) {
        this.triggerLoad();
      }
      if (scrollTop == 0) {
        if (!this.searching && this.provide.searchLocate) this.triggerLoad(true);
      }
    },
    triggerLoad(direction) {
      if (this.searching) {
        // 搜索列表下拉加载
        if (this.searchContentList.length == this.searchPageInfoTotal) return;
        this.searchPageInfo.current++;
        this.getSearchTree();
      } else if (!this.searching && !this.provide.searchLocate) {
        // 点击左侧菜单进入三级列表时下拉加载
        if (this.QAContentList.length == this.normalPageInfoTotal) return;
        this.normalPageInfo.current++;
        this.getQAContentList();
      } else if (!this.searching && this.provide.searchLocate) {
        // 点击搜索列表进入三级列表时下拉加载或上拉加载 【direction】 true ：上拉 ；false：下拉
        if (direction) {
          if (this.QAContentList[0].topEnd) return;
          this.flushSerchLocateNormalList(undefined, undefined, true, true);
        } else {
          if (this.QAContentList[this.QAContentList.length - 1].bottomEnd) return;
          this.flushSerchLocateNormalList(undefined, undefined, false, true);
        }
      }
    },
    resetInitNormalList() {
      this.normalPageInfo = {
        size: 50,
        current: 1
      };
      this.getQAContentList();
    },
    async getQAContentList() {
      if (!this.provide.activeId) return;
      // 获取默认三级问题列表
      this.loading = true;
      const params = {
        ...this.normalPageInfo,
        status: 1,
        parentId: this.provide.activeId
      };
      const res = await queryQAContent(params);
      this.QAContentList = this.QAContentList.concat(res.data.data.list);
      this.normalPageInfoTotal = res.data.data.totalCount;
      this.loading = false;
    },
    async getSearchTree() {
      // 获取搜索列表树
      this.searching = true;
      this.loading = true;
      const params = {
        ...this.searchPageInfo,
        name: this.searchName
      };
      const res = await getQAContentSearchTree(params);
      this.searchContentList = this.searchContentList.concat(res.data.data.list);
      this.searchPageInfoTotal = res.data.data.totalCount;
      this.loading = false;
      this.$gio.searchLubrQA({
        entrance: "润滑知识检索",
        keywords: this.searchName
      });
    },
    async flushSerchLocateNormalList(item, secondId, moveUpDownFlag = false, flushLazyLoad = false) {
      // 点击搜索列表某一项
      this.searchName = "";
      if (!flushLazyLoad) this.QAContentList = [];
      this.loading = true;
      this.provide.searchLocate = true;
      this.provide.activeId = secondId ? secondId : this.searchLocateSecondIdRecord;
      this.searchLocateSecondIdRecord = secondId ? secondId : this.searchLocateSecondIdRecord;
      this.searchLocateQaIdRecord = item ? item.qaId : this.searchLocateQaIdRecord;
      const params = {
        moveUpDownFlag,
        qaId: item ? item.qaId : this.searchLocateQaIdRecord,
        idLv2: secondId ? secondId : this.searchLocateSecondIdRecord,
        ...this.searchLocatePageInfo
      };

      if (moveUpDownFlag && this.QAContentList.length > 0) {
        params.qaId = this.QAContentList[0].id;
      } else if (!moveUpDownFlag && this.QAContentList.length > 0) {
        params.qaId = this.QAContentList[this.QAContentList.length - 1].id;
      }
      const res = await getQAContentSearchTreeToSpecificQA(params);
      if (moveUpDownFlag) {
        this.QAContentList.unshift(...res.data.data.list);
        if (this.QAContentList[0].topEnd)
          this.$message({
            type: "success",
            message: "已加载上方所有数据"
          });
      } else {
        this.QAContentList.push(...res.data.data.list);
      }
      this.searchLocatePageInfoTotal = res.data.data.totalCount;
      this.loading = false;
      await this.$nextTick();
      if (!moveUpDownFlag && flushLazyLoad) {
        this.$refs.qaContentList.scrollTop = this.$refs.qaContentList.scrollHeight - this.$refs.qaContentList.clientHeight * 2;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.qa-content-container {
  position: relative;
  box-sizing: border-box;
  width: 88%;
  padding: 0;
  padding-top: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.qa-search-bar {
  display: flex;
  align-items: center;
  height: 35px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 40px;
  position: absolute;
  top: 10px;
  left: 0;
  height: 20px;
}
.qa-content-container-center {
  align-items: center;
}
.empty-tip {
  color: #999;
}
.qa-content-list {
  width: 98%;
  box-sizing: border-box;
  padding: 0 20px;
  overflow: auto;
  height: calc(100vh - 200px);
  &::-webkit-scrollbar {
    width: 10px !important;
  }
}
.list-fill-content::after {
  margin-top: 30px;
  display: inline-block;
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 13px;
  content: "—— 已加载全部内容 ——";
}
</style>
