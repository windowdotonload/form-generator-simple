<template>
  <div style="position:relative">
    <!-- 选择设备弹框 -->
    <el-dialog title="选择设备" :visible.sync="chooseDeviceDialog" width="65%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChoose">
      <!-- 搜索项 -->
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-col :span="6">
          <el-form-item label="设备名称">
            <el-input style="width:100%" v-model="searchForm.deviceName" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属车间">
            <el-select style="width:100%" v-model="searchForm.workshopId" placeholder="请选择" size="small" clearable @change="getDeviceData('refresh')">
              <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备编码">
            <el-input style="width:100%" v-model="searchForm.deviceCode" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <div slot="label">
              <el-button size="small" @click="resetSearch">重置</el-button>
            </div>
          </el-form-item>
        </el-col>
        <!-- 表格 -->
        <div>
          <el-table
            :data="deviceTableData"
            tooltip-effect="dark"
            ref="deviceTableRef"
            v-loading="loadingDevice"
            v-el-table-infinite-scroll="loadMore"
            :row-key="rowKey"
            @select="handleSelectDevice"
            @select-all="selectAllDevice"
          >
            <el-table-column type="selection" width="55" :selectable="taskType == 'check' ? checkSelectable : taskType == 'item' ? itemSelectDevice : ''"> </el-table-column>
            <el-table-column prop="deviceName" min-width="8%" label="设备名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="deviceTypeName" min-width="8%" label="设备类型" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="deviceGroupName" min-width="10%" label="设备分组" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="devicePosition" min-width="5%" label="设备位置" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="deviceCode" min-width="8%" label="设备编码" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="lubricationPointNum" min-width="8%" label="润滑点数" show-overflow-tooltip> </el-table-column>
            <p v-if="loadMoreDeviceFlag">加载中...</p>
            <p v-if="!loadMoreWorkshopFlag">没有更多了</p>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" style="display: flex;align-items: center;justify-content: space-between;" :style="taskType == 'check' || taskType == 'item' ? 'display:flex' : 'display:block'">
        <div v-if="taskType == 'check' || taskType == 'item'" style="display: flex;align-items: center;">
          <i class="el-icon-warning" style="color:#dd0000"></i>
          <div style="color:#dd0000;font-size:12px;margin-left:5px" v-if="taskType == 'check'">提示：无法选择没有配置检查项的设备</div>
          <div style="color:#dd0000;font-size:12px;margin-left:5px" v-if="taskType == 'item'">每台设备最多创建30个检查项，超过将无法继续创建</div>
        </div>
        <div>
          <el-button @click="cancelChoose" size="small" v-if="urlType != 'createAbnormal'">取 消</el-button>
          <el-button size="small" v-if="urlType == 'createAbnormal'" @click="upStep">上一步</el-button>
          <el-button type="danger" size="small" @click="confirmChoose">{{ urlType == "createAbnormal" ? "创 建" : "确 定" }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import createCycleOptimize from "../taskManager/createCycleOptimize";
import elTableInfiniteScroll from "el-table-infinite-scroll";
export default {
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  mixins: [createCycleOptimize],
  props: {
    noFilter: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 是否显示弹框
    chooseDeviceDialog: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    /**
     * 是否单选/多选
     * 单选：true
     * 多选：false
     * **/

    singleFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 选中的设备
    checkedDevice: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * 获取设备列表的url，
     * 创建检查项：'createInspection';创建任务：'createTask';创建异常：'createAbnormal';
     * 创建检查项和创建异常接口同设备列表,'/web/device/queryAllDeviceByPage'；创建任务接口：'/device/check/taskManage/devicesByPage'
     * **/

    urlType: {
      type: String,
      default: () => {
        return "";
      }
    },
    companyId: {
      type: String,
      default: () => {
        return "";
      }
    },
    companyNumber: {
      type: String,
      default: () => {
        return "";
      }
    },
    actionType: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    actionTargets: {
      type: Array,
      default: () => {
        return [];
      }
    },
    taskType: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    checkedDevice: {
      handler: function(val, oldVal) {
        this.checkedDevice = val;
      },
      deep: true,
      immediate: true
    },
    chooseDeviceDialog: function(val, oldVal) {
      if (val) {
        this.resetSearch();
        // 获取车间
        this.getWorkshopList();
      }
    }
  },
  data() {
    return {
      searchForm: {
        deviceName: "",
        deviceType: [],
        groupId: [],
        workshopId: "",
        devicePosition: "",
        deviceCode: ""
      },
      workshopList: [],
      loadingDevice: false,
      loadMoreDeviceFlag: false,
      deviceListTotal: 0,
      deviceCurrent: 1,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      deviceTableData: [],
      deviceTotal: 0,
      radioDeviceRow: {}
    };
  },
  created() {},
  methods: {
    getWorkshopList() {
      const params = {
        companyId: this.companyId,
        workshopName: "",
        current: 1,
        size: 300
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    rowKey(row) {
      return row.id;
    },
    getDeviceData(val) {
      if (val) {
        this.deviceCurrent = 1;
      }
      const params = {
        size: 30,
        current: this.deviceCurrent,
        ...this.searchForm
      };
      if (params.deviceType.length) {
        params.deviceType = params.deviceType[params.deviceType.length - 1];
      } else {
        params.deviceType = "";
      }
      if (params.groupId.length) {
        params.groupId = params.groupId[params.groupId.length - 1];
      } else {
        params.groupId = "";
      }
      params.accountId = this.companyId ? this.companyId : this.userInfo.orgId;
      params.userId = this.userInfo.userId;
      if (this.taskType == "item" || this.taskType == "check") {
        params.checkItem = 1;
      } else {
        params.checkItem = 0;
      }
      this.loadingDevice = true;
      if (this.noFilter) {
        delete params.checkItem;
      }
      let url = "/web/device/filterDevice";

      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          this.loadingDevice = false;
          let list = [];
          if (val) {
            list = res.data.data.list;
          } else {
            list = this.deviceTableData.concat(res.data.data.list);
          }
          if (list.length) {
            list.forEach(item => {
              if (!_.isEmpty(item.checkItemIds)) {
                item.checkItemIdsList = item.checkItemIds.indexOf(",") > -1 ? item.checkItemIds.split(",") : [item.checkItemIds];
              } else {
                item.checkItemIdsList = [];
              }
            });
          }
          this.deviceTableData = list;
          this.deviceTotal = res.data.data.totalCount;
          if (this.deviceTableData.length < this.deviceTotal) {
            this.loadMoreDeviceFlag = true;
          } else {
            this.loadMoreDeviceFlag = false;
          }

          const activeCycle = this.$parent && this.$parent.planCycles && this.$parent.planCycles.find(item => item.__cycleId == this.$parent.activeCycleId);
          if (!activeCycle || !activeCycle.taskPlanTargetRels) return (this.loadingDevice = false);
          const selectedIds = activeCycle.taskPlanTargetRels.map(item => item.targetId);

          if (this.deviceTableData.length) {
            this.$nextTick(() => {
              this.deviceTableData.forEach(device => {
                if (selectedIds.includes(device.id)) {
                  this.$refs.deviceTableRef.toggleRowSelection(device, true);
                } else {
                  this.$refs.deviceTableRef.toggleRowSelection(device, false);
                }
              });
              createTask;
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    checkSelectable(row, index) {
      if (this.urlType == "createTask") {
        if (!_.isEmpty(row.checkItemIds)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    itemSelectDevice(row, index) {
      return row.checkItemCount < 30;
    },
    loadMore() {
      if (this.loadMoreDeviceFlag && this.deviceTableData.length < this.deviceTotal) {
        ++this.deviceCurrent;
        this.getDeviceData();
      }
    },
    // 重置
    resetSearch() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.searchForm.deviceType = [];
      this.searchForm.groupId = [];
      this.getDeviceData("refresh");
    },
    // 选择设备
    handleSelectDevice(val, row) {
      if (!val.length) {
        this.$refs.deviceTableRef.clearSelection();
        return;
      }
      this.radioDeviceRow = row;
      if (this.urlType == "createAbnormal" || this.urlType == "createPopOrRop") {
        this.$refs.deviceTableRef.clearSelection();
        this.$refs.deviceTableRef.toggleRowSelection(val.pop(), true);
        this.checkedDevice;
      } else {
        this.checkedDevice = val;
      }
    },
    // 全选
    selectAllDevice(val) {
      // 只有多选标识的时候才可以全选，单选时直接return
      if (this.urlType == "createAbnormal" || this.urlType == "createPopOrRop") {
        this.$refs.deviceTableRef.clearSelection();
        this.$refs.deviceTableRef.toggleRowSelection(this.radioDeviceRow, true);
      } else {
        this.checkedDevice = val;
      }
    },
    // 上一步
    upStep() {
      this.$emit("upStep");
    },
    // 取消选择
    cancelChoose() {
      this.checkedDevice = [];
      this.$emit("cancelChooseDevice");
    },
    // 确定选择
    confirmChoose() {
      if (this.urlType == "createPopOrRop") {
        this.checkedDevice.push(this.radioDeviceRow);
      }
      if (this.urlType == "createAbnormal") {
        this.checkedDevice = [];
        this.checkedDevice.push(this.radioDeviceRow);
      }

      this.$emit("confirmChooseDevice", this.checkedDevice);
    }
  }
};
</script>
<style lang="less" scoped></style>
