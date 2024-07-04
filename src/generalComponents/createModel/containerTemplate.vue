<template>
  <el-dialog top="3%" :title="topLevelState.title || title" :visible.sync="topLevelState.dialogVisible" @closed="closeDialog" :width="topLevelState.modelBoxWidth || '40%'">
    <component :is="StepsComponents[this.topLevelState.currentStep]" />
  </el-dialog>
</template>

<script>
export default {
  components: require("./index").extendComponents.components,
  props: {
    topLevelState: Object,
    vmRecord: Object,
    title: {
      default: "TITLE",
    },
    StepsComponents: {
      type: Array,
    },
  },
  created() {
    this.topLevelState.dialogVisible = true;
    this.rawModelState = JSON.parse(JSON.stringify(this.topLevelState));
  },
  data() {
    return {
      rawModelState: {},
    };
  },
  methods: {
    closeDialog() {
      if (this.vmRecord.el) {
        document.body.removeChild(this.vmRecord.el);
        this.vmRecord.vm.$destroy();
        this.vmRecord.vm = null;
        this.vmRecord.el = null;

        Object.keys(this.topLevelState).forEach((key) => {
          this.topLevelState[key] = this.rawModelState[key];
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding-top: 10px;
}
</style>