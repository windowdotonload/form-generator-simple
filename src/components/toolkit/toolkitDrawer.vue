<template>
  <div class="toolkit-drawer-bar">
    <el-drawer :wrapperClosable="false" v-if="$options.components" :visible.sync="drawer" direction="rtl" size="41%" :before-close="closeDrawer">
      <template #title>
        <div>
          <span v-for="item in $store.state.Toolkit.toolkitBreadcrumb" :key="item.toolCode" style="cursor: pointer" @click="goComponent(item)">
            <i class="el-icon-arrow-right" v-if="item.toolCode != 'toolkitIndex'" />
            {{ item.toolName }}
          </span>
        </div>
      </template>
      <component :is="$store.state.Toolkit.toolkitCurrentComponent" />
    </el-drawer>
  </div>
</template>

<script>
export default {
  provide: {
    // 以x为底y的对数 ex：getBaseLog（3，9） = 2
    getBaseLog(x, y) {
      return Number(Math.log(y) / Math.log(x));
    },
    /**
     * @description:
     * @param {Object} val
     * @return {*}
     */
    toNumber(val) {
      Object.keys(val).forEach(key => {
        val[key] = isNaN(Number(val[key])) ? val[key] : Number(val[key]);
      });
      return val;
    },
    closeFunc() {
      this.closeFunc();
    }
  },
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    closeFunc: {
      type: Function
    }
  },
  watch: {
    "$route.fullPath"(val) {
      this.$emit("closeToolkit");
    }
  },
  components: Vue.$registerComponents(require.context("./toolkitSpecific", false, /\.vue$/)).components,
  data() {
    return {
      drawerName: "计算工具",
      toolkitComponentsNames: Vue.$registerComponents(require.context("./toolkitSpecific", false, /\.vue$/)).fileNames
    };
  },
  methods: {
    closeDrawer() {
      this.$emit("closeToolkit");
    },
    goComponent(toolitem) {
      this.$store.commit("Toolkit/changeToolkitBreadcrumb", toolitem);
      this.$gio.clickCalculateTool({
        toolName: toolitem.toolName
      });
    }
  }
};
</script>

<style lang="less" scoped>
.toolkit-drawer-bar {
  position: relative;
  /deep/ .el-drawer__header {
    margin-bottom: 16px;
  }
}
.footer-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
