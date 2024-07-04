<template functional>
  <div class="form-tip-container" v-if="props.serviceDrawerType != 1">
    <div class="tip-left">注意</div>
    <div class="tip-right" v-show="props.serviceDrawerType == 0">
      <div class="tip-line">只有未开单状态的服务项允许被取消。</div>
    </div>
    <div class="tip-right" v-show="props.serviceDrawerType == 2">
      <div class="tip-line">1.系统只会更新您填写的更新字段，其它字段保持不变。</div>
      <div class="tip-line">2.只有未开单且非取消状态的服务项允许被编辑。</div>
    </div>
  </div>
</template>

<script>
export default {
  functional: true,
  props: {
    serviceDrawerType: {
      type: Number
    },
    overViewData: {
      type: Object,
      default: {}
    },
  }
};
</script>

<style lang="less" scoped>
.form-tip-container {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  background: #ccddff;
  padding: 8px;
  border-radius: 8px;
  color: #999;
  font-size: 13px;
  height: fit-content;
  margin-bottom: 20px;
  .tip-left {
    box-sizing: border-box;
    padding-right: 5px;
    display: flex;
    justify-content: flex-end;
    width: 10%;
  }
  .tip-right {
    padding-left: 10px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    .tip-line {
      margin-bottom: 5px;
      width: 100%;
    }
  }
}
</style>
