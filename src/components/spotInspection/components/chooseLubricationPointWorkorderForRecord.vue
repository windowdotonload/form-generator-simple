<template>
  <div style="position:relative">
    <!-- 选择设备弹框 -->
    <el-dialog :visible.sync="chooseDeviceAndLupDialog" width="70%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChoose">
      <template v-slot:title>
        <span style="font-weight:bolder;font-size: 16px;color:#606266">选择设备</span>
      </template>
      <!-- 搜索项 -->
      <el-form ref="searchForm" :model="searchForm" inline label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.deviceName" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="所属车间"
          v-if="urlType != 'workOrder' && urlType != 'MSLAWorkOrder' && urlType != 'lubrTable' && urlType != 'workOrderReport' && urlType != 'parameter' && urlType != 'workshop'"
        >
          <el-select v-model="searchForm.workshopId" placeholder="请选择" size="small" clearable @change="getDeviceData('refresh')">
            <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="searchForm.deviceCode" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button size="small" @click="resetSearch">重置</el-button>
            <el-button size="small" plain type="danger" @click="clickAddDevice">
              创建设备
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div v-if="templateFitter" style="background: #ebf1ff;padding: 0px 0px;border-radius: 4px;height: 36px;line-height: 36px;margin-bottom: 10px;">
        <span style="margin-left: 20px">温馨提示 <span>由于服务内容限制，只能选择</span><span style="color: #dd0000"> 特定类型的设备</span></span>
      </div>
      <div v-if="urlType == 'workshop'" style="padding: 0px 0px;height: 36px;line-height: 36px;margin-bottom: 10px;">
        <span style="margin-left: 20px;color: #dd0000">温馨提示：为确保成功转移，选择的设备需要满足关联的润滑服务申请单为”已完成“状态</span>
      </div>
      <!-- 表格 -->
      <div>
        <el-table
          :data="deviceTableData"
          tooltip-effect="dark"
          ref="deviceTableRef"
          v-loading="loadingDevice"
          v-el-table-infinite-scroll="loadMore"
          :row-key="rowKey"
          :header-cell-class-name="cellClass"
          @select="handleSelectDevice"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55" :selectable="taskType == 'check' ? checkSelectable : ''"> </el-table-column>
          <el-table-column prop="deviceName" min-width="8%" label="设备名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceTypeName" min-width="8%" label="设备类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceGroupName" min-width="10%" label="分组" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="devicePosition" min-width="5%" label="位置" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceCode" min-width="8%" label="编码" show-overflow-tooltip> </el-table-column>
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
    <el-dialog :visible.sync="chooseLupDialog" width="65%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChooseLup">
      <template v-slot:title>
        <span style="font-weight:bolder;font-size: 16px;color:#606266">添加润滑点</span>
      </template>
      <div class="device-right">
        <!-- 头部 -->
        <el-input size="small" v-model="lumSearch" placeholder="请输入关键词" suffix-icon="el-icon-search" style="width:220px;" maxlength="50" @change="lumSearchChange" clearable></el-input>
        <div v-if="resultNotice && lumSearch" style="margin-top: 20px;color: #dd0000;font-size: 13px;">搜索结果：</div>
        <div style="height: 500px;overflow-y: scroll;overflow-x: hidden;" v-infinite-scroll="loadMoreLumPoint">
          <div v-for="(item, index) in lupTableData" :key="index" style="" class="checkbox-wrap">
            <div style="height:48px;;line-height: 48px;background:#f9f9f9 ;padding: 0 20px;display: flex;justify-content: space-between;">
              <div>{{ item.deviceName }} ({{ item.deviceTypeName }})</div>
              <div>
                <el-button type="text" @click="createLup(item)" style="color:#001450">+ 添加润滑点</el-button>
              </div>
            </div>

            <div style="width:100%;" class="checkbox-box" v-if="item.lubPointDtoList.length > 0">
              <el-checkbox-group v-model="item.checkList" style="width:100%;" @change="changeSelLubPoint($event, item)">
                <el-checkbox class="checkbox" v-for="(it, index1) in item.lubPointDtoList" :key="index1" :label="it.lubricationPointNumber" :disabled="it.disabled">
                  <div style="color:#333;">{{ it.lubricationPointName }}</div>
                  <div style="color:#999;">{{ it.lubricationPointType }}</div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else class="empty-style">
              暂无润滑点
            </div>
          </div>
          <p class="load-style" v-if="loadMoreLumPointFlag">加载中...</p>
          <p class="load-style" v-if="!loadMoreLumPointFlag">没有更多了</p>
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
    <!-- 选择润滑点弹框 -->
    <el-dialog
      title="选择转移车间"
      :visible.sync="chooseTranferWorkshopDialog"
      width="65%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelChooseWorkshop"
    >
      <div class="device-right">
        <!-- 头部 -->
        <span>车间名称：</span>
        <el-input size="small" v-model="workshopSearch" placeholder="" suffix-icon="el-icon-search" style="width:220px;" maxlength="50" @change="workShopSearch" clearable></el-input>
        <div style="height: 500px;overflow-y: scroll;overflow-x: hidden;" v-infinite-scroll="loadMoreWorkshop">
          <el-table
            ref="multipleTableAdd"
            :data="workshopData"
            v-loading="loadingPerson"
            v-el-table-infinite-scroll="loadMoreWorkshop"
            tooltip-effect="dark"
            :row-key="getRowKey"
            @current-change="handleDistributionnChange"
          >
            <el-table-column width="55" :reserve-selection="true">
              <template slot-scope="scope">
                <el-radio v-model="distributionPerson" :label="scope.row"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="workshopName" min-width="20%" label="车间名称"> </el-table-column>
            <el-table-column prop="deviceCount" min-width="10%" label="设备数">
              <template slot-scope="scope">
                {{ scope.row.deviceCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="workOrderCount" min-width="10%" label="工单数">
              <template slot-scope="scope">
                {{ scope.row.workOrderCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="10%" label="创建时间"> </el-table-column>
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
    <!-- 新增润滑点 -->
    <!-- <LupDialog
          :dialogFlag="addLupDialogFlag"
          :ruleForm="addLupForm"
          :lupDeviceNameList="lupDeviceNameList"
          :recommendOilCodeKey="recommendOilCodeKey"
          :imageLubricationList="addLupImgList"
          :lubricationPointTypeList="lubricationPointTypeList"
          :oilBrandList="oilBrandList"
          :oilChangePeriodList="oilChangePeriodList"
          :oilBoxCapacityList="oilBoxCapacityList"
          :methodsList="methodsList"
          :recommendOilList="recommendOilList"
          :oilList="oilList"
          v-on:addOrEditLup="addOrEditLup"
          v-on:closeDialog="closeDialog"
          ref="LupDialogRef"
        /> -->
    <!-- 新建设备 -->
    <!-- <addDevice
          :addDeviceDialogFlag="addDeviceDialogFlag"
          :ruleForm="addLupForm"
          :companyId = 'companyId'
          :companyName="companyName"
          :companyNumber="companyNumber"
          :recommendOilCodeKey="recommendOilCodeKey"
          :imageLubricationList="addLupImgList"
          :lubricationPointTypeList="lubricationPointTypeList"
          :oilBrandList="oilBrandList"
          :oilChangePeriodList="oilChangePeriodList"
          :oilBoxCapacityList="oilBoxCapacityList"
          :methodsList="methodsList"
          :recommendOilList="recommendOilList"
          :oilList="oilList"
          v-on:addOrEditLup="addOrEditLup"
          v-on:closeDialog="closeDialog"
          ref="LupDialogRef"
        /> -->
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
import LupDialog from "../../equipment/components/lupDialog.vue";
import SyncLub from "../../equipment/components/syncLubDialog.vue";
import addDevice from "../components/addDevice.vue";
import CreateDevice from "../../equipment/components/CreateDevice.vue";
import CreateLubricationPoint from "../../equipment/components/CreateLubricationPoint.vue";
export default {
  components: { CreateDevice, CreateLubricationPoint, LupDialog, addDevice, SyncLub },
  props: {
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
    workShopId: {
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
    companyName: {
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
    selectMax: {
      type: Number,
      default: () => {
        return 100;
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
    },
    checkedDeviceId: {
      type: String,
      default: ""
    },
    checkedlubricationPointNumber: {
      type: String,
      default: ""
    }
  },
  watch: {
    checkedDevice: {
      handler: function(val, oldVal) {
        if (val) {
          let checkArr = [];
          this.lupTableData.map(item => {
            this.$set(item, "checkList", []);
            item.lubPointDtoList.map(it => {
              val.map(itCheckedIt => {
                if (it.lubricationPointNumber == itCheckedIt) {
                  item.checkList.push(itCheckedIt);
                  checkArr.push(it);
                }
              });
            });
          });
          // it.isHasCheck = true;
          this.checkedDevice = val;
        }
      },
      deep: true,
      immediate: true
    },
    chooseDeviceAndLupDialog: function(val, oldVal) {
      if (val) {
        // 获取设备列表
        this.firstLoadFlag = true;
        this.addDeviceDialogFlag = false;
        this.resetSearch();
        this.getGroupTree();
        // this.getDeviceData('refresh')
        // 获取登录人的车间
        this.getWorkshopList();
        this.getTemplateFitter();
      }
    }
  },
  data() {
    return {
      customerObj: {},
      checkDeviceObj: {},
      selectLubricationPointNumber: "",
      addDeviceDialog: false, // 新建设备弹框
      deviceTypeDialog: "",
      addLubricationPointDialog: false,
      tipsData: {},
      showSyncLubDialog: false,
      searchForm: {
        deviceName: "",
        deviceType: [],
        groupId: [],
        devicePosition: "",
        workshopId: "",
        deviceCode: ""
      },
      distributionPerson: {},
      chooseTranferWorkshopDialog: false,
      resultNotice: false,
      lumSearch: "", // 润滑点搜索字段
      workshopSearch: "", // 选择设备弹框搜索字段
      checkedLumNew: [], // 记录弹框内新选的润滑点信息，在搜索和添加完润滑点后要复选上
      checkDeviceData: [], // 选择的设备数据
      workshopList: [],
      loadingDevice: false,
      loadMoreDeviceFlag: false,
      loadMoreLumPointFlag: false,
      loadMoreWorkshopFlag: false, // 加载更多车间
      deviceListTotal: 0,
      lupTableTotal: 0,
      deviceCurrent: 1,
      deviceTypeList: [],
      templateFitter: false, // 服务项是否限制了特定的润滑点
      groupList: [],
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
      // 新建设备
      addDeviceDialogFlag: false,
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
      checkedAddLum: {},
      lubPointCurrent: 1,
      lupDeviceNameList: [],
      workshopId: "",
      loadingPerson: false,
      workshopData: [], // 车间列表
      workshopTotal: 0,
      workshopCurrent: 1
    };
  },
  created() {
    // 获取设备类型
    this.getDeviceTypeList();
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
        companyName: this.companyName,
        companyNumber: this.companyNumber,
        companyId: this.companyId
      };
      this.deviceTypeDialog = "addDeviceAndLubpoint";
      this.addDeviceDialog = true;
    },
    closeSyncLubDialog() {
      this.showSyncLubDialog = false;
      this.successNext();
    },
    // 创建润滑点
    createLup(item) {
      this.checkDeviceObj = item;
      this.deviceTypeDialog = "addLumPoint";
      this.addLubricationPointDialog = true;
    },
    // 添加润滑点成功
    addOrEditLup() {
      this.addLubricationPointDialog = false;
      this.successNext();
    },
    // 取消编辑润滑点
    closeDialogAddLubPoint() {
      this.addLubricationPointDialog = false;
    },
    // 选择车间
    handleDistributionnChange(row) {
      this.workshopId = row.workshopId;
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
    successNext() {
      this.addLupDialogFlag = false;
      let checkArr = [];
      this.lupTableData.map(item => {
        item.lubPointDtoList.map(it => {
          item.checkList.map(itCheckedIt => {
            if (it.lubricationPointNumber == itCheckedIt) {
              checkArr.push(it);
            }
          });
        });
      });
      this.checkedLumNew = this.checkedLumNew.concat(checkArr);
      this.lubPointCurrent = 1;
      this.queryLubPointByDevice();
    },
    // 关闭弹框
    closeDialog() {
      this.addLupDialogFlag = false;
    },
    rowKey(row) {
      return row.deviceId;
    },
    getDeviceTypeList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", { filterFlag: true }).then(res => {
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
      if (val) {
        this.deviceCurrent = 1;
        this.checkDeviceData = [];
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
      if (this.urlType == "workOrder" || this.urlType == "workOrderReport") {
        params.companyNumber = this.companyNumber;
        params.workshopId = this.workshopId;
        params.plantStudyServiceFlag = this.plantStudyServiceFlag;
        params.reportType = this.reportType;
        params.coreDataTemplateId = this.coreDataTemplateId;
        params.serviceNumber = this.serviceNumber;
        url = "/workOrder/getDeviceByCompany";
      } else if (this.urlType == "MSLAWorkOrder" || this.urlType == "lubrTable") {
        url = "/web/device/queryAllDeviceByPage";
      } else if (this.urlType == "createPopOrRop" || this.urlType == "parameter") {
        params.companyNumber = this.companyNumber;
        url = "/workOrder/getDeviceByCompany";
      } else if (this.urlType == "workshop") {
        params.companyNumber = this.companyNumber;
        params.workshopId = this.workShopId;
        url = "/web/device/deviceListOfAccount";
      }
      params.userId = this.$userInfo.userId;
      url = "customize/form/record/deviceList";
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
          this.$nextTick(() => {
            if (this.checkedDeviceId) {
              this.deviceTableData.some((item, index) => {
                if (item.id == this.checkedDeviceId) {
                  this.$refs.deviceTableRef.toggleRowSelection(item, true);
                  this.checkDeviceData = [
                    {
                      id: this.checkedDeviceId
                    }
                  ];
                  return true;
                }
              });
            }
          });
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
      });
    },
    getTemplateFitter() {
      const params = {
        reportType: this.reportType
      };
      params.templateId = this.coreDataTemplateId;
      params.serviceNumber = this.serviceNumber;
      this.requestMethodGet("/workOrder/getTemplateFitter", params).then(res => {
        if (res.data.code == 1000) {
          this.templateFitter = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
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
      if (val.length == 1) return (this.checkDeviceData = [row]);
      const prevSel = val.shift();
      this.$refs.deviceTableRef.toggleRowSelection(prevSel, false);
      this.checkDeviceData = [row];
    },
    handleCellClick(row) {
      if (!row.disabled) {
        this.$refs.deviceTableRef.toggleRowSelection(row);
      }
      let ids = this.checkDeviceData.map(item => {
        return item.id;
      });
      if (ids.includes(row.id)) {
        this.checkDeviceData.forEach((item, index) => {
          if (item.id == row.id) {
            this.checkDeviceData.splice(index, 1);
          }
        });
      } else {
        this.checkDeviceData.push(row);
      }
    },
    // 全选
    selectAllDevice(val) {
      this.checkDeviceData = val;
    },
    // 取消选择
    cancelChoose() {
      this.checkDeviceData = [];
      this.$emit("cancelChooseDeviceAndLup");
    },
    // 搜索润滑点
    lumSearchChange() {
      let checkArr = [];
      this.lupTableData.map(item => {
        item.lubPointDtoList.map(it => {
          item.checkList.map(itCheckedIt => {
            if (it.lubricationPointNumber == itCheckedIt) {
              checkArr.push(it);
            }
          });
        });
      });
      this.checkedLumNew = checkArr;
      this.lubPointCurrent = 1;
      this.lupTableData = [];
      this.queryLubPointByDevice("search");
    },
    // 选择转移车间的车间搜索
    workShopSearch() {
      this.workshopCurrent = 1;
      this.workshopData = [];
      this.queryWorkShopList("search");
    },
    // 下一步选择润滑点

    nextChooseLup() {
      if (!this.checkDeviceData.length) {
        this.$message({
          type: "warning",
          message: "请选择设备"
        });
        return;
      }
      if (this.urlType != "workshop") {
        this.checkedLumNew = [];
        this.lubPointCurrent = 1;
        this.lumSearch = "";
        this.queryLubPointByDevice();
      } else {
        this.chooseTranferWorkshopDialog = true;
        this.workshopCurrent = 1;
        this.queryWorkShopList();
      }
    },
    getLupDeviceNameList(deviceCode) {
      const params = {
        deviceCode: deviceCode,
        lubPointName: "",
        status: 1,
        current: 1,
        size: 100
      };
      this.lupDeviceNameList = [];
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
    // 加载更多润滑点
    loadMoreLumPoint() {
      if (this.loadMoreLumPointFlag && this.lupTableData.length < this.lupTableTotal) {
        ++this.lubPointCurrent;
        this.queryLubPointByDevice("scroll");
      }
    },
    // 加载更多车间
    loadMoreWorkshop() {
      if (this.loadMoreWorkshopFlag && this.workshopData.length < this.workshopTotal) {
        ++this.workshopCurrent;
        this.queryWorkShopList("scroll");
      }
    },
    // 查询车间列表
    queryWorkShopList(val) {
      let params = {
        companyId: this.companyId,
        noWorkShopFlag: true,
        current: this.workshopCurrent,
        size: 20,
        workshopName: this.workshopSearch
      };
      this.loadingPerson = true;
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.loadingPerson = false;
          const data = res.data.data.list || [];
          this.workshopTotal = res.data.data.totalCount;
          if (!val) {
            this.workshopData = data;
          } else {
            this.workshopData = this.workshopData.concat(data);
          }

          if (this.workshopData.length < this.workshopTotal) {
            this.loadMoreWorkshopFlag = true;
          } else {
            this.loadMoreWorkshopFlag = false;
          }
        } else {
          this.loadingPerson = false;
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查询润滑点数据
    queryLubPointByDevice(val) {
      let deviceIds = [];
      this.checkDeviceData.forEach(it => {
        deviceIds.push(it.id);
      });
      let url = "";
      let params = {};
      params.deviceIds = deviceIds.toString();
      params.current = this.lubPointCurrent;
      params.size = 10;
      params.searchCondition = this.lumSearch;
      params.reportType = this.reportType;
      params.serviceNumber = this.serviceNumber;
      params.templateId = this.coreDataTemplateId;
      url = "/workOrder/getLubPointByDevice";
      this.loadingLup = true;
      this.requestMethodGet(url, params).then(res => {
        if (res.data.code == 1000) {
          this.chooseLupDialog = true;
          this.loadingLup = false;
          if (res.data.data.list.length > 0) {
            res.data.data.list.map(item => {
              this.$set(item, "checkList", []);
            });
          }
          if (!val) {
            this.lupTableData = res.data.data.list;
          } else {
            this.lupTableData = this.lupTableData.concat(res.data.data.list);
          }

          if (this.lumSearch) {
            this.resultNotice = true;
          } else {
            this.resultNotice = false;
          }
          this.lupTableTotal = res.data.data.totalCount;
          if (this.lupTableData.length < this.lupTableTotal) {
            this.loadMoreLumPointFlag = true;
          } else {
            this.loadMoreLumPointFlag = false;
          }
          if (this.urlType == "MSLAWorkOrder") {
            this.lupTableData.map(item => {
              item.lubPointDtoList.map(it => {
                this.checkedDevice.map(itCheckedIt => {
                  if (it.lubricationPointId == itCheckedIt.id) {
                    item.checkList.push(it.lubricationPointNumber);
                    it.disabled = true;
                  }
                });
                if (this.checkedLumNew.length > 0) {
                  this.checkedLumNew.map(itCheckedIt => {
                    if (it.lubricationPointNumber == itCheckedIt.lubricationPointNumber) {
                      item.checkList.push(itCheckedIt.lubricationPointNumber);
                    }
                  });
                }
              });
            });
          } else {
            this.lupTableData.map(item => {
              item.lubPointDtoList.map(it => {
                this.checkedDevice.map(itCheckedIt => {
                  if (it.lubricationPointNumber == itCheckedIt.lubricationPointNumber) {
                    item.checkList.push(itCheckedIt.lubricationPointNumber);
                    it.disabled = true;
                  }
                });
                if (this.checkedLumNew.length > 0) {
                  this.checkedLumNew.map(itCheckedIt => {
                    if (it.lubricationPointNumber == itCheckedIt.lubricationPointNumber) {
                      item.checkList.push(itCheckedIt.lubricationPointNumber);
                    }
                  });
                }
              });
            });
          }
          if (this.checkedlubricationPointNumber) {
            this.lupTableData[0].checkList = [this.checkedlubricationPointNumber];
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 关闭选择润滑点
    cancelChooseLup() {
      this.lumSearch = "";
      this.chooseLupDialog = false;
    },
    // 关闭选择转移车间弹框
    cancelChooseWorkshop() {
      this.distributionPerson = {};
      this.workshopSearch = "";
      this.chooseTranferWorkshopDialog = false;
    },
    // 上一步
    upStep() {
      if (this.urlType != "workshop") {
        // 返回上一步时把当前选中的润滑点清掉
        this.tempCheckLupList = [];
        this.radioLupRow = {};
        this.chooseLupDialog = false;
      } else {
        // 车间管理 选择转移车间
        this.workshopSearch = "";
        this.distributionPerson = {};
        this.chooseTranferWorkshopDialog = false;
      }
    },
    // 调取转移车间接口
    tanferWorkshop(params) {
      this.requestMethodPost("/weChat/workshop/changeDeviceWorkshopBatch", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "设备转移成功"
          });
          this.chooseTranferWorkshopDialog = false;
          this.$emit("confirmTranfer");
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.$gio.Clicktotransferdevice({
          entrance: "选择设备页"
        })
      });
    },
    // 确定选择
    async confirmChoose() {
      // 如果是车间管理的确认
      if (this.urlType == "workshop") {
        if (!this.workshopId) {
          this.$message({
            type: "error",
            message: "请选择车间"
          });
          return;
        }
        let deviceNumbers = [];
        this.checkDeviceData.forEach(it => {
          deviceNumbers.push(it.deviceNumber);
        });
        let params = {
          companyId: this.companyId,
          workshopId: this.workshopId,
          deviceNumberList: deviceNumbers
        };
        this.requestMethodPost("/weChat/workshop/getNoMoveDevice", params).then(res => {
          if (res.data.code == 1000) {
            let result = res.data.data;
            let param = {
              companyId: this.companyId,
              workshopId: this.workshopId
            };
            if (!result.canEditFlag) {
              let msg = "";
              if (result.moveCount != 0) {
                msg = `有${result.noMoveCount}台设备无法变更车间，是否要转移剩余的${result.moveCount}台设备`;
              } else {
                msg = `您所选的${result.noMoveCount}台设备均无法变更车间。`;
              }

              this.$confirm(msg, "", {
                confirmButtonText: result.moveCount != 0 ? "确定" : "知道了",
                cancelButtonText: "取消",
                showCancelButton: result.moveCount != 0 ? true : false,
                type: "warning"
              })
                .then(() => {
                  if (result.moveCount != 0) {
                    param.deviceNumberList = result.moveList;
                    this.tanferWorkshop(param);
                  }
                })
                .catch(() => {});
            } else {
              param.deviceNumberList = deviceNumbers;
              this.tanferWorkshop(param);
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      } else {
        // 如果是选润滑点
        let checkArr = [];
        this.lupTableData.map(item => {
          item.lubPointDtoList.map(it => {
            item.checkList.map(itCheckedIt => {
              if (it.lubricationPointNumber == itCheckedIt) {
                checkArr.push(it);
              }
            });
          });
        });
        if (!checkArr.length) {
          this.$message({
            type: "error",
            message: "请至少选择一个润滑点"
          });
          return;
        }
        let num = 0;
        checkArr.forEach(it => {
          if (it.disabled) {
            num++;
          }
        });
        if (checkArr.length > this.selectMax + num) {
          this.$message({
            type: "error",
            message: "最多可再添加" + this.selectMax + "个润滑点"
          });
          return;
        }
        const list = this.checkedDevice.concat(checkArr);
        await this.handleIcon(list);
        this.chooseLupDialog = false;
        // 选中润滑点和列表带过来的润滑点需要去重后添加进列表中
        if (this.urlType == "MSLAWorkOrder" || this.urlType == "lubrTable") {
          this.checkedDevice.forEach((it, index) => {
            checkArr.forEach((item, index1) => {
              if (item.lubricationPointId == it.id) {
                checkArr.splice(index1, 1);
              }
            });
          });
          this.$emit("confirmChooseLup", checkArr);
          this.tempCheckLupList = [];
        } else {
          this.$emit("confirmChooseLup", _.uniqBy(list, "lubricationPointNumber"));
          this.tempCheckLupList = [];
        }
      }
    },
    // 处理数据，获取icon的全路径
    async handleIcon(array) {
      for (var i = 0; i < array.length; i++) {
        var data = array[i];
        if (data.lubricationPointPicPath) {
          this.getFullUrl(data);
        }
      }
    },
    // 获取图片全路径
    getFullUrl(val) {
      const params = {
        url: val.lubricationPointPicPath
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(val, "lubricationPointPicPathFull", res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    changeSelLubPoint(value, item) {
      item.checkList = [value.pop()];
    },
    cellClass(row) {
      if (row.columnIndex == 0) return "table-header-line";
    }
  }
};
</script>
<style lang="less" scoped>
.checkbox-wrap {
  margin: 16px 0;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-bottom: none;
}
.checkbox-box {
  padding: 0px 0px 0;
}
.checkbox {
  border-bottom: 1px solid #e9e9e9;
  width: 100%;
  padding: 10px 0;
}
.empty-style {
  height: 53px;
  line-height: 53px;
  text-align: center;
  font-size: 13px;
  color: #999;
  border-bottom: 1px solid #e9e9e9;
}
.load-style {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #999;
}
/deep/ .checkbox-wrap .el-checkbox__input {
  position: relative;
  top: -8px;
  margin-left: 20px;
}

/deep/ .el-dialog {
  border-radius: 10px;
  box-shadow: 0 0 10px #ccc;
  border: 1px solid rgba(204, 204, 204, 0.5);
}
/deep/ .el-dialog__header {
  padding: 10px 20px;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}

/deep/ .el-table .table-header-line .cell .el-checkbox__inner {
  display: none;
}
</style>
