<template>
  <div class="video-tabs-section">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="item.name" :name="item.key" v-for="item in tabs" :key="item.key">
        <component :is="activeName" v-if="item.key == activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  inject: ["state"],
  components: {
    Comment: () => import("./DrawerVideoDetailComment.vue"),
    LubricationService: () => import("./DrawerVideoDetailLubService.vue")
  },
  watch: {
    "state.drawerComponentParams": {
      handler() {
        this.assignTabs();
      },
      immediate: true
    }
  },
  data() {
    return {
      activeName: "Comment",
      tabsMap: {
        Comment: "随堂测试",
        LubricationService: "相关润滑服务"
      },
      tabs: [{ name: "评论", key: "Comment" }]
    };
  },
  methods: {
    assignTabs() {
      if (this.state.drawerComponentParams.trainServiceConfList && this.state.drawerComponentParams.trainServiceConfList.length > 0 && this.state.userInfo.userType == "2") {
        this.tabs = [{ name: "评论", key: "Comment" }, { name: "润滑服务推荐", key: "LubricationService" }];
      } else {
        this.tabs = [{ name: "评论", key: "Comment" }];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.video-tabs-section {
  margin-top: 16px;
}
/deep/ .el-tabs__item {
  font-size: 15px;
  font-weight: 700;
  color: #000;
}
/deep/ .el-tabs__item.is-active {
  font-size: 15px;
  font-weight: 700;
  color: #d10000;
}
/deep/ .el-tabs__active-bar {
  height: 5px;
  border-radius: 15px;
  width: 80%;
  background: #d10000;
}
</style>
