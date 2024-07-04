<template>
  <div style="position:relative">
    <!-- 选择设备弹框 -->
    <el-dialog title="选择设备" :visible.sync="chooseDeviceAndLupDialog" width="70%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChoose">
      <!-- 搜索项 -->
      <el-form ref="searchForm" :model="searchForm" inline label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.deviceName" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属车间" v-if="urlType != 'workOrder' && urlType != 'MSLAWorkOrder' && urlType != 'lubrTable' && urlType != 'workOrderReport'">
          <el-select v-model="searchForm.workshopId" placeholder="请选择" size="small" clearable @change="getDeviceData('refresh')">
            <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="searchForm.deviceCode" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button size="small" @click="resetSearch">重置</el-button>
            <el-button size="small" plain type="danger" v-if="urlType == 'MSLAWorkOrder' || urlType == 'lubrTable'" @click="clickAddDevice">创建设备</el-button>
          </div>
        </el-form-item>
      </el-form>
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
          @row-click="handleCellClick"
          @select-all="selectAllDevice"
        >
          <el-table-column type="selection" width="55" :selectable="taskType == 'check' ? checkSelectable : ''"> </el-table-column>
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

      <span slot="footer">
        <div>
          <el-button @click="cancelChoose" size="small">取 消</el-button>
          <el-button size="small" @click="nextChooseLup" type="danger">下一步</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 选择润滑点弹框 -->
    <el-dialog title="选择润滑点" :visible.sync="chooseLupDialog" width="65%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChooseLup">
      <div class="device-right">
        <!-- 头部 -->
        <!-- 设备信息 -->
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div style="font-size:14px;font-weight:400;color:#999">请至少选择一个润滑点</div>
          <div>
            <el-button size="small" type="danger" plain @click="createLup">创建润滑点</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-content">
          <el-table
            :data="lupTableData"
            tooltip-effect="dark"
            row-key="id"
            v-loading="loadingLup"
            ref="lubricationPointRef"
            height="427"
            @select="handleSelectLup"
            @row-click="handleCellClickLubri"
            @select-all="selectAllLup"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55" :selectable="canSelectable"> </el-table-column>
            <el-table-column prop="lubricationPointName" min-width="18%" label="润滑点名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="lubricationPointType" min-width="10%" label="润滑点设备类型" show-overflow-tooltip> </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer">
        <div>
          <el-button @click="upStep" size="small">上一步</el-button>
          <el-button
            size="small"
            type="danger"
            @click="
              confirmChoose();
              $gio.addLubrPointTrack(NULL, '弹框中点击确定');
            "
          >
            确定
          </el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 创建设备 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :addDeviceDialog="addDeviceDialog"
      :customerObj="customerObj"
      :workshopId="workshopId"
      v-on:addOrEditDevice="addOrEditDevice"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
    <!-- 创建润滑点 -->
    <CreateLubricationPoint
      v-if="addLubricationPointDialog"
      :epInfo="checkDeviceObj"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :deviceTypeDialog="deviceTypeDialog"
      :addLubricationPointDialog="addLubricationPointDialog"
      v-on:addOrEditDevice="addOrEditDevice"
      v-on:addOrEditLup="addOrEditLup"
      v-on:lastNext="lastNext"
      v-on:closeDialogAddLubPoint="closeDialogAddLubPoint"
    />
    <!-- 显示同步核心润滑表信息弹框 -->
    <SyncLub :dialogFlag="showSyncLubDialog" @closeSyncLubDialog="closeSyncLubDialog" :tipsData="tipsData" />
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import createCycleOptimize from "../taskManager/createCycleOptimize";
import SyncLub from "../../equipment/components/syncLubDialog.vue";
import CreateDevice from "../../equipment/components/CreateDevice.vue";
import CreateLubricationPoint from "../../equipment/components/CreateLubricationPoint.vue";
export default {
  components: { SyncLub, CreateDevice, CreateLubricationPoint },
  mixins: [createCycleOptimize],
  props: {
    spId: {
      type: String,
      default: ""
    },
    filterDeviceNew: {
      type: Boolean,
      default: false
    },
    // 是否显示弹框
    chooseDeviceAndLupDialog: {
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
    },
    companyNumber: {
      type: String,
      default: () => {
        return "";
      }
    },
    companyName: {
      type: String,
      default: () => {
        return "";
      }
    },
    workshopId: {
      type: Number,
      default: () => {
        return null;
      }
    },
    plantStudyServiceFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    reportType: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    abnormalDeviceId: {
      type: String,
      default: () => {
        return "";
      }
    },
    isPlantStudyServiceFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    coreDataTemplateId: {
      type: Number,
      default: null
    },
    serviceNumber: {
      type: String,
      default: ""
    }
  },
  watch: {
    checkedDevice: {
      handler: function(val, oldVal) {
        if (val) {
          val.forEach(it => {
            it.isHasCheck = true;
          });
          this.checkedDevice = val;
        }
      },
      deep: true,
      immediate: true
    },
    chooseDeviceAndLupDialog: function(val, oldVal) {
      console.log("showResponeseLubListshowResponeseLubListshowResponeseLubList", this.$parent.showResponeseLubList);
      if (val) {
        // 获取设备列表
        this.firstLoadFlag = true;
        this.resetSearch();
        // 获取登录人的车间
        this.getWorkshopList();
      }
    }
  },
  data() {
    return {
      customerObj: {},
      selectLubricationPointNumber: "",
      addDeviceDialog: false, // 新建设备弹框
      deviceTypeDialog: "",
      addLubricationPointDialog: false,
      checkDeviceObj: {},
      showSyncLubDialog: false,
      tipsData: {},
      searchForm: {
        deviceName: "",
        deviceType: [],
        groupId: [],
        devicePosition: "",
        workshopId: "",
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
      radioDeviceRow: {},
      radioLupRow: {},
      chooseLupDialog: false,
      lupTableData: [],
      tempCheckLupList: [],
      // 新增润滑点
      addLupDialogFlag: false,
      addLupForm: {},
      recommendOilCodeKey: 1,
      addLupImgList: [],
      lubricationPointTypeList: [], // 润滑点设备类型数组
      oilBrandList: [], // 油品品牌数组
      oilChangePeriodList: [],
      oilBoxCapacityList: [{ oilBoxCapacityUnit: "L", oilBoxCapacityUnitDesc: "L" }, { oilBoxCapacityUnit: "KG", oilBoxCapacityUnitDesc: "KG" }],
      methodsList: [{ value: "循环", label: "循环" }, { value: "飞溅", label: "飞溅" }, { value: "喷射", label: "喷射" }, { value: "手刷", label: "手刷" }, { value: "油枪", label: "油枪" }],
      oilList: [],
      loadingLup: false,
      firstLoadFlag: false,
      lupDeviceNameList: []
    };
  },
  created() {
    // 获取润滑点设备类型
    this.getlubricationpointType();
    // 查询用油品牌
    this.getQueryOilList();
    // 查询换油单位配置数据
    this.getOilChangePeriodData();
    // 设备制造商推荐油品
    this.getOilList("");
  },
  methods: {
    // 新建设备
    addOrEditDevice() {
      // 刷新列表
      this.getDeviceData("refresh");
      this.addDeviceDialog = false;
    },
    // 创建设备和润滑点
    addOrEditDeviceAndLumpoint() {
      // 刷新列表
      this.getDeviceData("refresh");
      this.addDeviceDialog = false;
    },
    // 取消新建设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false;
    },
    clickAddDevice() {
      this.customerObj = {
        companyId: this.companyId,
        companyName: this.companyName,
        companyNumber: this.companyNumber
      };
      this.deviceTypeDialog = "addDeviceAndLubpoint";
      this.addDeviceDialog = true;
    },
    closeSyncLubDialog() {
      this.showSyncLubDialog = false;
      this.$refs.LupDialogRef.cancelDialog();
      this.nextChooseLup(); // 润滑点列表
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
          if (this.workshopId) {
            this.searchForm.workshopId = this.workshopId;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getOilList(val) {
      this.requestMethodGet("/mdm/oil/queryOilListByPage", { oilName: val, status: 1, size: 200, current: 1 }).then(res => {
        if (res.data.code == 1000) {
          this.oilList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    formatData1(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.formatData1(data[i].children);
        }
      }
      return data;
    },
    // 查询换油单位配置数据
    getOilChangePeriodData() {
      this.requestMethodGet("/web/device/getOilChangePeriodUnitConfig")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { oilChangePeriodUnit: item.oilChangePeriodUnit, oilChangePeriodUnitDesc: item.oilChangePeriodUnitDesc };
              });
              this.oilChangePeriodList = optionData;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取油品品牌/类型/系列/名称 方法
    getQueryOilList() {
      let params = {
        parentCode: 0,
        status: 1
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { value: item.code, label: item.name };
              });
              this.oilBrandList = optionData;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询润滑点
    getlubricationpointType() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lubricationPointTypeList = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 创建润滑点
    createLup() {
      this.deviceTypeDialog = "addLumPoint";
      this.addLubricationPointDialog = true;
    },
    // 添加润滑点成功
    addOrEditLup() {
      this.addLubricationPointDialog = false;
      this.nextChooseLup(); // 润滑点列表
    },
    // 取消编辑润滑点
    closeDialogAddLubPoint() {
      this.addLubricationPointDialog = false;
    },
    // 关闭弹框
    closeDialog() {
      this.addLupDialogFlag = false;
    },
    rowKey(row) {
      return row.id;
    },
    selectList() {
      let that = this;
      // 解决 toggleRowSelection无效的问题
      console.log(JSON.stringify(that.radioDeviceRow) === "{}");
      if (JSON.stringify(that.radioDeviceRow) != "{}") {
        that.$refs.deviceTableRef.toggleRowSelection(that.radioDeviceRow);
      }
      //
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
      params.companyId = this.companyId;
      if (this.workshopId) {
        if (this.firstLoadFlag) {
          params.workshopId = this.workshopId;
          this.firstLoadFlag = false;
        }
      }
      this.loadingDevice = true;
      let url = "";
      if (this.urlType == "createInspection" || this.urlType == "createAbnormal" || this.urlType == "MSLAWorkOrder" || this.urlType == "lubrTable") {
        url = "/web/device/filterDevice";
      } else if (this.urlType == "workOrder" || this.urlType == "workOrderReport") {
        params.companyNumber = this.companyNumber;
        params.workshopId = this.workshopId;
        params.serviceNumber = this.serviceNumber;
        url = "/web/device/filterDevice";
      } else {
        if (this.abnormalDeviceId) {
          params.deviceId = this.abnormalDeviceId;
        }
        url = "/web/device/filterDevice";
      }
      params.spId = this.spId;
      if (this.filterDeviceNew && this.$userInfo.userType == 2) {
        url = "/web/device/filterDevice2";
      }
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          let list = [];
          if (val) {
            this.$refs.deviceTableRef.clearSelection();
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
          this.$nextTick(() => {
            this.selectList();
          });
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
      this.$refs.deviceTableRef.clearSelection();
      this.$refs.deviceTableRef.toggleRowSelection(val.pop(), true);
    },
    handleCellClick(row) {
      if (this.radioDeviceRow.id == row.id) {
        this.radioDeviceRow = {};
        this.$refs.deviceTableRef.clearSelection();
      } else {
        this.radioDeviceRow = row;
        this.$refs.deviceTableRef.clearSelection();
        this.$refs.deviceTableRef.toggleRowSelection(row, true);
      }
    },
    // 全选
    selectAllDevice(val) {
      this.$refs.deviceTableRef.clearSelection();
      this.$refs.deviceTableRef.toggleRowSelection(this.radioDeviceRow, true);
    },
    // 取消选择
    cancelChoose() {
      this.checkedDevice = [];
      this.$refs.deviceTableRef.clearSelection();
      this.$emit("cancelChooseDeviceAndLup");
    },
    // 下一步选择润滑点

    nextChooseLup() {
      const checkDeviceList = this.$refs.deviceTableRef.selection;
      this.checkDeviceObj = checkDeviceList[0];
      if (!checkDeviceList.length) {
        this.$message({
          type: "warning",
          message: "请选择设备"
        });
        return;
      }
      this.getLupDeviceNameList(checkDeviceList[0].deviceType);
      let url = "";
      let reqMethod = "requestMethodGet";
      let params = {};
      if (this.urlType == "MSLAWorkOrder") {
        // params.companyNumber = this.companyNumber;
        // params.current = 1;
        // params.size = 200;
        // params.webFlag = true;
        // params.deviceId = this.radioDeviceRow.id;
        // url = "/weChat/msla/lubricationPoint/queryMslaLubricationPointByPage";
        let deviceIds = [];
        params.current = 1;
        params.size = 20;
        deviceIds[0] = this.radioDeviceRow.id;
        params.deviceIds = deviceIds;
        params.userId = this.userInfo.userId;
        reqMethod = "requestMethodPost";
        url = "/web/lubricationPoint/filterLubricationPoint";
      } else {
        let deviceIds = [];
        params.current = 1;
        params.size = 20;
        deviceIds[0] = this.radioDeviceRow.id;
        params.deviceIds = deviceIds;
        params.userId = this.userInfo.userId;
        url = "/web/lubricationPoint/filterLubricationPoint";
        reqMethod = "requestMethodPost";
      }
      this.loadingLup = true;
      if (this.spId) params.spId = this.spId;
      this[reqMethod](url, params).then(res => {
        if (res.data.code == 1000) {
          this.loadingLup = false;
          let data = [];
          if (this.urlType == "MSLAWorkOrder" || this.urlType == "workOrder" || this.urlType == "workOrderReport") {
            let list = res.data.data;
            let lupList = [];
            if (list.length) {
              list.forEach(lup => {
                if (lup.lubricationPointNum) {
                  lupList.push(lup);
                }
              });
            }
            data = lupList;
          } else {
            if (res.data.data.length > 0) {
              data = res.data.data;
            }
          }
          if (data.length) {
            data.forEach(it => {
              if (it.lubPointDtoList.length > 0) {
                it.lubPointDtoList.forEach(itChild => {
                  itChild.canSelectable = true;
                });
              }
            });
            this.lupTableData = data[0].lubPointDtoList;
          } else {
            this.lupTableData = [];
          }
          this.chooseLupDialog = true;
          // 需要把列表中已有的润滑点和接口数据做比较，已有的要默认勾选上
          const list = this.checkedDevice.concat(this.tempCheckLupList);
          this.reverseLubTableDataChecked(this.lupTableData, this);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getLupDeviceNameList(deviceCode) {
      const params = {
        deviceCode: deviceCode,
        lubPointName: "",
        status: 1,
        current: 1,
        size: 100
      };
      this.requestMethodGet("/device/coreDeviceLubPoint/pageList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list || [];
          if (data.length) {
            data.forEach(it => {
              it.isCustomFlag = false;
            });
          }
          let obj = {
            lubPointName: "自定义",
            isCustomFlag: true
          };
          data.push(obj);
          this.lupDeviceNameList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 剩一条不可取消勾选
    canSelectable(row, index) {
      // 默认勾选的不可编辑
      return row.canSelectable;
    },
    // 选中润滑点
    handleSelectLup(list, row) {
      // this.handlerCheck(list,row)
      if (!list.length) {
        this.$refs.lubricationPointRef.clearSelection();
        return;
      }
      if (this.urlType == "MSLAWorkOrder") {
        // 单选
        this.radioLupRow = row;
        this.$refs.lubricationPointRef.clearSelection();
        this.$refs.lubricationPointRef.toggleRowSelection(list.pop(), true);
      } else {
        this.tempCheckLupList = list;
      }
      console.log("this.tempCheckLupList", this.$refs.lubricationPointRef.selection);
    },
    handleCellClickLubri(row) {
      if (this.urlType == "MSLAWorkOrder") {
        // 单选
        if (this.radioLupRow.id == row.id) {
          this.radioLupRow = {};
          this.$refs.lubricationPointRef.clearSelection();
        } else {
          this.radioLupRow = row;
          this.$refs.lubricationPointRef.clearSelection();
          this.$refs.lubricationPointRef.toggleRowSelection(row, true);
        }
      } else {
        if (!row.disabled) {
          this.$refs.lubricationPointRef.toggleRowSelection(row);
        }
        let ids = this.tempCheckLupList.map(item => {
          return item.id;
        });
        if (ids.includes(row.id)) {
          this.tempCheckLupList.forEach((item, index) => {
            if (item.id == row.id) {
              this.tempCheckLupList.splice(index, 1);
            }
          });
        } else {
          this.tempCheckLupList.push(row);
        }
      }
      console.log("this.tempCheckLupList", this.$refs.lubricationPointRef.selection);
    },
    // 全选润滑点
    selectAllLup(list, row) {
      // this.handlerCheck(list,row)
      if (!list.length) {
        return;
      }
      if (this.urlType == "MSLAWorkOrder") {
        // 单选
        this.$refs.lubricationPointRef.clearSelection();
        this.$refs.lubricationPointRef.toggleRowSelection(this.radioLupRow, true);
      } else {
        this.tempCheckLupList = list;
      }
    },
    // 处理选择
    handlerCheck(list) {
      if (!list.length) {
        return;
      }
      this.tempCheckLupList = list;
    },
    // 关闭选择润滑点
    cancelChooseLup() {
      this.$refs.lubricationPointRef.clearSelection();
      this.chooseLupDialog = false;
    },
    // 上一步
    upStep() {
      // 返回上一步时把当前选中的润滑点清掉
      this.tempCheckLupList = [];
      this.radioLupRow = {};
      this.$refs.lubricationPointRef.clearSelection();
      this.chooseLupDialog = false;
    },
    // 确定选择
    confirmChoose() {
      let checkArr = cloneDeep(this.$refs.lubricationPointRef.selection);
      if (!checkArr.length) {
        this.$message({
          type: "error",
          message: "请至少选择一个润滑点"
        });
        return;
      }
      const list = this.checkedDevice.concat(checkArr);
      this.chooseLupDialog = false;
      // 选中润滑点和列表带过来的润滑点需要去重后添加进列表中
      if (this.urlType == "MSLAWorkOrder") {
        // 单选
        this.$emit("confirmChooseLup", checkArr);
        this.radioLupRow = {};
      } else if (this.urlType == "workOrderReport") {
        this.$emit("confirmChooseLup", _.uniqBy(list, "lubricationPointNumber"));
        this.tempCheckLupList = [];
      } else {
        this.$emit("confirmChooseLup", _.uniqBy(list, "lubricationPointId"));
        this.tempCheckLupList = [];
      }
      this.$refs.lubricationPointRef.clearSelection();
      this.$refs.deviceTableRef.clearSelection();
    }
  }
};
</script>
<style lang="less" scoped></style>
