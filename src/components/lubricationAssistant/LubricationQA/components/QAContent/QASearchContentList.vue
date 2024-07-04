<template>
  <div class="empty-content">
    <div class="qa-content-list-item" v-for="item in QASearchContentList" :key="item.id">
      <div class="qa-search-content-calssify_title">{{ item.primaryName }} <i class="el-icon-arrow-right" />{{ item.secondName }}</div>
      <div v-for="QAContentItem in item.children" :key="QAContentItem.qaId" class="qa-content-list-item-bar" @click="clickSearchItem(QAContentItem, item.secondId)">
        <span class="qa-item-line Q"><span style="color:#d10000;font-weight:bloder">问：</span><span v-html="showSearchItem(QAContentItem.question)"/></span>
        <span class="qa-item-line A">答：<sapn v-html="showSearchItem(QAContentItem.answer)" /> </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["provide"],
  props: {
    QASearchContentList: Array,
    searchName: {
      type: String
    }
  },

  methods: {
    async clickSearchItem(item, secondId) {
      this.$emit("flushSerchLocateNormalList", item, secondId);
      this.$gio.clickLubrQASearchResult({
        keywords: this.$parent.searchName,
        question: item.question
      });
    },
    showSearchItem(rawContent) {
      if (!this.searchName) return rawContent;
      const match = new RegExp(this.searchName, "g");
      if (match.test(rawContent)) {
        return rawContent.replace(match, `<span style='color:#d10000'>${this.searchName}</span>`);
      } else {
        return rawContent;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.qa-content-list-item {
  flex-wrap: wrap;
  min-height: 88px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
}
.qa-item-line {
  display: inline-block;
  width: 100%;
  font-size: 16px;
}
.Q {
  margin-bottom: 12px;
  font-weight: bolder;
  color: #000;
}
.A {
  color: #666;
}
.qa-search-content-calssify_title {
  padding: 0 20px;
  width: 100%;
  height: 36px;
  border-radius: 6px;
  background: rgba(204, 221, 255, 0.3);
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #666;
}
.qa-item-line {
  display: inline-block;
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
}
.Q {
  margin-bottom: 12px;
  font-weight: bolder;
  color: #000;
}
.A {
  color: #666;
}
.qa-content-list-item-bar {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;
  transition: all 0.5s ease;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: rgba(204, 221, 255, 0.5);
  }
}
</style>
