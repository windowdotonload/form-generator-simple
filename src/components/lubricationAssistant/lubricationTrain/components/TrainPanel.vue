<template>
  <div class="train-panel">
    <TrainCatalogue />
    <TrainVideoPanel />
  </div>
</template>

<script>
export default {
  components: {
    TrainCatalogue: () => import("./TrainCatalogue.vue"),
    TrainVideoPanel: () => import("./TrainVideoPanel.vue")
  }
};
</script>

<style lang="less" scoped>
.train-panel {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  width: 100%;
  height: calc(100% - 105px);
}
</style>
