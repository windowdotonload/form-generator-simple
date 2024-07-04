<template>
  <div style="position:relative">
    <div class="work-order-component" :style="mainminheight">
      <!-- 基础信息 -->
      <div class="right-content">
        <div class="line"></div>
        <div class="right-title">基础信息</div>
      </div>
      <!-- 基础信息表单 -->
      <el-form ref="baseForm" :model="baseForm" :rules="baseFormRules" label-width="80px">
        <el-form-item label="任务类型">
          <el-select style="width:500px" v-model="baseForm.taskType" placeholder="请选择" size="small" :disabled="pageType == 'task' || pageType == 'todo' || pageType =='abnormal'" @change="taskTypeChange">
            <el-option v-for="item in taskTypeList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务主题" prop="planTitle">
          <el-input v-model="baseForm.planTitle" size="small" placeholder="请输入" maxlength="20" show-word-limit style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="执行方式" prop="actionTypeAndActionTargets">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-select v-model="baseForm.actionType" style="width:180px" placeholder="请选择" size="small" @change="implementChange" :disabled="pageType == 'abnormal'">
                <el-option v-for="item in implementTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <el-select
                :key="actionTargetsKey"
                @change="actionTargetsChange"
                v-model="baseForm.actionTargets"
                style="width:310px"
                :disabled="pageType == 'abnormal'"
                clearable
                :multiple="baseForm.actionType < 3"
                placeholder="请选择"
                size="small"
              >
                <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!-- 选择按岗领取 -->
          <div style="font-size:12px;color:#999" v-if="baseForm.actionType == 1 && showPlaceholder">所选岗位的用户可领取该任务</div>
          <!-- 指定领取人 -->
          <div style="font-size:12px;color:#999" v-if="baseForm.actionType == 2 && showPlaceholder">指定用户可领取该任务</div>
          <!-- 指定负责人 -->
          <div style="font-size:12px;color:#999" v-if="baseForm.actionType == 3 && showPlaceholder">指定用户负责该任务</div>
        </el-form-item>
        <el-form-item label="有效时间" prop="startTimeAndEndTime">
          <el-date-picker
            size="small"
            style="width:248px"
            clearable
            v-model="baseForm.planStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            @change="planStartTimeChange"
            placeholder="开始日期"
            :picker-options="startTimePickerOptions"
            :disabled="disabledSelValidateTime"
          >
          </el-date-picker>
          <el-date-picker
            size="small"
            style="width:248px"
            clearable
            :disabled="baseForm.planStartTime == '' || !baseForm.planStartTime || disabledSelValidateTime"
            :picker-options="endTimePickerOptions"
            v-model="baseForm.planEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否生效">
          <el-switch v-model="baseForm.planStatus" active-color="#001450" inactive-color="#999"> </el-switch>
        </el-form-item>
      </el-form>
      <!-- 任务项 -->
      <div class="right-content">
        <div class="line"></div>
        <div class="right-title">任务设置</div>
      </div>
      <div class="operation-contaienr">
        <div class="operation-left-sel-cycle">
          <div class="operation-top-header">
            <div class="operation-left-sel-cycle-title">计划周期</div>
            <el-button class="operation-create-cycle-btn" @click="createCycle"><i class="el-icon-plus" style="margin-right:5px;color:#d10000" />添加计划</el-button>
          </div>
          <div class="operation-cycle-list-container">
            <div
              class="operation-cycle-list-container-item"
              :class="activeCycleId == item.__cycleId ? 'active' : ''"
              v-for="(item, index) in planCycles"
              :key="item.__cycleId"
              @click="checkCyclye(item)"
            >
              <div class="operation-cycle-item-header">
                <span>任务计划 {{ index + 1 }}</span>
                <div>
                  <el-button type="text" style="color:#001450" @click.stop="editCycleItem(item)">编辑</el-button>
                  <el-button type="text" style="color:#d10000" @click.stop="deleteCycleItem(item)">删除</el-button>
                </div>
              </div>
              <div class="cycle-line-item">
                <span style="color:#999;margin-right:10px;">日期</span>
                <div class="cycle-line-right">
                  <el-tooltip class="item" effect="dark" :content="item | handleCycleListInfo('date')" placement="top">
                    <span> {{ item | handleCycleListInfo("date") }} </span>
                  </el-tooltip>
                </div>
              </div>
              <div class="cycle-line-item">
                <span style="color:#999;margin-right:10px">时间</span>
                <div class="cycle-line-right">
                  <el-tooltip class="item" effect="dark" :content="item | handleCycleListInfo('time')" placement="top">
                    <span>{{ item | handleCycleListInfo("time") }}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 异常记录详情进来是 repair -->
        <div class="right-sel-info-cotainer">
          <!-- 选择设备 -->
          <div style="font-size:14px;color:#606266" v-if="(pageType != 'abnormal' || (taskType == 'addOil' || taskType == 'changeOil' || taskType == 'addFat')) && activeCycleId">
            <span style="color:#F56C6C">*</span>
            {{
              taskType == "check" || taskType == "general" || taskType == "repair" || taskType == "other"
                ? `${$route.query.editId ? "编辑" : "编辑"}设备`
                : `${$route.query.editId ? "编辑" : "编辑"}润滑点`
            }}
            <!-- 任务类型为“检查”、“一般保养”、“维修”，则显示选择设备按钮， 任务类型为“加油”、“换油”、“加脂”，则显示选择润滑点按钮-->
            <el-button type="danger" size="small" plain :disabled="pageType == 'abnormal'" @click="chooseDeviceOrLup" style="margin-left:10px">
              {{
                taskType == "check" || taskType == "general" || taskType == "repair" || taskType == "other"
                  ? `${$route.query.editId ? "编辑" : "编辑"}设备`
                  : `${$route.query.editId ? "编辑" : "编辑"}润滑点`
              }}
            </el-button>
          </div>
          <!-- 管理检查项 -->
          <div class="show-device-concent" v-if="taskType == 'check' && showResponeseLubList.length">
            <!-- 左侧设备卡片 -->
            <div class="device-left">
              <div
                class="device-left-card"
                v-for="(device, index) in showResponeseLubList"
                :key="index"
                @click="() => deviceCardClick(device)"
                :style="{
                  border: device.id == tempDevice.id ? '1px solid #ccddff' : '1px solid #e9e9e9',
                  backgroundColor: device.id == tempDevice.id ? 'rgba(204,221,255,0.2)' : '#f9f9f9'
                }"
              >
                <div class="device-name">{{ device.deviceName }}</div>
                <div class="card-btn">
                  <div v-if="pageType != 'abnormal'"><el-link style="color:#dd0000" @click.stop="removeItem(device)">移除</el-link></div>
                </div>
              </div>
            </div>
            <div style="width:10px;height:495px"></div>
            <!-- 右侧设备配置项 -->
            <div class="device-right">
              <!-- 头部 -->
              <!-- 设备信息 -->
              <div>
                <el-row :gutter="10">
                  <el-col :span="4">
                    <div class="device-info-content">
                      <div class="device-info-title">设备类型</div>
                      <div class="device-info-val" v-if="tempDevice.deviceTypeName.length > 10">
                        <el-tooltip class="item" effect="dark" :content="tempDevice.deviceTypeName" placement="top-start">
                          <div class="device-info-content-over">{{ tempDevice.deviceTypeName }}</div>
                        </el-tooltip>
                      </div>
                      <div v-else class="device-info-val">
                        <span>{{ tempDevice.deviceTypeName }}</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="device-info-content">
                      <div class="device-info-title">设备位置</div>
                      <div class="device-info-val" v-if="tempDevice.devicePosition && tempDevice.devicePosition.length > 10">
                        <el-tooltip class="item" effect="dark" :content="tempDevice.devicePosition" placement="top-start">
                          <div class="device-info-content-over">{{ tempDevice.devicePosition }}</div>
                        </el-tooltip>
                      </div>
                      <div class="device-info-val" v-else>
                        <span>{{ tempDevice.devicePosition }}</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="device-info-content">
                      <div class="device-info-title">设备编码</div>
                      <div class="device-info-val" v-if="tempDevice.deviceCode && tempDevice.deviceCode.length > 10">
                        <el-tooltip class="item" effect="dark" :content="tempDevice.deviceCode" placement="top-start">
                          <div class="device-info-content-over">{{ tempDevice.deviceCode }}</div>
                        </el-tooltip>
                      </div>
                      <div class="device-info-val" v-else>
                        <span>{{ tempDevice.deviceCode }}</span>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div style="display: flex;align-items: center;justify-content: space-between;">
                <div style="font-size:14px;font-weight:400;color:#999">当选中的检查内容只剩1条时，则无法修改</div>
                <div>
                  <el-select v-model="checkItemFilter" placeholder="请选择适用任务" size="small" clearable multiple @change="getDeviceCheckItem">
                    <el-option v-for="item in filterOptions" :key="item.id" :label="item.taskTypeName" :value="item.id"> </el-option>
                  </el-select>
                </div>
              </div>
              <!-- 表格 -->
              <!-- deviceItemTable ||  -->
              <div class="table-content">
                <el-table :data="activeDviceCheck || []" row-key="id" tooltip-effect="dark" height="427" ref="deviceItemRef" @select="handleSelectDeviceItem" @select-all="selectAllDeviceItem">
                  <el-table-column type="selection" :reserve-selection="true" width="55" :selectable="canSelectable"> </el-table-column>
                  <el-table-column prop="content" min-width="18%" label="检查内容" show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="taskTypeName" min-width="10%" label="适用任务" show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="lupName" min-width="15%" label="关联润滑点" show-overflow-tooltip> </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <!-- 管理设备 -->
          <div v-if="(taskType == 'general' || taskType == 'repair' || taskType == 'other') && showResponeseLubList.length">
            <el-table :data="showResponeseLubList" tooltip-effect="dark" key="id" ref="device" height="447">
              <el-table-column prop="deviceName" min-width="8%" label="设备名称" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="deviceTypeName" min-width="8%" label="设备类型" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="deviceGroupName" min-width="10%" label="设备分组" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="devicePosition" min-width="8%" label="设备位置" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="deviceCode" min-width="8%" label="设备编码" show-overflow-tooltip> </el-table-column>
              <el-table-column label="操作" min-width="12%" align="center">
                <template slot-scope="scope">
                  <el-link @click="tableRemoveItem(scope.row)" style="margin-right:10px;color:#DD0000" v-if="pageType != 'abnormal'">移除 </el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 管理润滑点 -->
          <div v-if="(taskType == 'addOil' || taskType == 'changeOil' || taskType == 'addFat') && showResponeseLubList.length">
            <el-table :data="showResponeseLubList" tooltip-effect="dark" key="id" ref="lup" height="400">
              <el-table-column prop="lubricationPointName" min-width="12%" label="润滑点名称" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="lubricationPointType" min-width="8%" label="润滑点设备类型" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="deviceName" min-width="6%" label="设备名称" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="deviceTypeName" min-width="6%" label="设备类型" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="deviceGroupName" min-width="10%" label="设备分组" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="devicePosition" min-width="8%" label="设备位置" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{ scope.row.devicePosition }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="deviceCode" min-width="8%" label="设备编码" show-overflow-tooltip> </el-table-column>
              <el-table-column label="操作" min-width="12%" align="center">
                <template slot-scope="scope">
                  <el-link @click="tableRemoveItem(scope.row)" style="margin-right:10px;color:#DD0000">移除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div style="margin-top:20px">
        <el-button size="small" @click="cancelCreate('baseForm')">取消</el-button>
        <el-button type="danger" size="small" @click="submit('baseForm')">提交</el-button>
      </div>
      <!-- 选择设备弹框 -->
      <deviceDialog
        ref="deviceDiaolg"
        :chooseDeviceDialog="chooseDeviceDialog"
        :singleFlag="false"
        :showResponeseLubList="showResponeseLubList"
        :urlType="urlType"
        :actionType="baseForm.actionType"
        :actionTargets="baseForm.actionTargets"
        :taskType="taskType"
        :companyId="deviceCompanyId"
        v-on:cancelChooseDevice="cancelChooseDevice"
        v-on:confirmChooseDevice="confirmChooseDevice"
      >
      </deviceDialog>
      <!-- 选择润滑点弹框 -->
      <lupDialogNew
        ref="lupDiaolg"
        :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
        :singleFlag="false"
        :showResponeseLubList="showResponeseLubList"
        :urlType="urlType"
        :abnormalDeviceId="abnormalDeviceId"
        :actionType="baseForm.actionType"
        :actionTargets="baseForm.actionTargets"
        :taskType="taskType"
        :companyName="userInfo.orgInfo.companyName"
        :companyNumber="userInfo.companyNumber"
        :companyId="deviceCompanyId"
        v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
        v-on:confirmChooseLup="confirmChooseLup"
      >
      </lupDialogNew>
      <!-- 取消弹框 -->
      <el-dialog :title="editId ? '取消编辑' : '取消创建'" :visible.sync="cancelDialogVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
        <span>是否放弃当前填写的内容？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialogVisible = false" size="small">取 消</el-button>
          <el-button type="danger" @click="cancelCreateOrEdit('baseForm')" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="周期频率" :visible.sync="createCycleDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form :model="baseForm" :rules="baseFormRules" label-width="80px" ref="cycleForm">
          <el-form-item label="任务周期">
            <el-select v-model="baseForm.taskCycle" placeholder="请选择" size="small" @change="taskCycleChange">
              <el-option v-for="item in taskWeekList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <!-- 年间隔 -->
          <div v-if="baseForm.taskCycle == 4">
            <el-form-item label="年间隔" prop="yearNum">
              每<el-input-number v-model="baseForm.yearNum" :min="1" :max="5" :step="1" size="small" style="width:195px;margin:0 5px"></el-input-number>年
            </el-form-item>
          </div>
          <!-- 任务周期不重复,按年 -->
          <div v-if="baseForm.taskCycle == 0 || baseForm.taskCycle == 4">
            <el-form-item label="日期" prop="dates">
              <el-date-picker size="small" v-model="baseForm.dates" value-format="yyyy-MM-dd" clearable type="dates" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
          </div>
          <!-- 任务周期按日 -->
          <div v-if="baseForm.taskCycle == 1">
            <el-form-item label="日间隔" prop="day">
              每<el-input-number v-model="baseForm.day" :min="1" :max="31" :step="1" size="small" style="width:195px;margin:0 5px"></el-input-number>日
            </el-form-item>
          </div>
          <!--任务周期按周  -->
          <div v-if="baseForm.taskCycle == 2">
            <el-form-item label="周间隔" prop="weekNum">
              每<el-input-number v-model="baseForm.weekNum" :min="1" :max="5" :step="1" size="small" style="width:195px;margin:0 5px"></el-input-number>周
            </el-form-item>
            <el-form-item label="星期" prop="week">
              <div class="week-content">
                <div
                  class="week-item"
                  @click="weekChange(item)"
                  v-for="(item, index) in weekList"
                  :key="index"
                  :style="{ color: item.active ? '#fff' : '#666', backgroundColor: item.active ? '#001450' : '#fff', border: item.active ? '1px solid #001450' : '1px solid #e9e9e9' }"
                >
                  {{ item.label }}
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 任务周期按月 -->
          <div v-if="baseForm.taskCycle == 3">
            <el-form-item label="月间隔" prop="mouthNum">
              每<el-input-number v-model="baseForm.mouthNum" :min="1" :max="12" :step="1" size="small" style="width:195px;margin:0 5px"></el-input-number>月
            </el-form-item>
            <el-form-item label="日期">
              <div class="day-content">
                <div
                  class="day-item"
                  @click="dayChange(item)"
                  v-for="(item, index) in dayList"
                  :key="index"
                  :style="{ color: item.active ? '#fff' : '#666', backgroundColor: item.active ? '#001450' : '#fff', border: item.active ? '1px solid #001450' : '1px solid #e9e9e9' }"
                >
                  {{ item.label }}
                </div>
              </div>
              <div>
                提示：若希望在每月的29/30/31日执行任务，请使用“按年”周期
              </div>
            </el-form-item>
          </div>
          <el-form-item label="时间">
            <el-select v-model="baseForm.targetTimes" placeholder="不选择生成“全天”任务" size="small" clearable multiple>
              <el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateSelCycle" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmCreateCycle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const typeMap = {
  1: "changeOil",
  2: "addOil",
  3: "addFat",
  4: "check",
  5: "general",
  6: "repair",
  changeOil: "1",
  addOil: "2",
  addFat: "3",
  check: "4",
  general: "5",
  repair: "6"
};
import lupDialogNew from "../components/chooseLubricationPointNew.vue";
import deviceDialog from "../components/chooseDevice";
import createTask from "./createTask";
import createCycleOptimize from "./createCycleOptimize";
import cloneDeep from "lodash/cloneDeep";
export default {
  components: { deviceDialog, lupDialogNew },
  mixins: [createTask, createCycleOptimize],
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 180}px`,
      customerList: [],
      userList: [],
      timeList: [],
      dayList: [],
      chooseDeviceDialog: false,
      singleFlag: false,
      taskType: "",
      chooseLupFlag: false,
      showResponeseLubList: [],
      // 选中设备右侧筛选
      checkItemFilter: [],
      filterOptions: [],
      deviceItemTable: [],
      taskTypeList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      deviceCompanyId: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId,
      chooseDeviceNumber: "",
      urlType: "createTask",
      tempDevice: "",
      pageType: "",
      editId: "",
      showPlaceholder: true,
      editDeviceList: [],
      cancelDialogVisible: false,
      abnormalId: "",
      editLoadImplementFlag: false,
      actionTargetsKey: 1,
      currentDate: "",
      abnormalDeviceNumber: "",
      abnormalDeviceId: "",
      endTimePickerOptions: {},
      chooseDeviceAndLupDialog: false,
      isCopy: false
    };
  },
  computed: {
    disabledSelValidateTime() {
      if (this.$route.query.editId && this.$route.query.taskType) {
        if ([typeMap["addOil"], typeMap["changeOil"], typeMap["addFat"]].includes(this.$route.query.taskType.toString())) return true;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.fullPath.indexOf("editId") > -1) {
      to.meta.title = "任务管理,编辑";
    } else {
      to.meta.title = "任务管理,创建";
    }
    next();
  },
  watch: {
    "baseForm.planStartTime": {
      handler: function(val, oldVal) {
        this.endTimePickerOptions = {
          disabledDate(time) {
            const currentDate = new Date();
            const oneYearLater = new Date();
            const oneYearAgo = new Date();

            oneYearLater.setFullYear(currentDate.getFullYear() + 1);
            oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
            const TIME = new Date(time).getTime();
            return TIME > oneYearLater || TIME < oneYearAgo;
            // && new Date(time).getTime() <= new Date(val).getTime() - 8.64e7;
          }
        };
      },
      immediate: true
    }
  },
  created() {
    const query = this.$route.query;
    this.isCopy = query.isCopy;
    if (query.pageFlag) {
      // 创建异常过来的
      this.baseForm.taskType = "4";
      this.taskType = "repair";
      this.baseForm.actionType = 3;
      this.baseForm.actionTargets = this.userInfo.userId;
      this.pageType = query.pageType;
      this.abnormalId = query.abnormalId;
      this.abnormalDeviceId = query.abnormalDeviceId;
      this.abnormalDeviceNumber = query.deviceNumber;
      this.baseForm.dates = [this.currentDate];
      this.implementChange();
      this.getAbnormalDetail(this.abnormalDeviceNumber, "flag");
    } else {
      if (query.editId) {
        // 编辑
        this.baseForm.taskType = query.taskType;
        this.pageType = query.pageType;
        this.editId = query.editId;
        this.taskType = this.taskList.filter(it => {
          return it.code == query.taskType;
        })[0].taskName;
      } else {
        // 新建
        this.baseForm.dates = [this.currentDate];
        this.pageType = query.pageType;
        this.taskType = query.taskType;
      }
    }
    // 获取任务类型下拉
    this.getTaskTypeData();
    // 获取适用任务
    this.getTaskList();
    if (query.editId) {
      this.getEditDetail();
    }
  },
  methods: {
    taskTypeChange(val) {
      let params = {};
      let url = "";
      params.deviceId = this.tempDevice.deviceId;
      params.actionType = this.baseForm.actionType;
      params.actionTargets = this.baseForm.actionTargets;
      this.filterTaskType();
      if (this.$route.query.pageFlag && this.$route.query.pageFlag == "createAbnormal") {
        if (val == 4) this.getDeviceCheckItem();
        return;
      }
      if (val == 1 || val == 2 || val == 3) {
        // 加，换油，脂
        url = "/device/check/taskManage/lubricationPointsByPage";
        this.handleAbnormalCreateTask(val, url, params);
      } else if (val == 4) {
        // 检查类型
        this.getAbnormalDetail(this.abnormalDeviceNumber, "");
      } else {
        // 维修，保养
        url = "/device/check/taskManage/devicesByPage";
        this.handleAbnormalCreateTask(val, url, params);
      }
    },
    filterTaskType() {
      this.taskType = this.taskList.filter(it => {
        return it.code == this.baseForm.taskType;
      })[0].taskName;
    },
    handleAbnormalCreateTask(type, url, params) {
      this.requestMethodGet(url, params).then(res => {
        if (res.data.code == 1000) {
          let data = [];
          if (type == 1 || type == 2 || type == 3) {
            data = res.data.data;
          } else {
            data = res.data.data.list;
          }
          if (type == 1 || type == 2 || type == 3 || type == 5 || type == 6) {
            // 加，换油，脂
            this.showResponeseLubList = data;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getAbnormalDetail(abnormalDeviceNumber, flag) {
      this.requestMethodGet("/web/device/queryDevice", { deviceNumber: abnormalDeviceNumber })
        .then(res => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            data.active = true;
            data.deviceId = data.id;
            this.tempDevice = data;
            data.deviceGroupNames = data.deviceGroupName;
            let arr = [];
            arr.push(data);
            // this.showResponeseLubList = arr;
            this.abnormalDeviceListCarryForm = arr;
            if (!flag) {
              this.getDeviceCheckItem();
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      this.showResponeseLubList = cloneDeep(list);
      console.log("thisi s list confirmChooseLupconfirmChooseLup", this.showResponeseLubList);
      this.chooseDeviceAndLupDialog = false;
      this.setCycleLubPoint(list, this.activeCycleId);
    },
    handleEditDate(dateList) {
      if (!dateList || !dateList.length) {
        return [];
      }
      const y = new Date().getFullYear() + "-";
      let arr = [];
      dateList.forEach(it => {
        it = y + it;
        arr.push(it);
      });
      return arr;
    },
    getTaskTypeData() {
      this.getDicDataList("task_type").then(res => {
        this.taskTypeList = res;
        // 根据不同类型回显
        if (!this.editId) {
          this.taskList.forEach(it => {
            if (it.taskName == this.taskType) {
              this.baseForm.taskType = it.code;
            }
          });
          this.implementChange();
        }
      });
    },
    // 执行方式
    implementChange(val) {
      // 根据不同的执行方式查询不同的人员
      // 1.岗位；2.指定人；3.指定负责人
      ++this.actionTargetsKey;
      if (this.pageType != "abnormal" && !this.editLoadImplementFlag) {
        if (val == 1 || val == 2) {
          this.baseForm.actionTargets = [];
        } else {
          this.baseForm.actionTargets = "";
        }
      }
      this.showResponeseLubList = [];
      this.userList = [];
      const params = {
        useStateFlag: 1,
        taskType: this.baseForm.taskType,
        actionType: this.baseForm.actionType
      };
      if (this.editLoadImplementFlag) {
        params.filterFlag = false;
        this.editLoadImplementFlag = false;
      }
      params.menuCode = "MyTeam";
      this.requestMethodGet("/device/check/taskManage/actionTarget", params).then(res => {
        if (res.data.code == 1000) {
          this.userList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    actionTargetsChange() {
      this.showResponeseLubList = [];
    },
    // 查询所属客户
    getCustomerData() {
      let params = {
        companyType: 2,
        size: 500,
        status: 1,
        companyName: this.selectCompanyName
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.getCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        this.getCustomerData();
      }
    },
    // 星期点击事件
    weekChange(item) {
      const data = this.weekList;
      let activeArr = [];
      data.forEach(it => {
        if (it.value == item.value) {
          it.active = !it.active;
        }
      });
      data.forEach(it => {
        if (it.active) {
          activeArr.push(it.value);
        }
      });
      this.baseForm.week = activeArr;
    },
    // 任务周期-按月，天点击
    dayChange(item) {
      const data = this.dayList;
      let activeArr = [];
      data.forEach(it => {
        if (it.value == item.value) {
          it.active = !it.active;
        }
      });
      data.forEach(it => {
        if (it.active) {
          activeArr.push(it.value);
        }
      });
      this.baseForm.mouth = activeArr;
    },
    // 选择设备或者润滑点
    chooseDeviceOrLup() {
      // 任务类型为“检查”、“一般保养”、“维修”，则显示选择设备按钮， 任务类型为“加油”、“换油”、“加脂”，则显示选择润滑点按钮
      if (this.taskType == "check" || this.taskType == "general" || this.taskType == "repair" || this.taskType == "other") {
        // 选择设备
        this.chooseDeviceDialog = true;
      } else {
        // 选择润滑点
        this.chooseDeviceAndLupDialog = true;
      }
    },
    cancelChooseDevice() {
      this.chooseDeviceDialog = false;
    },
    // 选中设备确定
    confirmChooseDevice(list) {
      if (!list.length) {
        return;
      }
      if (this.taskType == "check") {
        const currentList = JSON.parse(JSON.stringify(this.showResponeseLubList));
        let arr = _.uniqBy(list.concat(this.showResponeseLubList), "id");
        list = arr;

        if (!this.showResponeseLubList.length) {
          list[0].active = true;
          this.tempDevice = list[0];
          this.getDeviceCheckItem();
        }
        list.forEach(item => {
          const existItem = currentList.find(cur => cur.id == item.id);
          if (existItem) {
            item.deviceCheck = existItem.deviceCheck;
          }
          if (item.id == this.tempDevice.id) {
            item.active = true;
          } else {
            item.active = false;
          }
        });
      }

      this.showResponeseLubList = list;
      this.chooseDeviceDialog = false;
      this.setCycleLubPoint(list, this.activeCycleId, "device");
    },
    // 设备卡片点击
    deviceCardClick(device) {
      this.showResponeseLubList.forEach(it => {
        if (it.id == device.id) {
          it.active = true;
        } else {
          it.active = false;
        }
      });
      this.tempDevice = device;
      this.getDeviceCheckItem();
    },
    canSelectable(row, index) {
      let checkArr = this.$refs.deviceItemRef.selection;
      if (checkArr.length == 1) {
        if (row.id == checkArr[0].id) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    getTaskList() {
      const params = {
        companyId: this.userInfo.orgId
      };
      this.requestMethodGet("/device/check/checkItem/deviceOptionList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(it => {
            it.id = it.id.toString();
          });
          this.filterOptions = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 选择项
    handleSelectDeviceItem(list) {
      this.handleCheck(list);
    },
    // 全选
    selectAllDeviceItem(list) {
      this.handleCheck(list);
    },
    handleCheck(list) {
      if (!list.length) {
        return;
      }
      let arr = [];
      list.forEach(item => {
        arr.push(item.id);
      });
      this.showResponeseLubList.forEach(item => {
        if (item.id == this.tempDevice.id) {
          item.checkItemList = list;
          item.checkItemIdsList = arr;
          item.deviceCheck = list.map(i => ({
            id: i.id
          }));
        }
      });
      const editItem = this.planCycles.find(item => item.__cycleId == this.activeCycleId);

      if (!editItem) return;
      const editDevice = editItem.taskPlanTargetRels.find(item => item.targetId == this.tempDevice.id);
      if (!editDevice) return;
      editDevice.deviceCheck = list.map(i => ({
        id: i.id
      }));
    },
    // 取消
    cancelCreate(formName) {
      this.cancelDialogVisible = true;
      this.$gio.cancelCreateTask({
        operation: "点击底部取消按钮"
      });
    },
    cancelCreateOrEdit(formName) {
      this.$router.back();
    },
    // 新建提交
    createSubmit(url, params) {
      if (!params.planCycles || params.planCycles.length == 0) {
        this.$message({
          type: "warning",
          message: "请先创建计划周期"
        });
        return;
      }
      const checkLubRquired = params.planCycles.some((cycle, index) => {
        if (!cycle.taskPlanTargetRels || cycle.taskPlanTargetRels.length == 0) {
          this.$message({
            type: "warning",
            message: `任务计划${index + 1} 未选择润滑点`
          });
          return true;
        }
      });
      if (checkLubRquired) return;
      params.planCycles.forEach(cycle => {
        if ("taskPlanTargetRelDtos" in cycle) delete cycle.taskPlanTargetRelDtos;
      });
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          // 异常创建任务需要关联异常
          if (this.pageType == "abnormal") {
            const params = {
              abnormalId: this.abnormalId,
              associationType: 1,
              targetIds: Array.isArray(res.data.data) ? [...res.data.data] : res.data.data.split(",")
            };
            this.requestMethodPost("/device/check/abnormal/associate", params).then(res => {
              if (res.data.code == 1000) {
                setTimeout(() => {
                  this.$router.back();
                }, 800);
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
          } else {
            setTimeout(() => {
              this.$router.back();
            }, 800);
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleDate(dateList) {
      if (!dateList.length) {
        return [];
      }
      let list = [];
      const y = new Date().getFullYear() + "-";
      dateList.forEach(it => {
        list.push(it.split(y)[1]);
      });
      return list;
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 180}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.work-order-component {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
}
.right-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 50px;
  background-color: #f9f9f9;
  border: 1px solid #e9e9e9;
  border-left: none;
  margin-bottom: 20px;
}
.line {
  margin-left: 20px;
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.right-title {
  line-height: 50px;
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
.week-content {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.week-item {
  width: 56px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  color: #666;
  background-color: #fff;
  cursor: pointer;
  margin-right: 10px;
}
.week-item:hover {
  border: 1px solid #001450 !important;
  color: #001450 !important;
}
.day-content {
  width: 300px;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  flex-direction: row;
}
.day-item {
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  color: #666;
  background-color: #fff;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
}
.day-item:hover {
  border: 1px solid #001450 !important;
  color: #001450 !important;
}
.show-device-concent {
  margin-top: 20px;
  height: 495px;
  display: flex;
}
.device-left {
  width: 200px;
  height: 495px;
  overflow-y: auto;
}
.device-left-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 66px;
  width: 135px;
  border-radius: 4px;
  padding: 12px 14px;
  border: 1px solid #e9e9e9;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  cursor: pointer;
}
.device-left-card:hover {
  border: 1px solid #dd0000;
}
.device-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.card-btn {
  display: flex;
  justify-content: space-between;
}
.device-right {
  flex: 1;
  border: 1px solid #e9e9e9;
  padding: 15px 10px 0 15px;
  border-radius: 4px;
}
.device-info-content {
  display: flex;
  align-items: center;
}
.device-info-title {
  width: 60px;
  font-size: 14px;
  color: #606266;
}
.device-info-val {
  flex: 1;
  width: 150px;
  font-size: 14px;
}
.device-info-content-over {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #000;
}
.operation-contaienr {
  display: flex;
  flex-wrap: nowrap;
  position: inherit;
  width: 100%;
  box-sizing: border-box;
}
.operation-left-sel-cycle {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 15%;
  height: 100%;
  border-right: 1px solid var(--e-9-e-9-e-9, #e9e9e9);
}
.right-sel-info-cotainer {
  position: relative;
  width: 88%;
  box-sizing: border-box;
  padding-left: 16px;
  box-sizing: border-box;
}
.operation-contaienr {
  border-bottom: 1px solid var(--e-9-e-9-e-9, #e9e9e9);
}
.operation-top-header {
  width: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  height: 80px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--e-9-e-9-e-9, #e9e9e9);
}
.operation-left-sel-cycle-title {
  font-weight: bolder;
  height: fit-content;
  width: 100%;
  font-size: 15px;
  padding-top: 5px;
  padding-left: 3px;
}
.operation-create-cycle-btn {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 6px;
  width: 90%;
  margin-top: 10px;
  color: #d10000;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid var(--dd-0000, #d00);
  background: var(--dd-00005, rgba(221, 0, 0, 0.05));
  font-size: 13px;
  margin-bottom: 10px;
}
.operation-split-line {
  height: 1px;
  width: 100%;
  border-bottom: 1px solid var(--e-9-e-9-e-9, #e9e9e9);
}
.operation-left-sel-cycle {
  box-sizing: border-box;
  position: relative;
}
.operation-cycle-list-container {
  width: 100%;
  max-height: 380px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  height: fit-content;
  overflow-x: hidden;
  overflow-y: auto;
  align-items: flex-start;
  cursor: pointer;
}
.operation-cycle-list-container::-webkit-scrollbar {
  display: none;
}
.operation-cycle-list-container-item {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  height: fit-content;
  padding-bottom: 5px;
  padding-left: 5px;
  border-bottom: 1px solid var(--e-9-e-9-e-9, #e9e9e9);
}
.operation-cycle-list-container-item:last-child {
  border-bottom: none;
}
.operation-cycle-item-header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  box-sizing: border-box;
  padding-right: 8px;
  margin-bottom: 8px;
}
.active {
  box-sizing: border-box;
  border-left: 3px solid var(--dd-0000, #d00);
  background: var(--background-f-9-f-9-f-9, #f9f9f9);
}
.cycle-line-item {
  font-size: 15px;
  margin-bottom: 5px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.cycle-line-right {
  box-sizing: border-box;
  padding-right: 8px;
  width: 60%;
  text-align: end;
  overflow: hidden;
  height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cycle-line-item:last-child {
  margin-bottom: 0;
}
</style>
