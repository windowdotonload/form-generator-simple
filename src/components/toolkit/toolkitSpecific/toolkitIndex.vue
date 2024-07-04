<template>
  <div class="tooklkit-container" v-loading="loadingList">
    <h4 style="margin: 10px 0">基础计算工具</h4>
    <div class="toolkit-list">
      <div class="toolkit-item" v-for="item in baseToolkitList" :key="item.toolCode" @click="goToolkitItem(item)">
        <img v-if="item.picFullPath" :src="item.picFullPath" style="width: 56px; height: 56px" />
        <div v-else style="width: 56px; height: 56px" class="pleaceholder-pic"><i class="el-icon-picture"></i></div>
        <p class="toolkit-name">{{ item.toolName }}</p>
      </div>
    </div>
    <h4 style="margin: 10px 0">高级计算工具</h4>
    <div class="toolkit-list">
      <div class="toolkit-item" v-for="item in seniorToolkitList" :key="item.toolCode" @click="goToolkitItem(item)">
        <img v-if="item.picFullPath" :src="item.picFullPath" style="width: 56px; height: 56px" />
        <div v-else style="width: 56px; height: 56px" class="pleaceholder-pic"><i class="el-icon-picture"></i></div>
        <p class="toolkit-name">{{ item.toolName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseToolkitList: [],
      seniorToolkitList: [],
      loadingList: false
    };
  },
  created() {
    this.getToolkitList();
  },
  methods: {
    async getToolkitList() {
      this.loadingList = true;
      const res = await this.requestMethodGet("/toolkit/queryToolConfigList", { current: 1, size: 20 });
      if (res.data.code == 1000) {
        res.data.data.list.forEach(item => {
          if (item.toolType == "0") {
            this.baseToolkitList.push(item);
          } else {
            this.seniorToolkitList.push(item);
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
      this.loadingList = false;
    },
    goToolkitItem(item) {
      this.$store.commit("Toolkit/changeToolkitBreadcrumb", item);
    }
  }
};
</script>

<style scoped lang="less">
.tooklkit-container {
  padding: 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  background: #f5f5f5;
}
.toolkit-list {
  min-height: 250px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.toolkit-item {
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  margin-right: 5px;
  margin-bottom: 5px;
  height: 20vh;
  background: #fff;
  width: 18%;
  border-radius: 6px;

  &:hover {
    box-shadow: 0 0 5px rgba(136, 136, 136, 0.5);
    border-radius: 6px;
  }
}

.toolkit-name {
  width: 110px;
  text-align: center;
  height: 36px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  font-weight: blode;
  box-sizing: border-box;
  padding: 0 8px;
}
.pleaceholder-pic {
  border-radius: 50%;
  font-size: 18px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
