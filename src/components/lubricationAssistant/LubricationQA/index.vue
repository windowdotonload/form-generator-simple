<template>
  <div class="lub-qa-container">
    <QAMenu />
    <QAContent />
  </div>
</template>

<script>
export default {
  components: {
    QAMenu: () => import("./components/QAMenu/index.vue"),
    QAContent: () => import("./components/QAContent/index.vue")
  },
  provide() {
    return {
      provide: this.provide
    };
  },
  data() {
    return {
      provide: {
        activeId: "",
        searchLocate: false
      }
    };
  }
};
</script>

<style lang="less" scoped>
.lub-qa-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 20px;
  margin: 0;
  width: 100%;
  height: calc(100vh - 120px);
  overflow: hidden;
}
</style>
