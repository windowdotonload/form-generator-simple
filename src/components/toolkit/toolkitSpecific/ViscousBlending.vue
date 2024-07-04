<!-- <template>
  <div class="toolkit-container">
    <div class="tab-bar">
      <div class="tab-item" v-for="item in tabs" :key="item.tabIndex" :style="item.tabIndex == activeTab ? 'background:#fff' : ''" @click="changeTab(item)">
        {{ item.tabName }}
      </div>
    </div>
    <CalcPositive v-show="activeTab == 0" />
    <CalcRevert v-show="activeTab == 1" />
    <BackFooter />
  </div>
</template>

<script>
import CalcPositive from "../components/viscousBlending/computedPostive.vue";
import CalcRevert from "../components/viscousBlending/computedRevert.vue";
import BackFooter from "../components/toolkitBack.vue";

export default {
  components: {
    CalcPositive,
    CalcRevert,
    BackFooter,
  },
  data() {
    return {
      activeTab: 0,
      tabs: [
        { tabName: "两种油品混合后黏度", tabIndex: 0 },
        { tabName: "达到目标黏度所需的两种油品比例", tabIndex: 1 },
      ],
    };
  },
  methods: {
    changeTab(item) {
      this.activeTab = item.tabIndex;
    },
  },
};
</script>

<style lang="less" scoped>
.toolkit-container {
  padding: 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  background: #f5f5f5;
}
.tab-bar {
  display: flex;
  align-items: center;

  .tab-item {
    padding: 0 30px;
    margin-right: 5px;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 33px;
    color: #000000;
    background: #ededed;
    min-width: 22%;
    border-radius: 4px 4px 0px 0px;
    cursor: pointer;
  }
}
.tab-content {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}
.part-name {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #000000;
  height: 50px;
  line-height: 48px;
  padding-left: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eeeeee;
}
.form-part {
  margin-top: 16px;
  /deep/ .el-input__inner {
    border-radius: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top-right-radius: none !important;
    border-bottom-right-radius: none !important;
  }
}
.input-left-box {
  box-sizing: border-box;
  display: inline-block;
  margin-left: -8px;
  text-align: center;
  height: 32px;
  width: 35%;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style> -->

<template>
  <div v-loading="loading" style="margin:0;padding:0;width:100%;height:100%">
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/ViscousBlending`" frameborder="0" style="width:100%;height:100%"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: window.location,
      loading: true
    };
  },
  mounted() {
    this.$refs.iframe.onload = () => {
      this.loading = false;
    };
  }
};
</script>

<style></style>
