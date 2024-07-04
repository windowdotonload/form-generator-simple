<template>
  <el-dialog title="服务建议" :close-on-click-modal="false" :visible.sync="dialogVisible" width="50%">
    <div class="content-container">
      <div class="suggestion-content" v-for="(item, catIndex) in renderList" :key="item.id">
        <div class="corner-marker">问题{{ catIndex + 1 }}</div>
        <div class="top-header-container">
          <div class="top-header">
            <div class="left-content">
              <div style="font-weight: 700; color: #000">{{ item.name }}</div>
              <div style="font-size: 13px; margin-top: 10px">
                共
                <span style="color: #d10000">{{ item.appealSuggestions.length }}</span>
                条服务建议
              </div>
            </div>
            <div class="rgiht-content">
              <img src="@/assets/service-item-icon.png" alt="" />
            </div>
          </div>
        </div>
        <div class="sub-suggestions" v-for="(subItem, index) in item.appealSuggestions" :key="subItem.id">
          <div style="font-weight: 700; color: #008888">建议{{ index + 1 }}</div>
          <div style="color: #999; margin-top: 5px">{{ subItem.suggestion }}</div>
        </div>
      </div>

      <div class="bottom-content">
        <el-alert type="warning" style="margin-bottom: 10px; width: 98%; margin-left: 6px" :closable="false">
          <template #title>
            <span style="color: #999">温馨提示：</span>
            1、根据故障的严重程度，可选择其它有关的服务。2、如果 MSLA能够帮助原因分析，可改MSAA为MSLA。3、如需申请MSAA服务，请联系美孚现场工程师FES。
          </template>
        </el-alert>
        <div style="width: 100%; display: flex; justify-content: flex-end">
          <el-button type="danger" @click="close" size="small" style="margin-right: 10px">我知道了</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    renderList: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.content-container {
  padding-bottom: 80px;
  min-height: 200px;
  width: 100%;
  position: relative;
}
.bottom-content {
  position: absolute;
  bottom: -35px;
  width: calc(100% + 40px);
  left: -18px;
  padding: 10px 0;
  box-sizing: border-box;
  box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.1);
}
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  width: 100%;
  min-height: 80px;
  border-radius: 6px;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px;
  background: linear-gradient(90deg, rgba(204, 221, 255, 0.4) 0%, rgba(204, 221, 255, 0.8) 100%);
}
.sub-suggestions {
  margin-top: 10px;
  padding: 5px 10px;
}
.suggestion-content {
  margin-bottom: 10px;
  position: relative;

  .corner-marker {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    padding: 3px 10px;
    background: #d10000;
    color: #fff;
    font-size: 12px;
    border-radius: 6px 0px;
    height: 20px;
  }
}
</style>
