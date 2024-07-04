<template>
  <div class="train-catalogue-container">
    <div class="train-catalogue-title">培训目录</div>
    <el-tabs tab-position="left" style="height: 100%;width:100%" v-model="state.activeTab">
      <el-tab-pane v-for="item in typeList" :key="item.id">
        <template #label>
          <span class="train-catalogue-item-label" v-if="item.typeName.length < 8">{{ item.typeName }}</span>
          <el-tooltip class="item" effect="dark" :content="item.typeName" placement="top-start" v-else>
            <span class="train-catalogue-item-label">{{ item.typeName.substr(0, 8) + "..." }}</span>
          </el-tooltip>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getTrainTypeList, executeCbAfterReq } from "../../api/index";
export default {
  inject: ["state", "actions"],
  data() {
    return {
      typeList: []
    };
  },
  created() {
    this.getTypeList();
  },
  watch: {
    "state.activeTab": {
      handler(val) {
        if (val && this.typeList.length > 0) this.changeActiveTab(val);
      }
    }
  },
  methods: {
    changeActiveTab(tab) {
      this.actions.changeActiveTabId(this.typeList[parseInt(tab)].id);
      this.$gio.changeTrainType();
    },
    getTypeListAction(res) {
      this.typeList = res;
      this.actions.changeActiveTab("0");
      this.actions.changeActiveTabId(this.typeList[0].id);
    },
    getTypeList() {
      executeCbAfterReq(getTrainTypeList, undefined, this.getTypeListAction);
    }
  }
};
</script>

<style lang="less" scoped>
.train-catalogue-container {
  width: 9%;
  box-sizing: border-box;
  margin-top: 20px;
  height: 100%;
  overflow-y: auto;
}
.train-catalogue-title {
  font-family: "MicrosoftYaHei";
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 10px;
  font-size: 16px;
  padding-right: 15px;
  padding-left: 10px;
  font-weight: 800;
  border-right: 2px solid #e4e7ed;
}
.train-catalogue-item-label {
  padding: 0 10px;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 20px;
  line-height: 20px;
}
/deep/ .el-tabs__content {
  display: none;
}
/deep/ .el-tabs__header {
  width: 100%;
}
/deep/ .el-tabs__item {
  padding: 0px;
  padding-top: 5px;
  box-sizing: border-box;
  text-align: left !important;
}
/deep/ .el-tabs__nav-prev {
  height: 0;
  display: none;
}
/deep/ .is-scrollable {
  padding-top: 0 !important;
}
/deep/ .el-tabs__item.is-active {
  display: flex;
  align-items: center;
  color: #dd0000 !important;
  background: rgba(221, 0, 0, 0.05);
}
/deep/ .el-tabs__active-bar {
  background-color: #dd0000 !important;
}
::-webkit-scrollbar {
  display: none;
}
</style>
