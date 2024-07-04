<template>
  <div>
    <el-dialog title="温馨提示" :visible.sync="dialogFlag" width="40%" :close-on-click-modal="false" :before-close="closeSyncLubDialog">
      <div style="padding:0 20px;color:rgb(153, 153, 153);line-height:20px;margin-top:20px;font-size:16px;">设备类型（{{tipsData.deviceType}}）通常有多个润滑点，可参考以下信息补充：</div>
      <div style="padding:0 20px;line-height:20px;margin:10px 0 20px 0;font-size:16px;" v-if="tipsData.mainLubPoints">{{tipsData.mainLubPoints.join('，')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeSyncLubDialog">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    tipsData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    // 关闭弹框
    closeSyncLubDialog() {
      this.$emit("closeSyncLubDialog");
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0px 20px;
}
</style>