<template>
  <div class="train-outline-container">
    <HeaderOverview />
    <TrainPanel />
    <Drawer />
  </div>
</template>

<script>
export default {
  components: {
    HeaderOverview: () => import("./components/HeaderOverview.vue"),
    TrainPanel: () => import("./components/TrainPanel.vue"),
    Drawer: () => import("./components/Drawer.vue")
  },
  provide() {
    return {
      state: this.state,
      actions: this
    };
  },
  data() {
    return {
      state: {
        refreshHeaderOverviewData: 0,
        chapteId: "",
        activeTab: "",
        activeTabId: "",
        cacheVideoSearchList: null,
        certificateDialogShowVis: false,
        certificateInfo: null,
        drawerVisable: false,
        drawerTitle: "",
        drawerWidth: "50%",
        drawerLoading: false,
        drawerComponent: "",
        drawerComponentParams: null,
        userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")))
      },
      actions: {}
    };
  },
  methods: {
    delayExec(func, delay = 30) {
      setTimeout(() => func(), delay);
    },
    refreshHeaderOverviewData() {
      this.state.refreshHeaderOverviewData++;
    },
    setCacheVideoSearchList(val) {
      this.state.cacheVideoSearchList = val;
    },
    showSingleCertificate(certificateInfo) {
      this.state.certificateInfo = certificateInfo;
      this.state.certificateDialogShowVis = true;
    },
    closeShowSingleCertificate() {
      this.state.certificateDialogShowVis = false;
    },
    initPlaindrawerComponentParams() {
      this.state.drawerComponentParams = this.state.drawerComponentParams ? this.state.drawerComponentParams : {};
    },
    loadingDrawer() {
      this.state.drawerLoading = true;
    },
    endLoadingDrawer() {
      this.state.drawerLoading = false;
    },
    changeActiveTab(val) {
      this.state.activeTab = val;
    },
    changeActiveTabId(val) {
      this.state.activeTabId = val;
    },
    setDrawerComponentParams(val) {
      this.state.drawerComponentParams = val;
    },
    openDrawer(params) {
      const { title, drawerComponent, drawerComponentParams } = params;
      if (drawerComponent) this.state.drawerComponent = drawerComponent;
      if (drawerComponentParams) this.state.drawerComponentParams = drawerComponentParams;
      this.state.chapteId = params.chapteId ? params.chapteId : "";
      this.state.drawerTitle = title;
      this.state.drawerVisable = true;
    },
    closeDrawer() {
      this.state.drawerComponent = "";
      this.state.drawerComponentParams = null;
      this.state.drawerVisable = false;
    }
  }
};
</script>

<style lang="less" scoped>
.train-outline-container {
  box-sizing: border-box;
  height: calc(100vh - 60px);
  overflow: hidden;
  padding: 20px;
}
.train-panel {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  width: 100%;
  height: calc(100% - 105px);
}
</style>
