<template>
  <div style="position:relative">
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="设备名称">
            <el-input style="width:100%" v-model="searchForm.deviceName" placeholder="请输入" size="mini" @change="getDeviceData('refresh')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备类型">
            <el-cascader
              size="mini"
              placeholder="请选择"
              :options="deviceTypeList"
              v-model="searchForm.deviceType"
              style="width:100%"
              filterable
              clearable
              @change="getDeviceData('refresh')"
              :props="{ value: 'code', label: 'name' }"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属车间">
            <el-select style="width:100%" v-model="searchForm.workshopId" placeholder="请选择" size="mini" clearable @change="getDeviceData('refresh')">
              <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备分组">
            <el-cascader
              :options="groupList"
              :props="{ label: 'groupName', value: 'id' }"
              collapse-tags
              size="mini"
              style="width:100%"
              v-model="searchForm.groupId"
              placeholder="请选择"
              no-data-text="暂无分组"
              @change="getDeviceData('refresh')"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="设备位置">
            <el-input style="width:100%" v-model="searchForm.devicePosition" placeholder="请输入" size="mini" @change="getDeviceData('refresh')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备编码">
            <el-input style="width:100%" v-model="searchForm.deviceCode" placeholder="请输入" size="mini" @change="getDeviceData('refresh')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <div slot="label">
              <el-button size="mini" @click="resetSearch">重置</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <div v-loading="loadingTable">
        <el-table height="390px" :data="deviceTableData" tooltip-effect="dark" ref="deviceTableRef" :row-key="rowKey" @select="handleSelectDevice" :header-cell-class-name="cellClass">
          <el-table-column type="selection" width="55" :selectable="taskType == 'check' ? checkSelectable : taskType == 'item' ? itemSelectDevice : ''"> </el-table-column>
          <el-table-column prop="deviceName" min-width="8%" label="设备名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceTypeName" min-width="8%" label="设备类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceGroupName" min-width="10%" label="设备分组" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="devicePosition" min-width="5%" label="设备位置" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceCode" min-width="8%" label="设备编码" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="lubricationPointNum" min-width="8%" label="润滑点数" show-overflow-tooltip> </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer" style="display: flex;align-items: center;justify-content: space-between;" :style="taskType == 'check' || taskType == 'item' ? 'display:flex' : 'display:block'">
      <div v-if="taskType == 'check' || taskType == 'item'" style="display: flex;align-items: center;">
        <i class="el-icon-warning" style="color:#dd0000"></i>
        <div style="color:#dd0000;font-size:12px;margin-left:5px" v-if="taskType == 'check'">提示：无法选择没有配置检查项的设备</div>
        <div style="color:#dd0000;font-size:12px;margin-left:5px" v-if="taskType == 'item'">每台设备最多创建30个检查项，超过将无法继续创建</div>
      </div>

      <div style="width:100%;display:flex;align-item:center;position:relative;justify-content:center;margin-top:10px">
        <el-button @click="cancelChoose" size="mini">取 消</el-button>
        <el-button type="danger" size="mini" @click="confirmChoose">确 定</el-button>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  inject: ["addDevice", "deviceCardInfoList"],
  data() {
    return {
      loadingTable: false,
      searchForm: {
        deviceName: "",
        deviceType: "",
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
      deviceTypeList: [],
      groupList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      deviceTableData: [],
      deviceTotal: 0,
      radioDeviceRow: {},
      selectedDevice: [],
      current: 1
    };
  },
  created() {
    this.getDeviceTypeList();
    this.getGroupTree();
    this.getWorkshopList();
    this.getDeviceData();
  },
  mounted() {
    this.registerScrollEvent();
  },
  beforeDestroy() {
    this.uninstallScrollEvent();
  },
  methods: {
    cellClass(row) {
      if (row.columnIndex == 0) return "table-header-line";
    },
    registerScrollEvent() {
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").addEventListener("wheel", this.scrollDirection, {
        passive: true
      });
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").addEventListener("scroll", this.loadMore, {
        passive: true
      });
    },
    uninstallScrollEvent() {
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").removeEventListener("scroll", this.loadMore);
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").removeEventListener("wheel", this.scrollDirection);
    },
    scrollDirection(e) {
      this.deltaY = e.deltaY;
    },
    loadMore(e) {
      if (this.deltaY < 0) return;
      const target = e.target;
      const reachBottomFlag = target.scrollTop + target.clientHeight + 30 >= target.scrollHeight;
      if (reachBottomFlag) {
        if (this.deviceTableData.length >= this.deviceTotal) return;
        this.current++;
        this.getDeviceData();
      }
    },
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
    getDeviceTypeList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {}).then(res => {
        if (res.data.code == 1000) {
          this.deviceTypeList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 获取分组树
    getGroupTree() {
      // 美孚/经销商选择客户,客户取自己公司ID
      const params = {
        companyId: this.$userInfo.orgInfo.companyId
      };
      console.log("paramsparams", params);
      this.requestMethodGet("/weChat/deviceGroup/getDeviceGroupTree", params).then(res => {
        if (res.data.code == 1000) {
          this.groupList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getDeviceData(val) {
      this.loadingTable = true;
      const params = {
        current: this.current,
        size: 30,
        orderBy: "createTime",
        descFlag: true,
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
      params.companyId = this.companyId;
      params.userId = this.$userInfo.userId;
      this.loadingDevice = true;
      let url = "customize/form/record/deviceList";
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
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
          this.loadingDevice = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.loadingTable = false;
        this.$nextTick(() => {
          this.revertCheckList();
        });
      });
    },
    revertCheckList() {
      const existIds = this.deviceCardInfoList && this.deviceCardInfoList.map(item => item.id);
      if (!existIds) return;
      this.selectedDevice = [...this.deviceCardInfoList];
      this.deviceTableData.forEach(row => {
        if (existIds.includes(row.id)) {
          this.$refs.deviceTableRef && this.$refs.deviceTableRef.toggleRowSelection(row, true);
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
    // 重置
    resetSearch() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.searchForm.deviceType = [];
      this.searchForm.groupId = [];
      this.getDeviceData("refresh");
    },

    handleSelectDevice(val, row) {
      if (val.length == 1) return (this.selectedDevice = [row]);
      const prevSel = val.shift();
      this.$refs.deviceTableRef.toggleRowSelection(prevSel, false);
      this.selectedDevice = [row];
    },
    upStep() {
      this.$emit("upStep");
    },
    cancelChoose() {
      this.checkedDevice = [];
      let parent = this.$parent;
      while (!parent.INS && parent && parent.$parent) {
        parent = parent.$parent;
      }
      parent.INS && parent.INS.closeDialog && parent.INS.closeDialog();
    },
    confirmChoose() {
      this.addDevice(this.selectedDevice);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 3px !important;
}
.table-container {
  box-sizing: border-box;
  height: 390px;
  overflow: auto;
}
/deep/ .el-table .table-header-line .cell .el-checkbox__inner {
  display: none;
}
</style>
