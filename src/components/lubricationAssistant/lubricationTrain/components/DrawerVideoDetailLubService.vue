<template>
  <div class="lub-service-container">
    <div class="lub-service-list-container">
      <div class="lub-service-list-item" v-for="item in configureList" :key="item.id">
        <div class="lub-service-list-item-left">
          <div class="lub-service-title">{{ item.serviceName }}</div>
          <DescItem :content="item.shortDesc || '暂无'" />
        </div>
        <div class="lub-serive-list-item-right">
          <el-button size="mini" type="danger" @click="createApplyOrder(item)">创建申请单</el-button>
        </div>
      </div>
    </div>
    <ServiceApply ref="ServiceApply" />
  </div>
</template>

<script>
import { executeCbAfterReq, getLubServiceConfigureList } from "../../api/index";
const reg = /function generateWorkerFuncBody\(\)\ {(.*)/;
function generateWorkerFuncBody() {
  const generateConfList = data => {
    const res = [];
    const dfs = data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length > 0) {
          dfs(data[i].children);
        } else {
          res.push(data[i]);
        }
      }
    };
    dfs(data);
    return res;
  };
  self.addEventListener(
    "message",
    function(e) {
      const data = e.data;
      const { trainChapterDtoList } = data;
      const confList = generateConfList(trainChapterDtoList);
      self.postMessage({ flatConfList: confList });
    },
    false
  );
}

export default {
  inject: ["state", "actions"],
  components: {
    DescItem: () => import("./DrawerVideoDetailLubItemDesc.vue"),
    ServiceApply: () => import("./DrawerVideoDetailCreateApplyOrder.vue")
  },
  data() {
    return {
      configureList: []
    };
  },
  created() {
    this.getConfigureList();
    this.gioExposureTrack();
  },
  methods: {
    gioExposureTrack() {
      this.$gio.viewlubrService({
        trainName: this.state.drawerComponentParams.trainName
      });
    },
    createApplyOrder(item) {
      this.$refs.ServiceApply.handleAddWorkOrder({
        serviceName: item.serviceName
      });
      this.$gio.clickapplyServiceInTrainPlayPage({
        trainName: this.state.drawerComponentParams.trainName,
        serviceType:item.serviceName
      });
    },
    getConfigureListActions(res) {
      return (this.configureList = res.list);
    },
    getConfigureList() {
      const params = {
        trainId: this.state.drawerComponentParams.id,
        current: 1,
        size: 50
      };
      executeCbAfterReq(getLubServiceConfigureList, params, this.getConfigureListActions);
    },
    generateWorker() {
      const str = generateWorkerFuncBody
        .toString()
        .replace(reg.exec(generateWorkerFuncBody.toString())[0], "")
        .slice(0, -1);
      const blob = new Blob([str]);
      var url = window.URL.createObjectURL(blob);
      var worker = new Worker(url);
      worker.postMessage({ trainChapterDtoList: this.state.drawerComponentParams.trainServiceConfList });
      worker.onmessage = function(e) {
        const { flatConfList } = e.data;
        this.configureList = flatConfList;
      };
    }
  }
};
</script>

<style lang="less" scoped>
.lub-service-container {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 5px;
  padding-left: 0px;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px !important;
  }
}
.lub-service-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;
  min-height: 60px;
}
.lub-service-list-item-left {
  box-sizing: border-box;
  width: 80%;
}
.lub-service-list-item-rgiht {
  box-sizing: border-box;
  width: 20%;
}
.lub-service-title {
  box-sizing: border-box;
  padding-top: 6px;
  font-weight: 700;
  font-size: 16px;
  color: #000;
  margin-bottom: 12px;
}
</style>
