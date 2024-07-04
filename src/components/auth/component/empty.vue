<template functional>
  <div class="empty" style="  position: relative;width: 100%;height: 80%;flex-direction: column;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;">
    <img src="../../../assets/empty_file.png" />
    <p class="empty__text">{{ props.emptyText }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    emptyText: {
      type: String,
      default: "暂无数据"
    }
  }
};
</script>

<style lang="less" scoped>
.empty {
  position: relative;
  width: 100%;
  height: 80%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.empty__text {
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  font-size: 13px;
  color: #999;
}
</style>
