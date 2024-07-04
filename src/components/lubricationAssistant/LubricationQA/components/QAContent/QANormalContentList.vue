<template>
  <div>
    <div class="qa-content-list-item" v-for="item in QAContentList" :key="item.id">
      <QAContentItem :QAContentItem="item" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    QAContentList: Array
  },
  components: {
    QAContentItem: () => import("./QAContentItem.vue")
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
  padding: 20px;
  border-bottom: 1px solid #e9e9e9;
  width: 100%;
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
</style>
